# Princeps - Memory Game

The Princeps project is an online Web Memory Game to be played up to 4 players.

The game client and server are written using `Typescript` language, `Phaser` for game engine and `Rozsa MOGS` (a
multiplayer lib over Socket.io) for Websocket communication.

# Game screenshots

![loby](docs/loby.png "Lobby")

![gameplay](docs/gameplay.png "Gameplay")


## Features

- Multiplayer Online Game
- Websocket network communication with authoritative server (client-server arch)
- Lobby and Matchmaking support
  - Lobby sharing via code
  - *Matchmaking mode needs to be reactivated in the code and needs an extra service to create the matches
- Allows players to reconnect to the match
- Configuration-based content
- Game server auto-shutdown (when maximum time or no connected players)

*Not very well-supported in mobile browsers.

## TODO

NEXT:

- Add a message-log (or a chat) to improve the notifications experience
- Allows to display players entering the lobby
- Update doc images


## EC2 Setup

### Server Backend

```shell
sudo yum update -y
sudo yum install git -y
sudo yum install -y nodejs

git clone https://github.com/dendriel/princeps.git

cd princeps
npm i
npm run build
```

### Nginx

```shell
# Configure Access
sudo yum install nginx -y

sudo mkdir /etc/nginx/sites-available
sudo mkdir /etc/nginx/sites-enabled

sudo vi /etc/nginx/sites-available/princeps-express # add server config (cfg bellow)
sudo ln /etc/nginx/sites-available/princeps-express /etc/nginx/sites-enabled/
sudo vi /etc/nginx/nginx.conf # make nginx aware of the config (cfg bellow)

sudo nginx -t # check the config
sudo systemctl start nginx # start the service (or reload if already active)

# Configure HTTPS

sudo yum install certbot python3-certbot-nginx -y
sudo certbot --nginx -d princeps.vrozsa.com
```

#### `princeps-express` base server config for Nginx
```
server {
listen 80;
server_name princeps.vrozsa.com;

    # Web Backend config
    location /lobby {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Frontend config (client)
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
*Certbot will update this config latter.

Also, if not present, add `include /etc/nginx/sites-enabled/*;` to `/etc/nginx/nginx.conf` inside the `http` block.

## Frontend and Backend as services

Set the frontend and backend as services to auto-restart.

> Note: the certificate private-key and chain file path will be available into `/etc/nginx/nginx.conf` after setting up
> the certbot.

Create a file at `/etc/systemd/system/princeps-backend.service` and past the config:
```
[Unit]
Description=Princeps Backend
After=network.target

[Service]
ExecStart=/usr/bin/node /home/ec2-user/princeps/server-backend.js
WorkingDirectory=/home/ec2-user/princeps
Restart=always
User=root

Environment=PRINCEPS_SSL_KEY={TODO: add the certificate-key path here}
Environment=PRINCEPS_SSL_CERT={TODO: add the certificate path here}

StandardOutput=append:/home/ec2-user/backend.log
StandardError=append:/home/ec2-user/backend.log

[Install]
WantedBy=multi-user.target
```

Create a file at `/etc/systemd/system/princeps-frontend.service` and past the config:
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

Start both services:

```
sudo systemctl start princeps-backend
sudo systemctl start princeps-frontend
```