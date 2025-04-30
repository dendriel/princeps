import {PrincepsServer} from 'princeps-server/dist/princeps-server.js';

/**
 * node game-server.js {server-port} {lobby-token} {players-count} {turns} {cards-count}
 */

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

const gameServer = new PrincepsServer(true, players, sslKeyPath, sslCertPath);

gameServer.start(port, token, turns, cards);
