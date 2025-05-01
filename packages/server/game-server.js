import {PrincepsServer} from 'princeps-server/dist/princeps-server.js';

/**
 * node game-server.js {server-port} {lobby-token} {players-count} {turns} {cards-count}
 */

// After how much time the server will be shutdown automatically (even if there are players connected).
const serverTimeoutInMin = 60;
// Kinda of a watchdog to verify every X time if there are players connected and keep the server alive.
const connectionTimeoutInMin = 5;

if (process.argv.length < 4) {
    console.log(`Invalid args count. server-port and lobby-token args are mandatory`);
    process.exit(-1);
}

let port = +process.argv[2];
let token = process.argv[3];
let players = process.argv.length >= 5 ? +process.argv[4] : 2;
let turns = process.argv.length >= 6 ? +process.argv[5] : 3;
let cards = process.argv.length >= 7 ? +process.argv[6] : 16;

console.log(`Princeps Game Server is starting with port=${port}, token=${token}, players=${players}, turns=${turns}, cards=${cards}`);

const sslKeyPath = process.env.PRINCEPS_SSL_KEY;
const sslCertPath = process.env.PRINCEPS_SSL_CERT;

setServerTimeout(serverTimeoutInMin, token);

const gameServer = new PrincepsServer(true, players, sslKeyPath, sslCertPath);
setConnectionTimeout(connectionTimeoutInMin, token, gameServer);
gameServer.start(port, token, turns, cards);


// Handles the maximum time the server can keep alive.
function setServerTimeout(timeInMin, token) {
    new Promise(resolve => setTimeout(resolve, timeInMin * 1000 * 60))
        .then(() => {
            // we could shut down gracefully / disconnect the players if any.
            console.log(`[${token}] The game-server has timeout. Halting...`);
            process.exit(0);
        });
}

// Handles the maximum time the server can keep alive without connections.
function setConnectionTimeout(timeInMin, token, gameServer) {
    new Promise(resolve => setTimeout(resolve, timeInMin * 1000 * 60))
        .then(() => {
            if (gameServer.hasConnectedPlayers()) {
                console.log(`[${token}] Watchdog: the server still has players.`);
                // Reset the timer.
                setConnectionTimeout(timeInMin, token, gameServer);
                return;
            }

            console.log(`[${token}] The game-server has no players online. Halting...`);
            process.exit(0);
        });
}