module Api
  module V1
    class RoundSerializer < ::BaseSerializer
      attributes :id, :sequential_number

      has_many :games, serializer: GameSerializer
    end
  end
end
