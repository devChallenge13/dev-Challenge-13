class Round < ApplicationRecord
  default_scope { order(sequential_number: :asc) }
  belongs_to :tournament
  has_many :games
end
