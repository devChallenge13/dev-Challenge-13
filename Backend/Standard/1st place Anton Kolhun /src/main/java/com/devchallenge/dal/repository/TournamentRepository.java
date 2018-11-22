package com.devchallenge.dal.repository;

import com.devchallenge.dal.entity.TournamentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TournamentRepository extends JpaRepository<TournamentEntity, String> {

    Optional<TournamentEntity> findByName(String name);
}
