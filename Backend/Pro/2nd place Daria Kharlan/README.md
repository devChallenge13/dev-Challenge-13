## How to launch

Execute `docker compose up -d` and that's all, after that service can be accessed on http://localhost:8080


## API 

### Endpoints
1. GET /create - create tournament table
    - teams_amount (int) - mandatory
    - name (string) - optional, tournament name
2. GET /tournament/<tournament_name> - get schedule
    - tournament_name (string)
    - played (int) - optional, 1 - display played games, 0 - display not played games, None - display all
    - format (string) - optional, possible values: json, csv, pdf; default is json
3. GET /result - update result
    - name (string) - mandatory, tournament name
    - home_team (string) - mandatory, home team name
    - guest_team (string) - mandatory, guest team name
    - home_team_result (string) - mandatory, possible values: win, loose, draw
4. POST /<tournament_name>/update - update results from csv file (format must be like if you downloaded it from get 
        schedule action)
    ```
    curl -X POST -F 'file=path_to_csv_file' http://localhost:8080/<tournament_name>/update
    ```
    
### Error codes

- 400 - Bad request (mandatory parameter missing or data format is wrong)
    
  response: `{"error": "Bad request"}`
- 404 - Not found (url or parameters are wrong)

  response: `{"error": "Not found"}`
  
## Database
Database schema listed in migrations, see alembic/versions
