import {PrincepsServer} from 'princeps-server/dist/princeps-server.js'
import {PrincepsConnectionInfo} from "princeps-server/dist/princeps-connection-info.js";

const server = new PrincepsServer();

// TODO: create connection/player info
server.addExpectedPlayer( new PrincepsConnectionInfo("ABCD"));
server.addExpectedPlayer( new PrincepsConnectionInfo("1234"));
// server.addExpectedPlayer( new PrincepsConnectionInfo("5555"));
server.start(16, 2);