import {PrincepsServer} from './packages/server/dist/princeps-server.js'

const server = new PrincepsServer();
server.addExpectedPlayer({ token: "ABCD"});
server.addExpectedPlayer({ token: "1234"});
server.start();