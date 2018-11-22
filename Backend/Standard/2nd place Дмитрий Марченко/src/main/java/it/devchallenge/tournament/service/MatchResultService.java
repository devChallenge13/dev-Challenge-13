package it.devchallenge.tournament.service;

import it.devchallenge.tournament.mapper.MatchResultMapper;
import it.devchallenge.tournament.mapper.TournamentMapper;
import it.devchallenge.tournament.model.match.Match;
import it.devchallenge.tournament.model.match.MatchEntity;
import it.devchallenge.tournament.model.team.TeamMatchResult;
import it.devchallenge.tournament.model.team.TeamMatchResultType;
import it.devchallenge.tournament.model.team.TeamResult;
import it.devchallenge.tournament.model.tournament.Tournament;
import it.devchallenge.tournament.model.tournament.TournamentEntity;
import it.devchallenge.tournament.model.tournament.TournamentResults;
import it.devchallenge.tournament.repository.MatchRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.Validate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Stream;

import static java.util.stream.Collectors.counting;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;


@Service
@AllArgsConstructor
@Slf4j
public class MatchResultService {

    private static final String TEAM_NAME_PATTERN = "Team\\d+";
    private final TournamentService tournamentService;
    private final MatchRepository matchRepository;
    private final TournamentMapper tournamentMapper;
    private final MatchResultMapper matchResultMapper;

    public void updateMatchResult(String tournamentName, Match match) {
        TournamentEntity tournament = tournamentService.findTournamentByName(tournamentName);
        Validate.matchesPattern(match.getHomeTeam(), TEAM_NAME_PATTERN);
        Validate.matchesPattern(match.getGuestTeam(), TEAM_NAME_PATTERN);

        MatchEntity matchEntity = tournament.getMatches().stream()
                .filter(targetMatchPredicate(match))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Match " + match + " not found"));
        matchEntity.setMatchResult(match.getMatchResult());
        matchEntity.setHomeTeamGoals(match.getHomeTeamGoals());
        matchEntity.setGuestTeamGoals(match.getGuestTeamGoals());
        matchRepository.saveAndFlush(matchEntity);
    }

    public TournamentResults getTournamentResults(String tournamentName) {
        TournamentEntity tournamentEntity = tournamentService.findTournamentByName(tournamentName);
        Tournament tournament = tournamentMapper.map(tournamentEntity);
        Map<String, Map<TeamMatchResultType, Long>> rawTeamResults = tournament.getRounds().stream()
                .flatMap(round -> round.getMatches().stream())
                .flatMap(this::matchToTeamResults)
                .collect(groupingBy(TeamMatchResult::getTeamName,
                        groupingBy(TeamMatchResult::getResultType,
                                counting())));
        List<TeamResult> teamResults = matchResultMapper.map(rawTeamResults);
        return new TournamentResults(tournament.getRounds(), teamResults);
    }

    private Stream<TeamMatchResult> matchToTeamResults(Match match) {
        if (match.getMatchResult() == null) {
            return Stream.of();
        }
        TeamMatchResult homeTeamResult = new TeamMatchResult(match.getHomeTeam(),
                matchResultMapper.mapMatchResult(match.getMatchResult(), true));
        TeamMatchResult guestTeamResult = new TeamMatchResult(match.getHomeTeam(),
                matchResultMapper.mapMatchResult(match.getMatchResult(), true));
        return Stream.of(homeTeamResult, guestTeamResult);
    }

    private Predicate<MatchEntity> targetMatchPredicate(Match match) {
        return matchEntity -> matchEntity.getHomeTeam().getName().equals(match.getHomeTeam()) &&
                matchEntity.getGuestTeam().getName().equals(match.getGuestTeam());
    }

    public List<Match> getPlayedMatches(String tournamentName, boolean played) {
        return tournamentService.findTournamentByName(tournamentName)
                .getMatches().stream()
                .map(tournamentMapper::mapMatch)
                .filter(playedPredicate(played))
                .collect(toList());
    }

    private Predicate<Match> playedPredicate(boolean played) {
        return (Match match) -> played == (match.getMatchResult() != null);
    }
}
