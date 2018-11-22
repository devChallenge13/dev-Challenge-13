FactoryBot.define do
  factory :game, class: Game do
    association :round, factory: :round

    after :build do |game|
      home_team = FactoryBot.create(:team, tournament: game.round.tournament)
      guest_team = FactoryBot.create(:team, tournament: game.round.tournament)
      game.home_team = home_team
      game.guest_team = guest_team
    end
  end
end
