require 'rails_helper'

RSpec.describe GameResult, type: :model do
  describe 'ActiveRecord associations' do
    it { is_expected.to belong_to(:game) }
  end
end
