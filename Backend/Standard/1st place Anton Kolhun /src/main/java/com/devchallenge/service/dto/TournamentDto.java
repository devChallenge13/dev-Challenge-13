package com.devchallenge.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TournamentDto {

    private String name;

    private Integer teamNumber;

    @JsonProperty("schedule")
    private List<MatchScheduleDto> matchScheduleDto = new ArrayList<>();

    @JsonProperty("results")
    private List<MatchResultDto> matchResultDtos = new ArrayList<>();

}
