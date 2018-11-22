module Tournaments
  class CreateTournament
    attr_reader :params, :listener

    def initialize(params, listener)
      @params = params
      @listener = listener
    end

    def perform
      tournament = create_tournament
      create_teams(tournament)
      seed_table = Tournaments::SeedTeams.new(params[:team_names]).perform
      create_schedule(tournament, seed_table)
      listener.on_create_success(tournament)
    rescue StandardError => error
      listener.on_create_error(error.message)
    end

    private

    def create_schedule(tournament, seed_table)
      rounds = seed_table.size
      seed_table.each do |index, schedule|
        home_round = tournament.rounds.create!(sequential_number: index)
        away_round = tournament.rounds.create!(sequential_number: index + rounds)
        schedule.each do |pair|
          next if pair.include?(nil)

          first_team = tournament.teams.find_by(name: pair.first)
          second_team = tournament.teams.find_by(name: pair.last)
          home_round.games.create!(home_team: first_team, guest_team: second_team)
          away_round.games.create!(guest_team: first_team, home_team: second_team)
        end
      end
    end

    def create_tournament
      tournament_name = params.dig(:tournament_name).blank? ? create_name : params[:tournament_name]
      Tournament.create!(name: tournament_name)
    end

    def create_name
      "#{FFaker::Name.html_safe_last_name}_Tournament_#{Time.now.to_i}"
    end

    def create_teams(tournament)
      params[:team_names].each do |team_name|
        tournament.teams.create!(name: team_name)
      end
    end
  end
end
