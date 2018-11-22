package it.devchallenge.tournament.model.team;

import lombok.Value;

@Value
public class TeamResult {
    String teamName;
    long matchedPlayed;
    long wins;
    long draws;
    long losses;
    long points;
}
