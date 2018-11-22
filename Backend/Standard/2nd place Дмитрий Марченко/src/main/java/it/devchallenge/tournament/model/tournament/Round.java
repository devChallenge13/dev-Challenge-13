package it.devchallenge.tournament.model.tournament;

import it.devchallenge.tournament.model.match.Match;
import lombok.Value;

import java.util.List;

@Value
public class Round {
    int roundNum;
    List<Match> matches;
}
