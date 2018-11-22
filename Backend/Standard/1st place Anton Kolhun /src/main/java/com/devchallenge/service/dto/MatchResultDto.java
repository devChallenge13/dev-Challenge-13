package com.devchallenge.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchResultDto {

    private String team;

    private String opponent;

    private String score;

    private Integer points;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MatchResultDto that = (MatchResultDto) o;
        return Objects.equals(team, that.team) &&
                Objects.equals(opponent, that.opponent) &&
                Objects.equals(score, that.score);
    }

    @Override
    public int hashCode() {
        return Objects.hash(team, opponent, score);
    }
}
