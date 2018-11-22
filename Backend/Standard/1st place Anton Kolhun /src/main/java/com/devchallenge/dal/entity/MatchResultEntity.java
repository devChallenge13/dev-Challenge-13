package com.devchallenge.dal.entity;

import com.devchallenge.dal.entity.enums.MatchLocation;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Table(name = "MATCH_RESULT")
@Entity
@Getter
@Setter
public class MatchResultEntity {

    @Id
    @Column(name = "MATCH_RESULT_ID")
    @GenericGenerator(name = "uuid-generator", strategy = "uuid2")
    @GeneratedValue(generator = "uuid-generator")
    private String id;

    @Column(name = "TEAM_NAME")
    private String team;

    @Column(name = "OPPONENT_NAME")
    private String opponent;

    @Column(name = "POINTS")
    private Integer points;

    @Column(name = "SCORE")
    private String score;

    @ManyToOne
    @JoinColumn(name = "MATCH_SCHEDULE_ID")
    private MatchScheduleEntity matchSchedule;

    @Enumerated(EnumType.STRING)
    @Column(name = "MATCH_LOCATION")
    private MatchLocation location;
}
