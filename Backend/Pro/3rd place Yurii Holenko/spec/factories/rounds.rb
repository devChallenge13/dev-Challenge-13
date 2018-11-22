FactoryBot.define do
  factory :round, class: Round do
    association :tournament, factory: :tournament
    sequential_number { 1 }
  end
end
