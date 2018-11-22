package it.devchallenge.tournament.service;

import it.devchallenge.tournament.mapper.TournamentMapper;
import it.devchallenge.tournament.model.match.MatchEntity;
import it.devchallenge.tournament.model.team.ParticipatingTeamEntity;
import it.devchallenge.tournament.model.tournament.CreateTournamentRequest;
import it.devchallenge.tournament.model.tournament.Tournament;
import it.devchallenge.tournament.model.tournament.TournamentEntity;
import it.devchallenge.tournament.repository.ParticipatingTeamRepository;
import it.devchallenge.tournament.repository.TournamentRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.isBlank;

@Slf4j
@Service
@AllArgsConstructor
public class TournamentCreationService {
    private static final String BYE_TEAM_NAME = "Bye";
    private static final String DEFAULT_NAME_PREFIX = "Tournament_";
    private static final int FIRST_ELEMENT_INDEX = 0;
    private static final int ROTATION_DISTANCE = 1;
    private static final String TEAM_NAME_PREFIX = "Team";
    private final TournamentRepository tournamentRepository;
    private final ParticipatingTeamRepository participatingTeamRepository;
    private final TournamentMapper tournamentMapper;

    public Tournament createTournament(CreateTournamentRequest request) {
        TournamentEntity tournament = tournamentRepository.save(new TournamentEntity());
        setTournamentName(tournament, request.getTournamentName());

        List<ParticipatingTeamEntity> teams = createAndShuffleTeams(request);
        List<MatchEntity> matches = createMatches(teams);
        tournament.setMatches(matches);
        TournamentEntity savedTournament = tournamentRepository.save(tournament);
        return tournamentMapper.map(savedTournament);
    }

    private List<MatchEntity> createMatches(List<ParticipatingTeamEntity> teams) {
        int numberOfTeams = teams.size();
        int firstCycleRounds = numberOfTeams - 1;
        int numberOfMatches = numberOfTeams * (numberOfTeams - 1);
        int matchesInRound = numberOfTeams / 2;
        List<MatchEntity> firstCycleMatches = new ArrayList<>(numberOfMatches / 2);

        for (int roundNum = 1; roundNum <= firstCycleRounds; roundNum++) {
            for (int matchIndex = 0; matchIndex < matchesInRound; matchIndex++) {
                int guestTeamIndex = matchIndex + matchesInRound;
                MatchEntity match = new MatchEntity(teams.get(matchIndex), teams.get(guestTeamIndex), roundNum);
                firstCycleMatches.add(match);
            }
            teams = rotateTeams(teams);
        }

        List<MatchEntity> allMatches = new ArrayList<>(numberOfMatches);
        allMatches.addAll(firstCycleMatches);
        allMatches.addAll(reverseMatches(firstCycleMatches, firstCycleRounds));

        return allMatches;
    }

    /**
     * Rotating all teams except first one.
     */
    private List<ParticipatingTeamEntity> rotateTeams(List<ParticipatingTeamEntity> teams) {
        List<ParticipatingTeamEntity> partForRotation = teams.subList(1, teams.size());
        List<ParticipatingTeamEntity> rotatedPart = new ArrayList<>(partForRotation);
        Collections.rotate(rotatedPart, ROTATION_DISTANCE);
        List<ParticipatingTeamEntity> rotatedList = new ArrayList<>();
        rotatedList.add(teams.get(FIRST_ELEMENT_INDEX));
        rotatedList.addAll(rotatedPart);
        return rotatedList;
    }

    private Collection<MatchEntity> reverseMatches(List<MatchEntity> firstCycleMatches, int firstCycleRounds) {
        return firstCycleMatches.stream()
                .map(originalMatch -> new MatchEntity(originalMatch.getGuestTeam(), originalMatch.getHomeTeam(),
                        originalMatch.getRoundNum() + firstCycleRounds))
                .collect(Collectors.toList());
    }

    private List<ParticipatingTeamEntity> createAndShuffleTeams(CreateTournamentRequest request) {
        List<ParticipatingTeamEntity> teams = IntStream.range(1, request.getTeamsCount() + 1)
                .mapToObj(teamNum -> TEAM_NAME_PREFIX + teamNum)
                .map(ParticipatingTeamEntity::new)
                .map(participatingTeamRepository::save)
                .collect(toList());
        if ((teams.size() % 2 == 1)) {
            addByeTeam(teams);
        }
        Collections.shuffle(teams);
        return teams;
    }

    private void addByeTeam(List<ParticipatingTeamEntity> teams) {
        ParticipatingTeamEntity byeTeam = participatingTeamRepository.save(new ParticipatingTeamEntity(BYE_TEAM_NAME));
        teams.add(byeTeam);
    }

    private void setTournamentName(TournamentEntity tournament, String tournamentName) {
        String name = isBlank(tournamentName) ? DEFAULT_NAME_PREFIX + tournament.getId() : tournamentName;
        tournament.setName(name);
    }
}
