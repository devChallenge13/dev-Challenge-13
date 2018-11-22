package it.devchallenge.tournament.model.tournament;

import it.devchallenge.tournament.model.team.TeamResult;
import lombok.Value;

import java.util.List;

@Value
public class TournamentResults {
    List<Round> schedule;
    List<TeamResult> teamResults;
}
