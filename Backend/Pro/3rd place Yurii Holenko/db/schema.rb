# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_11_17_114004) do

  create_table "game_results", force: :cascade do |t|
    t.integer "game_id"
    t.integer "home_team_goals"
    t.integer "guest_team_goals"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_game_results_on_game_id"
  end

  create_table "games", force: :cascade do |t|
    t.integer "round_id"
    t.integer "home_team_id"
    t.integer "guest_team_id"
    t.boolean "finished", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["guest_team_id"], name: "index_games_on_guest_team_id"
    t.index ["home_team_id"], name: "index_games_on_home_team_id"
    t.index ["round_id"], name: "index_games_on_round_id"
  end

  create_table "rounds", force: :cascade do |t|
    t.integer "tournament_id"
    t.integer "sequential_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tournament_id"], name: "index_rounds_on_tournament_id"
  end

  create_table "teams", force: :cascade do |t|
    t.integer "tournament_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tournament_id"], name: "index_teams_on_tournament_id"
  end

  create_table "tournaments", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
