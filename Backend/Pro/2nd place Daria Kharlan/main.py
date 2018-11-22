import config
import csv
import io
import os
import pdfkit
import random
import requests
import time

from database import db_session
from flask import abort, Flask, jsonify, render_template, request, send_file
from models import Game, Team, Tournament
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

app = Flask(__name__)

FILES_FOLDER = 'files'


@app.errorhandler(404)
def page_not_found(e):
    response = jsonify({'error': 'Not found'})
    response.status_code = 404
    return response


@app.errorhandler(400)
def bad_request(e):
    response = jsonify({'error': 'Bad request'})
    response.status_code = 400
    return response


def get_random_words(amount=1):
    words = requests.get(config.random_words_list).content.splitlines()
    return random.sample(words, amount)


def generate_rounds(teams, tournament_id, session):
    rounds = []
    if len(teams) % 2 == 1:
        teams = teams + [None]
    # manipulate map (array of indexes for list) instead of list itself
    # this takes advantage of even/odd indexes to determine home vs. away
    n = len(teams)
    list_map = list(range(n))
    mid = n // 2
    for i in range(n - 1):
        l1 = list_map[:mid]
        l2 = list_map[mid:]
        l2.reverse()
        list_round = []
        for j in range(mid):
            t1 = teams[l1[j]]
            t2 = teams[l2[j]]
            if not t1 or not t2:
                continue
            if j == 0 and i % 2 == 1:
                # flip the first match only, every other round
                # (this is because the first match always involves the last player in the list)
                list_round.append(Game(tournament_id=tournament_id,
                                       round_id=i + 1,
                                       home_team_id=t2.id,
                                       guest_team_id=t1.id))
                session.add(list_round[-1])
            else:
                list_round.append(Game(tournament_id=tournament_id,
                                       round_id=i + 1,
                                       home_team_id=t1.id,
                                       guest_team_id=t2.id))
                session.add(list_round[-1])
        rounds.append(list_round)
        # rotate list by n/2, leaving last element at the end
        list_map = list_map[mid:-1] + list_map[:mid] + list_map[-1:]

    rounds_flip = []
    for idx, rnd in enumerate(rounds):
        list_round = []
        for game in rnd:
            list_round.append(Game(tournament_id=tournament_id,
                                   round_id=idx + len(rounds),
                                   home_team_id=game.guest_team_id,
                                   guest_team_id=game.home_team_id))
            session.add(list_round[-1])
        rounds_flip.append(list_round)

    return rounds + rounds_flip


def save_to_csv(file_name, games_by_rounds, response, played):
    with open(file_name, 'w+') as f:
        if played is not False:
            writer = csv.DictWriter(f, ['team', 'total_games_played', Game.RESULT_WIN, Game.RESULT_DRAW,
                                        Game.RESULT_LOOSE, 'points'])
            writer.writeheader()
            for r in response['results']:
                writer.writerow(r)
            writer.writerow({})
            writer.writerow({})
            writer.writerow({})
        writer = csv.writer(f)
        for rnd, games in games_by_rounds.items():
            writer.writerow(['Round ' + str(rnd)])
            for game in games:
                values = [game.home_team.name, game.guest_team.name]
                if game.home_team_result:
                    values.append(game.home_team_result)
                writer.writerow(values)
            writer.writerow([])


@app.route('/create', methods=['GET'])
def create_tournament():
    db = create_engine(config.db_conn, poolclass=NullPool)
    Session = sessionmaker(db)
    session = Session()
    try:
        teams_amount = int(request.args['teams_amount'])
        tournament_name = request.args.get('name')
        if not tournament_name:
            tournament_name = get_random_words()[0].decode("utf-8") + '_' + str(int(time.time()))
        tournament = Tournament(name=tournament_name)
        session.add(tournament)
        session.flush()
        team_names = get_random_words(teams_amount)
        teams = []
        for idx, team_name in enumerate(team_names):
            teams.append(Team(tournament_id=tournament.id, name=team_name.decode("utf-8")))
            session.add(teams[idx])
        session.flush()
        rounds = generate_rounds(teams, tournament.id, session)

        session.commit()

        response = {'name': tournament_name, 'rounds': {}}
        for idx, rnd in enumerate(rounds):
            response['rounds'][idx + 1] = []
            for game in rnd:
                response['rounds'][idx + 1].append([game.home_team.name, game.guest_team.name])

        return jsonify(response)
    except (KeyError, IntegrityError):
        abort(400)
        session.rollback()
    finally:
        session.close()
        db.dispose()


