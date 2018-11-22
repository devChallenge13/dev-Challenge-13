package com.devchallenge.controller;

import com.devchallenge.controller.dto.TeamStatistic;
import com.devchallenge.service.TournamentService;
import com.devchallenge.service.dto.TournamentDto;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/tournament")
@AllArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;

    @GetMapping("{tournamentName}")
    public TournamentDto getTournamentInfo(@PathVariable String tournamentName) {
        return tournamentService.findTournament(tournamentName);
    }

    @PostMapping
    public TournamentDto createTournament(@RequestBody TournamentDto tournamentDto) {
        return tournamentService.createTournament(tournamentDto);
    }

    @GetMapping("{tournamentName}/table")
    public List<TeamStatistic> getTournamentTable(@PathVariable String tournamentName) {
        return  tournamentService.getTournamentTable(tournamentName);
    }
}
