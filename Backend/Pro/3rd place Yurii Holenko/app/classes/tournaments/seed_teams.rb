module Tournaments
  class SeedTeams
    def initialize(teams)
      @rounds = {}
      @teams = teams
    end

    def perform
      seed_teams(@teams)
      @rounds
    end

    private

    def seed_teams(teams)
      teams.push(nil) if teams.size.odd?
      rounds = teams.size - 1
      matches_per_round = teams.size / 2
      rounds.times do |index|
        @rounds[index + 1] = []
        matches_per_round.times do |match_index|
          @rounds[index + 1] << [teams[match_index], teams.reverse[match_index]]
        end
        teams = [teams[0]] + teams[1..-1].rotate(-1)
      end
    end
  end
end
