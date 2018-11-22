package it.devchallenge.tournament.model.match;

import it.devchallenge.tournament.model.team.ParticipatingTeamEntity;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import static javax.persistence.EnumType.STRING;

@Data
@Entity
@Table(name = "match")
@NoArgsConstructor
public class MatchEntity {
    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    @JoinColumn(name = "home_team_id")
    private ParticipatingTeamEntity homeTeam;
    @ManyToOne
    @JoinColumn(name = "guest_team_id")
    private ParticipatingTeamEntity guestTeam;
    @Column
    private Integer roundNum;
    @Column
    private Integer homeTeamGoals;
    @Column
    private Integer guestTeamGoals;
    @Enumerated(STRING)
    private MatchResultType matchResult;

    public MatchEntity(ParticipatingTeamEntity homeTeam, ParticipatingTeamEntity guestTeam, Integer roundNum) {
        this.homeTeam = homeTeam;
        this.guestTeam = guestTeam;
        this.roundNum = roundNum;
    }
}
