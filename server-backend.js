const express = require('express');
const { spawn } = require('child_process');
const { randomUUID } = require('crypto');

const app = express();
app.use(express.json())

const port = 8000;
const gameServerScript = 'packages/server/game-server.js';

const minServerPort = 50000;
const maxServerPort = 51000;

/**
 * Store lobbies info. [lobbyCode]info
 */
let lobbies = {};
let matchCount = 0;

// TODO: testing purpose only
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allows all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow common methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    next();
});

/**
 * Create a new game-server and returns its address to connect.
 */
app.post('/lobby', (req, res) => {

    if (!req.body) {
        console.log(`${JSON.stringify(req.body)}`)
        res.status(400)
            .send('Request Body with match parameters is required.');
        return;
    }

    const { players, turns, cards } = req.body;

    if (players < 2 || players > 4) {
        res.status(400)
            .send('Invalid players count! Min:2, Max:4', );
        return;
    }

    if (turns < 1 || turns > 10) {
        res.status(400)
            .send('Invalid turns count! Min:1, Max:10', );
        return;
    }

    const lobbyToken = randomUUID().split('-')[4];
    const port = minServerPort + Math.floor(Math.random() * (maxServerPort - minServerPort));

    // TODO: for now, just launch the server and expect it to start OK.
    const child = spawn('node', [gameServerScript, port, lobbyToken, players, turns, cards], { stdio: 'inherit' });

    matchCount++;
    // TODO: no worries in syncing the lobby/game-server with backend for now.
    lobbies[lobbyToken] = {
        token: lobbyToken,
        port: port,
        players: players,
        turns: turns,
        cards: cards
    };

    child.on('close', (code) => {
        matchCount--;
        console.log(`Child process exited with code ${code}`);
    });

    const resBody = { token: lobbyToken, port: port };

    console.log(`New match started with token: ${lobbyToken}! Active matches: ${matchCount}. Current Match: ${resBody}`)

    res.json(resBody);
});

app.get('/lobby/:code', (req, res) => {

    const lobbyToken = req.params.code;
    const lobby = lobbies[lobbyToken];
    if (!lobby) {
        const msg = `Lobby ${lobbyToken} was not found.`;
        console.log(msg);
        res.status(404)
            .send(msg);
        return;
    }

    const resBody = { token: lobby.token, port: lobby.port };

    console.log(`New player joined match with token: ${lobby.token} at port: ${lobby.port}! Active matches: ${matchCount}.`)

    res.json(resBody);
});

const server = app.listen(port, () => {
    console.log('Client listening on http://localhost:' + port);
});

server.on('error', (err) => {
    console.error('Server failed to start:', err);
});

server.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});

server.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
});