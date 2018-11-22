Rails.application.routes.draw do
  mount SwaggerEngine::Engine, at: '/api-docs'

  namespace :api do
    api_version(
      header: { name: 'Accept', value: 'application/vnd.team_schedule_api.v1+json' },
      module: 'V1',
      default: true,
      defaults: { format: :json }
    ) do
      resources :tournaments, only: :create
      get 'tournaments/:tournament_name/schedule' => 'tournaments#show'
      get 'tournaments/:tournament_name/scores' => 'tournaments#score_table'
      post 'games/:game_id/game_results' => 'game_results#create'
    end
  end
end
