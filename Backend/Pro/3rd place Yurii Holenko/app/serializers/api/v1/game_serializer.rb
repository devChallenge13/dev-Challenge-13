module Api
  module V1
    class GameSerializer < ::BaseSerializer
      attributes :id, :finished

      belongs_to :home_team, serializer: TeamSerializer
      belongs_to :guest_team, serializer: TeamSerializer
      has_one :game_result, serializer: GameResultSerializer
    end
  end
end
