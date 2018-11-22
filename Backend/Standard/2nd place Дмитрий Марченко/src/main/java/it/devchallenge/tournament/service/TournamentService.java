package it.devchallenge.tournament.service;

import it.devchallenge.tournament.model.tournament.TournamentEntity;
import it.devchallenge.tournament.repository.TournamentRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class TournamentService {

    private final TournamentRepository tournamentRepository;

    public TournamentEntity findTournamentByName(String tournamentName) {
        return tournamentRepository.findByName(tournamentName)
                .orElseThrow(() -> new IllegalArgumentException("Tournament with name: " + tournamentName
                        + " not found"));
    }
}
