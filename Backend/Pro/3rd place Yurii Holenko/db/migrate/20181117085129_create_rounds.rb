class CreateRounds < ActiveRecord::Migration[5.2]
  def change
    create_table :rounds do |t|
      t.references :tournament, index: true
      t.integer :sequential_number
      t.timestamps
    end
  end
end
