from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import Response, APIView
from django.utils.crypto import get_random_string
from ..models import Tournament, Schedule
from .utilities import schedule_util
from django.shortcuts import get_object_or_404
from django.shortcuts import render


def docs(request):
    return render(request, 'docs.html')


class TournamentAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            tournament_name = request.data['name']
        except KeyError:
            tournament_name = str(get_random_string(length=32))

        number_of_teams = request.data['number_of_teams']

        tournament = Tournament(name=tournament_name, number_of_teams=number_of_teams)

        rounds = schedule_util(range(1, number_of_teams + 1))

        content = {'tournament_name': tournament_name, 'schedule': []}

        index_rounds = 1
        for rnd in rounds:
            round_name = 'round{}'.format(index_rounds)
            content['schedule'].append({round_name: []})
            for match in rnd:
                content['schedule'][index_rounds-1][round_name].append({'team{} vs team{}'.format(match[0], match[1]): '0:0', 'ended': False})
            index_rounds += 1

        tournament.save()

        schedule = Schedule(data=content)
        schedule.tournament = tournament
        schedule.save()

        return Response(content, status.HTTP_201_CREATED)


class ScheduleAPIView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, tournament_name, show=None):
        tournament = get_object_or_404(Tournament, name=tournament_name)
        schedule = tournament.schedule
        json = schedule.data
        results = []
        for i in range(1, tournament.number_of_teams + 1):
            results.append({'team{}'.format(i): {'wins': 0, 'draws': 0, 'defeats': 0}})
        for i in range(len(json['schedule'])):
            for match in json['schedule'][i]['round{}'.format(i + 1)]:
                for name in match:
                    if name == 'ended':
                        continue
                    f_res, s_res = match[name].split(':')
                    first_team, seconds_team = name.split(' vs ')
                    if f_res > s_res:
                        for obj in results:
                            for nm in obj:
                                if nm == first_team:
                                    obj[nm]['wins'] += 1
                                elif nm == seconds_team:
                                    obj[nm]['defeats'] += 1
                    elif f_res < s_res:
                        for obj in results:
                            for nm in obj:
                                if nm == first_team:
                                    obj[nm]['defeats'] += 1
                                elif nm == seconds_team:
                                    obj[nm]['wins'] += 1
                    elif match['ended']:
                        for obj in results:
                            for nm in obj:
                                if nm == first_team:
                                    obj[nm]['draws'] += 1
                                elif nm == seconds_team:
                                    obj[nm]['draws'] += 1
        if show == 'completed':
            showing_json = {'schedule': []}
            for i in range(len(json['schedule'])):
                for match in json['schedule'][i]['round{}'.format(i + 1)]:
                    for name in match:
                        if name != 'ended':
                            continue
                        if match[name]:
                            showing_json['schedule'].append({'round{}'.format(i + 1): match})
            showing_json['results'] = results
            return Response(showing_json, status.HTTP_200_OK)
        elif show == 'continuing':
            showing_json = {'schedule': []}
            for i in range(len(json['schedule'])):
                for match in json['schedule'][i]['round{}'.format(i + 1)]:
                    for name in match:
                        if name != 'ended':
                            continue
                        if not match[name]:
                            showing_json['schedule'].append({'round{}'.format(i + 1): match})
            showing_json['results'] = results
            return Response(showing_json, status.HTTP_200_OK)
        else:
            json['results'] = results
            return Response(json, status.HTTP_200_OK)


class MatchesAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        tournament_name = request.data['tournament_name']
        first_team_name = request.data['first_team_name']
        second_team_name = request.data['second_team_name']
        score = request.data['score']
        tournament = get_object_or_404(Tournament, name=tournament_name)
        schedule = tournament.schedule
        json = schedule.data
        for i in range(len(json['schedule'])):
            for match in json['schedule'][i]['round{}'.format(i+1)]:
                for name in match:
                    if name == '{} vs {}'.format(first_team_name, second_team_name):
                        match[name] = score
                        match['ended'] = True
                        schedule.data = json
                        schedule.save()
                        return Response("Saved", status.HTTP_200_OK)
        return Response("Not saved", status.HTTP_304_NOT_MODIFIED)
