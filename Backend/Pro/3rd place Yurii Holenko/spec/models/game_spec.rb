require 'rails_helper'

RSpec.describe Game, type: :model do
  describe 'ActiveRecord associations' do
    it { is_expected.to belong_to(:round) }
    it { is_expected.to belong_to(:home_team).class_name('Team') }
    it { is_expected.to belong_to(:guest_team).class_name('Team') }
    it { is_expected.to have_one(:game_result) }
  end
end
