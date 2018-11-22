from django.db import models
from django.contrib.postgres.fields import JSONField


class Tournament(models.Model):
    name = models.CharField(max_length=150, unique=True)
    number_of_teams = models.IntegerField()

    def __str__(self):
        return self.name


class Schedule(models.Model):
    tournament = models.OneToOneField(Tournament, on_delete=models.CASCADE, primary_key=True)
    data = JSONField()
