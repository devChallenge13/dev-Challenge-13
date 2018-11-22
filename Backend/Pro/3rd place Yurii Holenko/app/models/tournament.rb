class Tournament < ApplicationRecord
  has_many :rounds
  has_many :teams
  validates :name, presence: true,
                   uniqueness: { case_sensitive: false },
                   allow_blank: false
end
