import {PrincepsServer} from './packages/server/dist/princeps-server.js'

const server = new PrincepsServer();

// TODO: create connection/player info
server.addExpectedPlayer( new (class { token() { return "ABCD" } }));
server.addExpectedPlayer( new (class { token() { return "1234" } }));
server.start();