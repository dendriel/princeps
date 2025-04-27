const express = require('express');
const { spawn } = require('child_process');
const { randomUUID } = require('crypto');

const app = express();
app.use(express.json())

const port = 80;

const minServerPort = 50000;
const maxServerPort = 51000;

let matchCount = 0;

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

    const lobbyToken = randomUUID();
    const port = minServerPort + Math.floor(Math.random() * (maxServerPort - minServerPort));

    // TODO: for now, just launch the server and expect it to start OK.
    const child = spawn('node', ['game-server.js', port, lobbyToken, players, turns, cards], { stdio: 'inherit' });

    matchCount++;

    child.on('close', (code) => {
        matchCount--;
        console.log(`Child process exited with code ${code}`);
    });

    const resBody = { token: lobbyToken, port: port };

    console.log(`New match started! Active matches: ${matchCount}. Current Match: ${resBody}`)

    res.json(resBody);
});

app.listen(port, () => {
    console.log('Client listening on http://localhost:' + port);
});