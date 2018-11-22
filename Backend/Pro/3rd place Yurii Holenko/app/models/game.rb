class Game < ApplicationRecord
  belongs_to :round
  belongs_to :home_team, class_name: 'Team'
  belongs_to :guest_team, class_name: 'Team'
  has_one :game_result

  scope :finished, -> { where(finished: true) }
  scope :by_tournament, lambda { |tournament_id|
    joins(:round).where(rounds: { tournament_id: tournament_id })
  }

  scope :by_team, lambda { |team_id|
    where('guest_team_id = ? OR home_team_id = ?', team_id, team_id)
  }

  def score
    game_result ? "#{game_result.home_team_goals}-#{game_result.guest_team_goals}" : "-"
  end
end
