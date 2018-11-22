package com.devchallenge.dal.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Table(name = "TOURNAMENT")
@Entity
@Getter
@Setter
public class TournamentEntity {

    @Id
    @Column(name = "TOURNAMENT_ID")
    @GenericGenerator(name = "uuid-generator", strategy = "uuid2")
    @GeneratedValue(generator = "uuid-generator")
    private String id;

    @Column(name = "TOURNAMENT_NAME")
    private String name;

    @Column(name = "TEAM_NUMBER")
    private Integer teamNumber;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL)
    private List<MatchScheduleEntity> schedules = new ArrayList<>();


    public void setSchedules(List<MatchScheduleEntity> matchScheduleEntities) {
        this.schedules.clear();
        this.schedules.addAll(matchScheduleEntities);
    }
}
