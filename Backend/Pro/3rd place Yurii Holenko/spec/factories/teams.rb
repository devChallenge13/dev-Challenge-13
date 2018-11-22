FactoryBot.define do
  factory :team do
    association :tournament, factory: :tournament
    name { FFaker::Name.html_safe_name }
  end
end
