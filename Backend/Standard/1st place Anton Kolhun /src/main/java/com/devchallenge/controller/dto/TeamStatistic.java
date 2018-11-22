package com.devchallenge.controller.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamStatistic {

    private String teamName;

    private int games;

    private int victories;

    private int losses;

    private int draws;

    private int points;

}
