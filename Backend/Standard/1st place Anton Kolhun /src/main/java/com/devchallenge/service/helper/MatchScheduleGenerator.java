package com.devchallenge.service.helper;

import com.devchallenge.service.dto.MatchScheduleDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

@Component
@AllArgsConstructor
public class MatchScheduleGenerator {

    public List<MatchScheduleDto> createSchedule(List<String> teamNames) {
        List<List<String>> pairs = new ArrayList<>();
        for (int i = 0; i < teamNames.size() - 1; i++) {
            String teamName = teamNames.get(i);
            for (int j = i + 1; j < teamNames.size(); j++) {
                String opponentName = teamNames.get(j);
                List<String> match1 = Arrays.asList(teamName, opponentName);
                pairs.add(match1);
                List<String> match2 = Arrays.asList(opponentName, teamName);
                pairs.add(match2);
            }
        }
        Collections.shuffle(pairs);
        List<MatchScheduleDto> matches = calculateRounds(pairs);
        return matches;

    }

    private List<MatchScheduleDto> calculateRounds(List<List<String>> pairs) {
        int round = 0;
        List<MatchScheduleDto> matchScheduleDtos = new ArrayList<>();
        while (!pairs.isEmpty()) {
            round++;
            Set<String> teamHaveMatches = new HashSet<>();
            for (Iterator<List<String>> iterator = pairs.iterator(); iterator.hasNext(); ) {
                List<String> pair = iterator.next();
                if (!teamHaveMatches.contains(pair.get(0)) && !teamHaveMatches.contains(pair.get(1))) {
                    matchScheduleDtos.add(new MatchScheduleDto(pair.get(0), pair.get(1), round));
                    teamHaveMatches.add(pair.get(0));
                    teamHaveMatches.add(pair.get(1));
                    iterator.remove();
                }
            }
        }
        return matchScheduleDtos;

    }

}
