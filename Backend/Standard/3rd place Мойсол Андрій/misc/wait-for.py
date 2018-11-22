import socket
import time
import os

port = int(os.environ.get('DB_PORT', 5432))

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
while True:
    try:
        s.connect((os.environ.get('POSTGRES_HOST'), port))
        s.close()
        break
    except socket.error:
        time.sleep(0.1)
