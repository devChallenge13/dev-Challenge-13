package it.devchallenge.tournament.service;

import com.itextpdf.text.Document;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import it.devchallenge.tournament.model.match.Match;
import it.devchallenge.tournament.model.team.TeamResult;
import it.devchallenge.tournament.model.tournament.Round;
import it.devchallenge.tournament.model.tournament.TournamentResults;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import static java.util.stream.Collectors.joining;

@Service
@AllArgsConstructor
public class PdfGenerationService {

    @SneakyThrows
    public ResponseEntity<Resource> pdfReport(TournamentResults tournamentResults, String tournamentName) {
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, outputStream);

        document.open();
        addResultsTable(tournamentResults.getTeamResults(), document);
        addScheduleTable(tournamentResults.getSchedule(), document);
        document.close();

        final byte[] bytes = outputStream.toByteArray();
        ByteArrayInputStream inputStream = new ByteArrayInputStream(bytes);
        InputStreamResource resource = new InputStreamResource(inputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName(tournamentName))
                .body(resource);
    }

    @SneakyThrows
    private void addScheduleTable(List<Round> schedule, Document document) {
        PdfPTable table = new PdfPTable(3);
        schedule.forEach(round -> {
            addRow(table, Stream.of("Round" + round.getRoundNum(), "", ""));
            round.getMatches().forEach(match -> addRow(table,
                    Stream.of(match.getHomeTeam(), match.getGuestTeam(), formatScore(match))));
        });
        document.add(table);
    }

    private String formatScore(Match match) {
        return Stream.of(match.getHomeTeamGoals(), match.getGuestTeamGoals())
                .filter(Objects::nonNull)
                .map(i -> Integer.toString(i))
                .collect(joining(":"));
    }

    @SneakyThrows
    private void addResultsTable(List<TeamResult> teamResults, Document document) {
        PdfPTable table = new PdfPTable(6);
        addRow(table, Stream.of("", "played matches", "wins", "draws", "losses", "points"));
        teamResults.forEach(teamResult -> addRow(table, Stream.of(teamResult.getTeamName(), teamResult.getMatchedPlayed(), teamResult.getWins(),
                teamResult.getDraws(), teamResult.getLosses(), teamResult.getPoints())));
        document.add(table);
    }

    private void addRow(PdfPTable table, Stream<Object> values) {
        values
                .map(Objects::toString)
                .forEach(value -> {
                    PdfPCell cell = new PdfPCell(new Phrase(value));
                    table.addCell(cell);
                });
    }

    private String fileName(String tournamentName) {
        return tournamentName + "_results.pdf";
    }
}
