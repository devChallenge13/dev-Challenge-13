package com.devchallenge.controller;

import com.devchallenge.service.MatchService;
import com.devchallenge.service.dto.MatchResultDto;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/tournament/{tournamentName}/match")
@AllArgsConstructor
public class MatchController {

    private final MatchService teamService;


    @PostMapping
    public MatchResultDto createMatch(@PathVariable String tournamentName,
                            @RequestBody MatchResultDto matchResultDto) {
        return teamService.addMatchResult(tournamentName, matchResultDto);
    }
}
