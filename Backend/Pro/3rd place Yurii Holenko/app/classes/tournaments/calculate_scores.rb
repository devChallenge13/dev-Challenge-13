module Tournaments
  class CalculateScores
    attr_reader :tournament

    def initialize(tournament)
      @tournament = tournament
    end

    def perform
      table = @tournament.teams.map do |team|
        finished_games = Game.by_tournament(@tournament.id).by_team(team.id).finished
        games_win = find_win_count(finished_games, team)
        games_draw = find_draw_count(finished_games, team)
        { team_name: team.name,
          games_played: finished_games.count,
          game_win: games_win,
          games_draw: games_draw,
          games_losed: finished_games.count - (games_win + games_draw),
          scores: games_win * 3 + games_draw }
      end
      table.sort_by { |team| -team[:scores] }
    end

    private

    def find_win_count(games, team)
      home_wins_count =
        games.joins(:game_result).where(home_team_id: team.id)
             .where('game_results.home_team_goals > game_results.guest_team_goals').count
      guest_win_counts =
        games.joins(:game_result).where(guest_team_id: team.id)
             .where('game_results.home_team_goals < game_results.guest_team_goals').count
      home_wins_count + guest_win_counts
    end

    def find_draw_count(games, team)
      home_draws_count =
        games.joins(:game_result).where(home_team_id: team.id)
             .where('game_results.home_team_goals = game_results.guest_team_goals').count
      guest_draws_counts =
        games.joins(:game_result).where(guest_team_id: team.id)
             .where('game_results.home_team_goals = game_results.guest_team_goals').count
      home_draws_count + guest_draws_counts
    end
  end
end
