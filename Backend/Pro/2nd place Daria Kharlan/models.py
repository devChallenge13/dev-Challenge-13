from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class Tournament(Base):
    __tablename__ = 'tournament'
    id = Column(Integer, primary_key=True)
    name = Column(String(80), unique=True)

    games = relationship('Game', lazy='joined', back_populates='tournament')
    teams = relationship('Team', lazy='joined', back_populates='tournament')


class Team(Base):
    __tablename__ = 'team'
    id = Column(Integer, primary_key=True)
    tournament_id = Column(Integer, ForeignKey('tournament.id'))
    name = Column(String(80))

    tournament = relationship('Tournament', lazy='joined')
    home_games = relationship('Game', lazy='joined', back_populates='home_team', foreign_keys='Game.home_team_id')
    guest_games = relationship('Game', lazy='joined', back_populates='guest_team', foreign_keys='Game.guest_team_id')

    def get_stats(self):
        res = {'team': self.name, 'total_games_played': 0, Game.RESULT_WIN: 0, Game.RESULT_DRAW: 0,
               Game.RESULT_LOOSE: 0}
        for game in self.home_games:
            if game.home_team_result:
                res['total_games_played'] += 1
                res[game.home_team_result] += 1

        guest_results = {Game.RESULT_WIN: Game.RESULT_LOOSE,
                         Game.RESULT_DRAW: Game.RESULT_DRAW,
                         Game.RESULT_LOOSE: Game.RESULT_WIN}
        for game in self.guest_games:
            if game.home_team_result:
                res['total_games_played'] += 1
                res[guest_results[game.home_team_result]] += 1
        res['points'] = res[Game.RESULT_WIN] * Game.RESULT_POINTS[Game.RESULT_WIN] \
                        + res[Game.RESULT_DRAW] * Game.RESULT_POINTS[Game.RESULT_DRAW] \
                        + res[Game.RESULT_LOOSE] * Game.RESULT_POINTS[Game.RESULT_LOOSE]
        return res


class Game(Base):
    RESULT_WIN = 'win'
    RESULT_LOOSE = 'loose'
    RESULT_DRAW = 'draw'

    RESULT_POINTS = {RESULT_WIN: 3, RESULT_DRAW: 1, RESULT_LOOSE: 0}

    __tablename__ = 'game'

    id = Column(Integer, primary_key=True)
    tournament_id = Column(Integer, ForeignKey('tournament.id'))
    round_id = Column(Integer)
    home_team_id = Column(Integer, ForeignKey('team.id'))
    guest_team_id = Column(Integer, ForeignKey('team.id'))
    home_team_result = Column(Integer)

    tournament = relationship('Tournament', lazy='joined')
    home_team = relationship('Team', foreign_keys=[home_team_id], lazy='joined')
    guest_team = relationship('Team', foreign_keys=[guest_team_id], lazy='joined')
