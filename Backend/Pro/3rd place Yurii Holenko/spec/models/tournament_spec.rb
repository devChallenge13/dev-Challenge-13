require 'rails_helper'

RSpec.describe Tournament, type: :model do
  describe 'ActiveRecord associations' do
    it { is_expected.to have_many(:rounds) }
    it { is_expected.to have_many(:teams) }
  end

  describe 'ActiveModel validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_uniqueness_of(:name).case_insensitive }
  end
end
