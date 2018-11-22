require 'rails_helper'

RSpec.describe Team, type: :model do
  describe 'ActiveRecord associations' do
    it { is_expected.to belong_to(:tournament) }
  end

  describe 'ActiveModel validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_uniqueness_of(:name).scoped_to(:tournament_id) }
  end
end
