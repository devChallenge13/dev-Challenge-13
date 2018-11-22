package com.devchallenge.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchScheduleDto {

    private String team;

    private String opponent;

    private Integer round;

}
