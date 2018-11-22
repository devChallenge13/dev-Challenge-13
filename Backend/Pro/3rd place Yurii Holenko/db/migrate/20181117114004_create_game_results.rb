class CreateGameResults < ActiveRecord::Migration[5.2]
  def change
    create_table :game_results do |t|
      t.references :game, index: true
      t.integer :home_team_goals
      t.integer :guest_team_goals
      t.timestamps
    end
  end
end
