# README

# Requirements
Ruby version 2.5.1
Rails version 5.2.1


# How to run
1. gem install bundler --no-ri --no-rdoc
2. bundle install
3. rake assets:precompile (for swagger API documentation)
5. rails s

# Docker run
docker-compose up

# Testing
!! Swagger don't woth to work with array params, to create tournament plz use Postman or else

http://localhost:8080/api-docs use swagger to test functionality

# Rspec
sudo docker-compose run app rspec spec --format documentation

# Rubocop
sudo docker-compose run app rubocop

# Use
There currently one tournament in DB

http://localhost:8080/api/tournaments/league/schedule.csv - generate tournament schedule
http://localhost:8080/api/tournaments/league/scores.csv - generate score table
