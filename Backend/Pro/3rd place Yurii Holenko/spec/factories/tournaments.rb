FactoryBot.define do
  factory :tournament do
    name { "#{FFaker::Name.html_safe_last_name}_Tournament_#{Time.now.to_i}" }
  end
end
