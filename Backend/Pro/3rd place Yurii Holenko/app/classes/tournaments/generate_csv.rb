require 'csv'

module Tournaments
  class GenerateCSV
    attr_reader :data, :type
    def initialize(data, type)
      @data = data
      @type = type
    end

    def perform
      case type
      when :score_table then generate_score_table_data
      when :schedule then generate_schedule_data
      end
    end

    private

    def generate_score_table_data
      attributes = data.first.keys
      CSV.generate(headers: true) do |csv|
        csv << attributes
        data.each do |team_data|
          csv << attributes.map { |attr| team_data[attr] }
        end
      end
    end

    def generate_schedule_data
      # game_attributes = [:home_team, :guest_name, :score]
      rounds = data.rounds
      CSV.generate(headers: false) do |csv|
        rounds.each do |round|
          csv << ["Round #{round.sequential_number}"]
          round.games.each do |game|
            csv << [game.home_team.name, game.guest_team.name, game.score]
          end
        end
      end
    end
  end
end
