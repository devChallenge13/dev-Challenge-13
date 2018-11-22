module Api
  module V1
    class GameResultsController < BaseController
      before_action :find_game, only: :create

      def create
        GameResult.find_or_initialize_by(game: @game).update!(game_result_params)
        @game.update!(finished: true)
        head :created
      end

      private

      def find_game
        @game ||= Game.find(params[:game_id])
      end

      def game_result_params
        params.permit(:home_team_goals, :guest_team_goals)
      end
    end
  end
end
