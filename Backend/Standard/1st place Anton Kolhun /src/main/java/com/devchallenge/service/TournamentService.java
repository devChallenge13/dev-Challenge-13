package com.devchallenge.service;

import com.devchallenge.controller.dto.TeamStatistic;
import com.devchallenge.dal.entity.MatchResultEntity;
import com.devchallenge.dal.entity.MatchScheduleEntity;
import com.devchallenge.dal.entity.TournamentEntity;
import com.devchallenge.dal.entity.enums.MatchLocation;
import com.devchallenge.dal.repository.TournamentRepository;
import com.devchallenge.service.dto.MatchResultDto;
import com.devchallenge.service.dto.MatchScheduleDto;
import com.devchallenge.service.dto.TournamentDto;
import com.devchallenge.service.helper.MatchScheduleGenerator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@Service
@AllArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;

    private final MatchScheduleGenerator scheduleService;


    public TournamentDto findTournament(String tournamentName) {
        TournamentEntity tournamentEntity = getTournamentEntity(tournamentName);
        return convertToDto(tournamentEntity);
    }

    @Transactional
    public TournamentDto createTournament(TournamentDto tournamentDto) {
        TournamentEntity tournamentEntity = convertToEntity(tournamentDto);
        List<String> teamNames = generateTeamNames(tournamentDto);
        List<MatchScheduleDto> matches = scheduleService.createSchedule(teamNames);
        List<MatchScheduleEntity> matchScheduleEntities = matches.stream()
                .map(matchScheduleDto -> {
                    MatchScheduleEntity matchScheduleEntity = new MatchScheduleEntity();
                    matchScheduleEntity.setTournament(tournamentEntity);
                    matchScheduleEntity.setTeam(matchScheduleDto.getTeam());
                    matchScheduleEntity.setOpponent(matchScheduleDto.getOpponent());
                    matchScheduleEntity.setRound(matchScheduleDto.getRound());
                    return matchScheduleEntity;
                })
                .collect(Collectors.toList());
        tournamentEntity.setSchedules(matchScheduleEntities);
        tournamentEntity.setTeamNumber(tournamentDto.getTeamNumber());
        TournamentEntity createdEntity = tournamentRepository.save(tournamentEntity);
        return convertToDto(createdEntity);
    }

    private TournamentEntity convertToEntity(TournamentDto tournamentDto) {
        TournamentEntity tournamentEntity = new TournamentEntity();
        tournamentEntity.setName(tournamentDto.getName());
        return tournamentEntity;
    }

    private List<String> generateTeamNames(TournamentDto tournamentDto) {
        List<String> teamNames = new ArrayList<>();
        for (int i = 0; i < tournamentDto.getTeamNumber(); i++) {
            teamNames.add("team" + (i + 1));
        }
        return teamNames;
    }

    private TournamentDto convertToDto(TournamentEntity tournamentEntity) {
        TournamentDto tournamentDto = new TournamentDto();
        tournamentDto.setName(tournamentEntity.getName());
        tournamentDto.setTeamNumber(tournamentEntity.getTeamNumber());
        List<MatchScheduleDto> matchScheduleDto = tournamentEntity.getSchedules().stream()
                .map(matchScheduleEntity ->
                        new MatchScheduleDto(
                                matchScheduleEntity.getTeam(),
                                matchScheduleEntity.getOpponent(),
                                matchScheduleEntity.getRound()
                        )
                )
                .collect(Collectors.toList());
        tournamentDto.setMatchScheduleDto(matchScheduleDto);
        List<MatchResultDto> matchResultDtos = extractMatchResultDtos(tournamentEntity);
        tournamentDto.setMatchResultDtos(matchResultDtos);
        return tournamentDto;
    }

    private List<MatchResultDto> extractMatchResultDtos(TournamentEntity tournamentEntity) {
        return tournamentEntity.getSchedules().stream()
                .flatMap(matchScheduleEntity -> matchScheduleEntity.getMatchResults().stream())
                .filter(matchResultEntity -> matchResultEntity.getLocation() == MatchLocation.HOME)
                .map(matchResultEntity -> new MatchResultDto(matchResultEntity.getMatchSchedule().getTeam(),
                        matchResultEntity.getMatchSchedule().getOpponent(),
                        matchResultEntity.getScore(),
                        matchResultEntity.getPoints()))
                .collect(Collectors.toList());
    }

    public List<TeamStatistic> getTournamentTable(String tournamentName) {
        TournamentEntity tournamentEntity = getTournamentEntity(tournamentName);
        Map<String, List<MatchResultEntity>> teamResults = tournamentEntity.getSchedules().stream()
                .flatMap(matchScheduleEntity -> matchScheduleEntity.getMatchResults().stream())
                .collect(groupingBy(
                        matchResultEntity -> matchResultEntity.getTeam()));

        List<TeamStatistic> statistics = teamResults.entrySet().stream()
                .map(entry -> convertToStatistic(entry)
                )
                .collect(Collectors.toList());
        return statistics;
    }

    private TeamStatistic convertToStatistic(Map.Entry<String, List<MatchResultEntity>> entry) {
        List<MatchResultEntity> matches = entry.getValue();
        int victories = 0;
        int draws = 0;
        int losses = 0;
        int totalPoints = 0;
        for (MatchResultEntity match : matches) {
            totalPoints += match.getPoints();
            if (match.getPoints() == 3) {
                victories++;
                continue;
            }
            if (match.getPoints() == 0) {
                losses++;
                continue;
            }
            draws++;
        }
        TeamStatistic teamStatistic = TeamStatistic.builder()
                .teamName(entry.getKey())
                .victories(victories)
                .losses(losses)
                .draws(draws)
                .points(totalPoints)
                .build();
        return teamStatistic;
    }

    private TournamentEntity getTournamentEntity(String tournamentName) {
        return tournamentRepository.findByName(tournamentName)
                .orElseThrow(() -> new RuntimeException("tournament not found " + tournamentName));
    }
}
