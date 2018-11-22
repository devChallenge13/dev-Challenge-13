class Team < ApplicationRecord
  belongs_to :tournament

  validates :name, presence: true, uniqueness: { scope: :tournament_id }
end
