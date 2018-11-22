package it.devchallenge.tournament.mapper;

import it.devchallenge.tournament.model.match.MatchResultType;
import it.devchallenge.tournament.model.team.TeamMatchResultType;
import it.devchallenge.tournament.model.team.TeamResult;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

@Component
public class MatchResultMapper {

    public TeamMatchResultType mapMatchResult(MatchResultType matchResultType, boolean isHomeTeam) {
        if (MatchResultType.DRAW == matchResultType) {
            return TeamMatchResultType.DRAW;
        } else if (isHomeTeam) {
            return MatchResultType.HOME_TEAM_WIN == matchResultType
                    ? TeamMatchResultType.WIN : TeamMatchResultType.LOSS;
        } else {
            return MatchResultType.GUEST_TEAM_WIN == matchResultType
                    ? TeamMatchResultType.WIN : TeamMatchResultType.LOSS;
        }
    }

    public List<TeamResult> map(Map<String, Map<TeamMatchResultType, Long>> teamResults) {
        return teamResults.entrySet()
                .stream()
                .map(entry -> mapTeamResult(entry.getKey(), entry.getValue()))
                .collect(toList());
    }

    private TeamResult mapTeamResult(String teamName, Map<TeamMatchResultType, Long> results) {
        long wins = results.getOrDefault(TeamMatchResultType.WIN, 0L) / 2;
        long draws = results.getOrDefault(TeamMatchResultType.DRAW, 0L) / 2;
        long losses = results.getOrDefault(TeamMatchResultType.LOSS, 0L) / 2;
        long played = wins + draws + losses;
        return new TeamResult(teamName, played, wins, draws, losses, countPoints(wins, draws));
    }

    private long countPoints(long wins, long draws) {
        return 3 * wins + draws;
    }
}
