package it.devchallenge.tournament.repository;

import it.devchallenge.tournament.model.team.ParticipatingTeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipatingTeamRepository extends JpaRepository<ParticipatingTeamEntity, Long> {
}
