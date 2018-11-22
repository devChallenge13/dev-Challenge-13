package it.devchallenge.tournament.model.tournament;

import lombok.Value;

@Value
public class CreateTournamentRequest {
    String tournamentName;
    int teamsCount;
}
