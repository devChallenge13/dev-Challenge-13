package com.devchallenge.service;

import com.devchallenge.dal.entity.MatchResultEntity;
import com.devchallenge.dal.entity.MatchScheduleEntity;
import com.devchallenge.dal.entity.TournamentEntity;
import com.devchallenge.dal.entity.enums.MatchLocation;
import com.devchallenge.dal.repository.MatchScheduleRepository;
import com.devchallenge.dal.repository.TournamentRepository;
import com.devchallenge.service.dto.MatchResultDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MatchService {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private MatchScheduleRepository matchScheduleRepository;

    @Value("${score.delimiter}")
    private String scoreDelimiter;

    @Transactional
    public MatchResultDto addMatchResult(String tournamentName, MatchResultDto matchResultDto) {
        validate(matchResultDto);
        TournamentEntity tournamentEntity = tournamentRepository.findByName(tournamentName)
                .orElseThrow(() -> new RuntimeException("could not find tournament with name = " + tournamentName));

        MatchScheduleEntity matchScheduleEntity = matchScheduleRepository.findByTournamentAndTeamAndOpponent(tournamentEntity,
                matchResultDto.getTeam(), matchResultDto.getOpponent())
                .orElseThrow(() -> new RuntimeException("the game is not scheduled: " + matchResultDto.getTeam()
                        + " versus " + matchResultDto.getOpponent()));

        addMatchResult(matchScheduleEntity, matchResultDto.getScore(), MatchLocation.HOME,
                matchScheduleEntity.getTeam(), matchScheduleEntity.getOpponent());
        String invertedScore = invertScore(matchResultDto.getScore());
        addMatchResult(matchScheduleEntity, invertedScore, MatchLocation.AWAY,
                matchResultDto.getOpponent(), matchResultDto.getTeam());
        MatchScheduleEntity updatedEntity = matchScheduleRepository.save(matchScheduleEntity);
        MatchResultEntity matchResultEntity = updatedEntity.getMatchResults().stream()
                .filter(entity -> entity.getLocation() == MatchLocation.HOME)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("match result has not been saved: " + matchResultDto));
        return toDto(matchResultEntity);
    }

    private MatchResultDto toDto(MatchResultEntity matchResultEntity) {
        return new MatchResultDto(matchResultEntity.getMatchSchedule().getTeam(), matchResultEntity.getMatchSchedule().getOpponent(),
                matchResultEntity.getScore(), matchResultEntity.getPoints());
    }

    private String invertScore(String score) {
        String[] scorePair = score.split(scoreDelimiter);
        return scorePair[1] + scoreDelimiter + scorePair[0];
    }

    private void validate(MatchResultDto matchResultDto) {
        //TODO
    }


    private void addMatchResult(MatchScheduleEntity matchScheduleEntity, String score, MatchLocation matchLocation,
                                String teamName, String opponentName) {
        MatchResultEntity matchResult = new MatchResultEntity();
        matchResult.setMatchSchedule(matchScheduleEntity);
        matchResult.setScore(score);
        matchResult.setPoints(calculatePoints(score));
        matchResult.setLocation(matchLocation);
        matchResult.setTeam(teamName);
        matchResult.setOpponent(opponentName);
        matchScheduleEntity.getMatchResults().add(matchResult);
    }


    private int calculatePoints(String score) {
        String[] scorePair = score.split(scoreDelimiter);
        if (Integer.parseInt(scorePair[0]) > Integer.parseInt(scorePair[1])) {
            return 3;
        } else if (Integer.parseInt(scorePair[0]) < Integer.parseInt(scorePair[1])) {
            return 0;
        }
        return 1;
    }

}
