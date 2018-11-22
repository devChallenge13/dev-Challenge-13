package it.devchallenge.tournament.model.tournament;

import lombok.Value;

import java.util.List;

@Value
public class Tournament {
    String tournamentName;
    List<Round> rounds;
}
