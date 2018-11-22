package it.devchallenge.tournament.mapper;

import it.devchallenge.tournament.model.match.Match;
import it.devchallenge.tournament.model.match.MatchEntity;
import it.devchallenge.tournament.model.tournament.Round;
import it.devchallenge.tournament.model.tournament.Tournament;
import it.devchallenge.tournament.model.tournament.TournamentEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

@Component
@AllArgsConstructor
public class TournamentMapper {

    public Tournament map(TournamentEntity tournamentEntity) {
        Map<Integer, List<MatchEntity>> matchesByRound = tournamentEntity.getMatches().stream()
                .collect(groupingBy(MatchEntity::getRoundNum));
        List<Round> rounds = matchesByRound.entrySet().stream()
                .map(entry -> mapRound(entry.getKey(), entry.getValue()))
                .collect(toList());
        return new Tournament(tournamentEntity.getName(), rounds);
    }

    public Match mapMatch(MatchEntity matchEntity) {
        return new Match(matchEntity.getHomeTeam().getName(),
                matchEntity.getGuestTeam().getName(),
                matchEntity.getHomeTeamGoals(), matchEntity.getHomeTeamGoals(),
                matchEntity.getMatchResult());
    }

    private Round mapRound(Integer roundNum, List<MatchEntity> matchEntities) {
        List<Match> matches = matchEntities.stream()
                .map(this::mapMatch)
                .collect(toList());
        return new Round(roundNum, matches);
    }
}
