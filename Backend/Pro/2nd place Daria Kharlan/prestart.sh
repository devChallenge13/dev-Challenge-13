#!/bin/sh

# wait for db to start
sleep 10;
alembic upgrade head
flask run --host=0.0.0.0 --port=80