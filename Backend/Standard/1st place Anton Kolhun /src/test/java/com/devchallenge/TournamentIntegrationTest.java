package com.devchallenge;

import com.devchallenge.config.TestDaoConfig;
import com.devchallenge.service.dto.MatchResultDto;
import com.devchallenge.service.dto.TournamentDto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {TournamentApplication.class, TestDaoConfig.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TournamentIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @LocalServerPort
    private int port;

    @Test
    public void shouldCreateTournament() {
        //setup
        String tournamentName = "test-tournament";
        Integer teamNumber = 3;
        TournamentDto tournamentDto = new TournamentDto();
        tournamentDto.setTeamNumber(teamNumber);
        tournamentDto.setName(tournamentName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TournamentDto> requestEntity = new HttpEntity<>(tournamentDto, headers);

        //execute
        ResponseEntity<TournamentDto> createTournament = restTemplate.exchange("http://localhost:"
                        + port + "api/tournament",
                HttpMethod.POST, requestEntity, TournamentDto.class);

        ResponseEntity<TournamentDto> readTournament = restTemplate.exchange("http://localhost:"
                + port + "api/tournament/" + tournamentName, HttpMethod.GET, null, TournamentDto.class);

        //verify
        assertEquals(HttpStatus.OK, createTournament.getStatusCode());
        assertEquals(HttpStatus.OK, readTournament.getStatusCode());
        assertEquals(tournamentName, readTournament.getBody().getName());
        assertEquals(teamNumber, readTournament.getBody().getTeamNumber());
    }

    @Test
    public void shouldCreateMatches() {
        //setup
        String tournamentName = "test-tournament";
        Integer teamNumber = 3;
        TournamentDto tournamentDto = new TournamentDto();
        tournamentDto.setTeamNumber(teamNumber);
        tournamentDto.setName(tournamentName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TournamentDto> requestEntity = new HttpEntity<>(tournamentDto, headers);

        //execute
        ResponseEntity<TournamentDto> createTournament = restTemplate.exchange("http://localhost:"
                        + port + "api/tournament",
                HttpMethod.POST, requestEntity, TournamentDto.class);

        MatchResultDto matchResultDto = new MatchResultDto();
        matchResultDto.setTeam("team1");
        matchResultDto.setOpponent("team2");
        matchResultDto.setScore("3-0");
        HttpEntity<MatchResultDto> matchRequestEntity = new HttpEntity<>(matchResultDto, headers);

        ResponseEntity<MatchResultDto> createMatch = restTemplate.exchange("http://localhost:"
                        + port + "api/tournament/" + tournamentName + "/match",
                HttpMethod.POST, matchRequestEntity, MatchResultDto.class);

        ResponseEntity<TournamentDto> readTournament = restTemplate.exchange("http://localhost:"
                + port + "api/tournament/" + tournamentName, HttpMethod.GET, null, TournamentDto.class);

        //verify
        assertEquals(HttpStatus.OK, createMatch.getStatusCode());
        assertEquals(1, readTournament.getBody().getMatchResultDtos().size());
        assertEquals(matchResultDto, readTournament.getBody().getMatchResultDtos().get(0));


    }

}
