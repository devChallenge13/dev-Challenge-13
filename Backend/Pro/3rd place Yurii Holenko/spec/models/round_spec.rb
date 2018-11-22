require 'rails_helper'

RSpec.describe Round, type: :model do
  describe 'ActiveRecord associations' do
    it { is_expected.to have_many(:games) }
    it { is_expected.to belong_to(:tournament) }
  end
end
