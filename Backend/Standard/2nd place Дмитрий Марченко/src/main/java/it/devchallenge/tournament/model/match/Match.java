package it.devchallenge.tournament.model.match;

import lombok.Value;

@Value
public class Match {
    String homeTeam;
    String guestTeam;
    Integer homeTeamGoals;
    Integer guestTeamGoals;
    MatchResultType matchResult;
}
