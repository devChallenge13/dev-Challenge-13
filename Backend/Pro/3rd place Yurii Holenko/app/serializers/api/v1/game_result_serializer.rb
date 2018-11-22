module Api
  module V1
    class GameResultSerializer < ::BaseSerializer
      attributes :home_team_goals, :guest_team_goals
    end
  end
end
