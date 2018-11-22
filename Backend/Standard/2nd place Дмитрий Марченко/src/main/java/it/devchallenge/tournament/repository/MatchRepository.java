package it.devchallenge.tournament.repository;

import it.devchallenge.tournament.model.match.MatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<MatchEntity, Long> {
}
