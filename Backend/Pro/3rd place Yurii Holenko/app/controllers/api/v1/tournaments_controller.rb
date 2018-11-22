module Api
  module V1
    class TournamentsController < BaseController
      before_action :find_tournament, only: %w[show score_table]

      def create
        Tournaments::CreateTournament.new(tournament_params, self).perform
      end

      def on_create_success(tournament)
        render json: tournament
      end

      def on_create_error(error_message)
        render_error(error_message)
      end

      def show
        respond_to do |format|
          format.json { render json: @tournament }
          format.csv do
            send_data Tournaments::GenerateCSV.new(@tournament, :schedule).perform,
                      filename: "tournament-#{@tournament.name}-schedule.csv"
          end
        end
      end

      def score_table
        sorted_table = Tournaments::CalculateScores.new(@tournament).perform
        respond_to do |format|
          format.json { render json: sorted_table.to_json }
          format.csv do
            send_data Tournaments::GenerateCSV.new(sorted_table, :score_table).perform,
                      filename: "tournament-#{@tournament.name}-score_table.csv"
          end
        end
      end

      private

      def tournament_params
        params.permit(:tournament_name, team_names: [])
      end

      def find_tournament
        @tournament ||=
          Tournament.preload(rounds: [games: [:game_result, :home_team, :guest_team]])
                    .find_by_name(params[:tournament_name])
      end
    end
  end
end
