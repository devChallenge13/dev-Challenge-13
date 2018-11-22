from rest_framework.test import APITestCase
from django.urls import reverse
from django.utils.crypto import get_random_string
from rest_framework import status
from ..models import Schedule


class TournamentTestCase(APITestCase):
    def test_create_tournament_with_custom_name(self):
        create_url = reverse('create-tournament')
        random_str = str(get_random_string(length=32))
        data = {
            'name': random_str,
            'number_of_teams': 4
        }
        response = self.client.post(create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_schedule(self):
        create_url = reverse('create-tournament')
        random_str = str(get_random_string(length=32))
        data = {
            'name': random_str,
            'number_of_teams': 4
        }
        self.client.post(create_url, data, format='json')
        self.assertEqual(Schedule.objects.all().count(), 1)

    def test_save_score_real(self):
        create_url = reverse('create-tournament')
        random_str = str(get_random_string(length=32))
        data = {
            'name': random_str,
            'number_of_teams': 2
        }
        self.client.post(create_url, data, format='json')

        save_score_url = reverse('save-score')
        data = {
            "tournament_name": random_str,
            "first_team_name": "team1",
            "second_team_name": "team2",
            "score": "1:0",
        }
        response = self.client.post(save_score_url, data, format='json')
        self.assertEqual(response.data, "Saved")

    def test_save_score_unreal(self):
        create_url = reverse('create-tournament')
        random_str = str(get_random_string(length=32))
        data = {
            'name': random_str,
            'number_of_teams': 2
        }
        self.client.post(create_url, data, format='json')

        save_score_url = reverse('save-score')
        data = {
            "tournament_name": random_str,
            "first_team_name": "team1",
            "second_team_name": "team3",
            "score": "1:0",
        }
        response = self.client.post(save_score_url, data, format='json')
        self.assertEqual(response.data, "Not saved")

    def test_completed_matches_0(self):
        create_url = reverse('create-tournament')
        random_str = str(get_random_string(length=32))
        data = {
            'name': random_str,
            'number_of_teams': 2
        }
        self.client.post(create_url, data, format='json')

        get_tournament_url = reverse('get-tournament', kwargs={'tournament_name': random_str, 'show': 'completed'})
        response = self.client.get(get_tournament_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'schedule': [], 'results': [{'team1': {'wins': 0, 'draws': 0, 'defeats': 0}}, {'team2': {'wins': 0, 'draws': 0, 'defeats': 0}}]})

    def test_completed_matches_1(self):
        create_url = reverse('create-tournament')
        random_str = str(get_random_string(length=32))
        data = {
            'name': random_str,
            'number_of_teams': 2
        }
        self.client.post(create_url, data, format='json')

        save_score_url = reverse('save-score')
        data = {
            "tournament_name": random_str,
            "first_team_name": "team1",
            "second_team_name": "team2",
            "score": "1:0",
        }
        self.client.post(save_score_url, data, format='json')

        get_tournament_url = reverse('get-tournament', kwargs={'tournament_name': random_str, 'show': 'completed'})
        response = self.client.get(get_tournament_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'schedule': [{'round1': {'ended': True, 'team1 vs team2': '1:0'}}], 'results': [{'team1': {'wins': 1, 'draws': 0, 'defeats': 0}},
                                                                     {'team2': {'wins': 0, 'draws': 0, 'defeats': 1}}]})