@app.route('/tournament/<tournament_name>', methods=['GET'])
def schedule(tournament_name):
    tournament = db_session.query(Tournament).filter(Tournament.name == tournament_name).first()
    if not tournament:
        abort(404)

    response = {'name': tournament.name, 'rounds': {}}
    played = request.args.get('played')

    games = db_session.query(Game).filter(Game.tournament_id == tournament.id)
    if played is not None:
        played = bool(int(played))
        if played is False:
            games = games.filter(Game.home_team_result.is_(None))
        else:
            games = games.filter(Game.home_team_result.isnot(None))
    games = games.order_by(Game.round_id.asc()).all()

    games_by_rounds = {}
    for game in games:
        if game.round_id not in response['rounds']:
            games_by_rounds[game.round_id] = []
            response['rounds'][game.round_id] = []
        response['rounds'][game.round_id].append([game.home_team.name, game.guest_team.name])
        games_by_rounds[game.round_id].append(game)

    if played is not False:
        response['results'] = []
        for team in tournament.teams:
            response['results'].append(team.get_stats())

    response_format = request.args.get('format', 'json')
    if response_format == 'csv':
        file_name = os.path.join(FILES_FOLDER, tournament.name + '.csv')
        save_to_csv(file_name, games_by_rounds, response, played)

        return send_file(file_name)

    if response_format == 'pdf':
        file_name = os.path.join(FILES_FOLDER, tournament.name + '.pdf')
        pdfkit.from_string(render_template('tournament.html',
                                           tournament=tournament,
                                           results=response.get('results'),
                                           games_by_rounds=games_by_rounds),
                           file_name)
        return send_file(file_name)

    return jsonify(response)


@app.route('/result', methods=['GET'])
def set_game_result():
    try:
        tournament_name = request.args['name']
        home_team_name = request.args['home_team']
        guest_team_name = request.args['guest_team']
        home_team_result = request.args['home_team_result']
        if home_team_result not in Game.RESULT_POINTS.keys():
            raise ValueError
        tournament = db_session.query(Tournament).filter(Tournament.name == tournament_name).first()
        if not tournament:
            raise ValueError
        home_team = db_session.query(Team).filter(Team.tournament_id == tournament.id). \
            filter(Team.name == home_team_name).first()
        if not home_team:
            raise ValueError
        guest_team = db_session.query(Team).filter(Team.tournament_id == tournament.id). \
            filter(Team.name == guest_team_name).first()
        if not guest_team:
            raise ValueError

        game = db_session.query(Game).filter(Game.home_team_id == home_team.id) \
            .filter(Game.guest_team_id == guest_team.id).filter(Game.tournament_id == tournament.id).first()
        game.home_team_result = home_team_result
        db_session.commit()
        return jsonify({'result': 'success'})
    except (KeyError, ValueError):
        abort(400)


@app.route('/<tournament_name>/update', methods=['POST'])
def update_results(tournament_name):
    db = create_engine(config.db_conn, poolclass=NullPool)
    Session = sessionmaker(db)
    session = Session()

    tournament = session.query(Tournament).filter(Tournament.name == tournament_name).first()
    if not tournament:
        abort(404)

    games = {(g.home_team.name, g.guest_team.name): g for g in tournament.games}
    try:
        reader = csv.reader(io.StringIO(request.files['file'].read().decode('utf-8')), delimiter=',')
        round_id = None
        for row in reader:
            if row[0].startswith('Round'):
                round_id = row[0].split()[1]
                continue
            if not row[0]:
                round_id = None
                continue
            if round_id and len(row) >= 3:
                games[(row[0], row[1])].home_team_result = row[2]
        session.commit()
        return jsonify({'result': 'success'})
    except:
        # abort(400)
        session.rollback()
        raise
    finally:
        session.close()
        db.dispose()


if __name__ == '__main__':
    app.run()
