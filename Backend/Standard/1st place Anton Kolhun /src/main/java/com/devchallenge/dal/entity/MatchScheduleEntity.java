package com.devchallenge.dal.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Table(name = "MATCH_SCHEDULE")
@Entity
@Getter
@Setter
public class MatchScheduleEntity {

    @Id
    @Column(name = "MATCH_SCHEDULE_ID")
    @GenericGenerator(name = "uuid-generator", strategy = "uuid2")
    @GeneratedValue(generator = "uuid-generator")
    private String id;

    @ManyToOne
    @JoinColumn(name = "TOURNAMENT_ID")
    private TournamentEntity tournament;

    @Column(name = "TEAM_NAME")
    private String team;

    @Column(name = "OPPONENT_NAME")
    private String opponent;

    @Column(name = "ROUND")
    private Integer round;

    @OneToMany(mappedBy = "matchSchedule", cascade = CascadeType.ALL)
    private List<MatchResultEntity> matchResults = new ArrayList<>();

    public void setMatchResults(List<MatchResultEntity> matchResults) {
        this.matchResults.clear();
        this.matchResults.addAll(matchResults);
    }


}
