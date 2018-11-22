require 'rails_helper'

describe Api::V1::GameResultsController do
  let!(:default_game) { FactoryBot.create(:game) }
  let(:game_result_params) do
    { game_id: default_game.id, home_team_goals: 5, guest_team_goals: 2 }
  end

  describe 'POST#create' do
    it 'has to be success' do
      process :create,
              method: :post,
              format: :json,
              params: game_result_params
      expect_status('201')
      default_game.reload # reload game after update
      expect(default_game.finished).to be(true)
    end
  end
end
