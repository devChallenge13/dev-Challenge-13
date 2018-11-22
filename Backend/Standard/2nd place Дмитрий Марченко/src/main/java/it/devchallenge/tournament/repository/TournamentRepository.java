package it.devchallenge.tournament.repository;

import it.devchallenge.tournament.model.tournament.TournamentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TournamentRepository extends JpaRepository<TournamentEntity, Long> {
    Optional<TournamentEntity> findByName(String name);
}
