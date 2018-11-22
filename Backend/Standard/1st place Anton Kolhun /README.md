# Tournament application

## Required Prerequisites

* JDK 8
* docker/docker-compose

## Building 
```
./mvnw package -DskipTests
```
Once project is built  ./docker/tournament/tournament-1.0.jar should get added

## Running tests
```
./mvnw test
```
## Running application
docker should be started from ./docker folder.
`docker/tournament/start.sh` and `docker/tournament/wait-for-it.sh`
should have executable rights.

```
cd docker
docker-compose up -d
```

## Api documentation
```
http://localhost:8080/swagger-ui.html
```
### Creating tournament
```
curl -v -H "Content-Type: application/json" -d "{\"name\": \"tournament\", \"teamNumber\": \"5"\}" localhost:8080/api/tournament
```

### Add match result
```
curl -v -H "Content-Type: application/json" -d "{\"team\": \"team1\", \"opponent\": \"team2"\, \"score\": \"3-0\" }" localhost:8080/api/tournament/{name}/match
```
where `<generated_token>` is taken from creating-token response


