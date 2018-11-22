# Launch
Application should start using one single command:
`docker-compose up`

Now the project can be reached on:
`http://0.0.0.0:8080/`

The admin page can be reached on:
`http://0.0.0.0:8080/admin`
The credentials:
* Username: admin
* Password: adminadmin

To run unit and integration tests you should run this command: `docker-compose exec web python3 project/manage.py test project/`

You can access API Docs on:
`http://0.0.0.0:8080/tournament/docs/`

# API Description
This API allows users to create schedules for tournaments.
Every user can create a tournament passing optional name(creates random name)
and number of teams in the tournament. When the tournament is created, user gets
a schedule of all plays. The schedule is divided on rounds and matches. Each team
will play with each other two times(home and away). The teams have such names:
team1, team2, team3, ..., teamN, N can be any number not less than 2. Also, each match has its status, eg. ended and not ended. This can help understand the situation. There is a default score (0:0), as well. Besides, the user can change a score of each match. The score should have such format "1:0" or "5:2". Futhermore, the user can get the list of all matches(completed, continuing or all) and statistics of each team (wins, draws, defeats).

# Architecture
In this project there are 2 models:
* Tournament Model:
    * used to represent tournament
    * contains related schedule instance and a name
* Schedule Model:
    * used to represent token
    * contains related tournament instance and json object to represent data

# Methodology
1. Firstly, for the API, I am using Postgres Database. I think it is the
best idea, because in Django, it is not allowed to make an json
field, but with Postgres Django provides tools that help you
to implement this. And, of course, this database is simple to
use with Django. 
2. The main thing is the algorithm I've used to generate a schedule. Its asymptotic (a.k.a max number of operations need for the algorithm) is N^2, where N is number of teams. So it is very fast (but not enough :D). The algorithm is placed in utilities.py file and can be reused for another projects


# Addition
I think that the speed of the algorithm is not enough for big purposes. I believe it could be upgraded to have the asymptotic of N*logN.
