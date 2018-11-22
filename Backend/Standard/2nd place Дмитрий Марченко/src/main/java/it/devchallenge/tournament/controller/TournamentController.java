package it.devchallenge.tournament.controller;

import it.devchallenge.tournament.model.match.Match;
import it.devchallenge.tournament.model.tournament.CreateTournamentRequest;
import it.devchallenge.tournament.model.tournament.Tournament;
import it.devchallenge.tournament.model.tournament.TournamentResults;
import it.devchallenge.tournament.service.MatchResultService;
import it.devchallenge.tournament.service.PdfGenerationService;
import it.devchallenge.tournament.service.TournamentCreationService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping(path = "/tournament")
public class TournamentController {

    private final TournamentCreationService tournamentCreationService;
    private final MatchResultService matchResultService;
    private final PdfGenerationService pdfGenerationService;

    @PostMapping
    public Tournament createTournament(@RequestBody CreateTournamentRequest createRequest) {
        log.info("Creating tournament {}", createRequest);
        return tournamentCreationService.createTournament(createRequest);
    }

    @PutMapping("/result/{tournamentName}")
    public void updateMatchResult(@PathVariable("tournamentName") String tournamentName, @RequestBody Match matchResult) {
        log.info("Updating for tournament {}, match result {}", tournamentName, matchResult);
        matchResultService.updateMatchResult(tournamentName, matchResult);
        log.info("Match result updated");
    }

    @GetMapping("/result/{tournamentName}")
    public TournamentResults getTournamentResults(@PathVariable("tournamentName") String tournamentName) {
        log.info("Getting results for tournament {}", tournamentName);
        return matchResultService.getTournamentResults(tournamentName);
    }

    @GetMapping("/result/{tournamentName}/matches")
    public List<Match> getPlayedMatches(@PathVariable("tournamentName") String tournamentName,
                                        @RequestParam("played") boolean played) {
        log.info("Getting {} matches for tournament {}", played ? "played" : "not played",
                tournamentName);
        return matchResultService.getPlayedMatches(tournamentName, played);
    }

    @GetMapping("/result/pdf/{tournamentName}")
    public ResponseEntity<Resource> getResultsAdPdf(@PathVariable("tournamentName") String tournamentName) {
        log.info("Getting results for tournament {}", tournamentName);
        TournamentResults tournamentResults = matchResultService.getTournamentResults(tournamentName);
        return pdfGenerationService.pdfReport(tournamentResults, tournamentName);
    }
}
