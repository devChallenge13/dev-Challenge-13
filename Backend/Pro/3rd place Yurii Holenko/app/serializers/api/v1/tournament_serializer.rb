module Api
  module V1
    class TournamentSerializer < ::BaseSerializer
      attributes :id, :name

      has_many :rounds, serializer: Api::V1::RoundSerializer
    end
  end
end
