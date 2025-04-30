# Princeps - Memory Game

The Princeps project is an online Web Memory Game to be played up to 4 players.

The game client and server are written using `Typescript` language, `Phaser` for game engine and `Rozsa MOGS` (a
multiplayer lib over Socket.io) for Websocket communication.

# Game screenshots

![loby](docs/loby.png "Lobby")

![gameplay](docs/gameplay.png "Gameplay")


## Features

- Multiplayer Online Game
- Websocket network communication with authoritative server
- Lobby and Matchmaking support
  - *Matchmaking mode needs to be reactivated in the code and needs an extra service to create the matches
- Allows players to reconnect to the match

## TODO

NEXT:
- Bring the solution up in AWS
- NEXT: update rozsa mogs to allow HTTPs
- update player-holder to not use filter.

- Add labels to the cards.
- Add a message-log (or a chat) to improve the notifications experience
- As now rozsa-mogs supports sharing client info while connecting, move 'nickname' setting to connection
- Add timeout so game-server can shutdown automatically if the match is not started or it is abandoned
- Update doc images


## EC2 Setup

### Server Backend
```shell
sudo yum update -y

sudo yum install -y nodejs

node server-backend.js &
```

### Nginx
```shell
# Configure Access
sudo apt install nginx -y

sudo mkdir /etc/nginx/sites-available
sudo mkdir /etc/nginx/sites-enabled

sudo vi /etc/nginx/sites-enabled/princeps-express # add server config (cfg bellow)
sudo ln sites-avaiable/princeps-express sites-enabled/ 
sudo vi /etc/nginx/nginx.conf # make nginx aware of the config (cfg bellow)

sudo nginx -t # check the config
sudo systemctl reload nginx # reload the service

# Enable HTTPS

sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d princeps.vrozsa.com
```

### `princeps-express` config at Nginx
```
server {
listen 80;
server_name princeps.vrozsa.com;

    location /lobby {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Also add `include /etc/nginx/sites-enabled/*;` to `/etc/nginx/nginx.conf`.

### Set the frontend and backend as services to auto-restart

`/etc/systemd/system/princeps-backend.service`
```
[Unit]
Description=Princeps Backend
After=network.target

[Service]
ExecStart=/usr/bin/node /home/ec2-user/princeps/server-backend.js
WorkingDirectory=/home/ec2-user/princeps
Restart=always
User=root

Environment=PRINCEPS_SSL_KEY=
Environment=PRINCEPS_SSL_CERT=

StandardOutput=append:/home/ec2-user/backend.log
StandardError=append:/home/ec2-user/backend.log

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/princeps-frontend.service`
```
[Unit]
Description=Princeps Frontend
After=network.target

[Service]
ExecStart=/usr/bin/node /home/ec2-user/princeps/client.js
WorkingDirectory=/home/ec2-user/princeps
Restart=always
User=root

StandardOutput=append:/home/ec2-user/frontend.log
StandardError=append:/home/ec2-user/frontend.log

[Install]
WantedBy=multi-user.target
```