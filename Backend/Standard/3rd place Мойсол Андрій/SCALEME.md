# Scalable approach
I have two containers in docker:
* web 
* db

# In-memory storage
All the data is stored in the database.

# Database options
The database is stored locally. It is .docker_data directory
in the root directory. Before setting up docker you can change
user, password and table name of the database. To do this
you should go to /misc/docker/postgres.env and change all the
data you need.