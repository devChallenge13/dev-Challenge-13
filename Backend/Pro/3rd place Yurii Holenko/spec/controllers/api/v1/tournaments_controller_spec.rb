require 'rails_helper'

describe Api::V1::TournamentsController do
  let(:tournament_params) do
    { tournament_name: 'football_it_league', team_names: %w[M.City M.United Arsenal Chelsea] }
  end

  describe 'POST#create' do
    it 'has to be success' do
      process :create,
              method: :post,
              format: :json,
              params: tournament_params
      expect_status('200')
    end
  end
end
