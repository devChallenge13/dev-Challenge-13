class CreateGames < ActiveRecord::Migration[5.2]
  def change
    create_table :games do |t|
      t.references :round, index: true
      t.references :home_team, class: 'Team'
      t.references :guest_team, class: 'Team'
      t.boolean :finished, default: false
      t.timestamps
    end
  end
end
