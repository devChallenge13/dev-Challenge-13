package it.devchallenge.tournament.model.team;

import lombok.Value;

@Value
public class TeamMatchResult {
    String teamName;
    TeamMatchResultType resultType;
}
