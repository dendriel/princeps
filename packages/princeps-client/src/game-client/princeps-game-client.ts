import {GameClient} from "rozsa-mogs-client";
import {CommandHandler} from "./command-handlers/command-handler.js";
import {ClientCommands} from "./client-commands.js";
import {LoadMap} from "./command-handlers/load-map.js";
import {GameController} from "../game/game-controller.js";

/**
 * Responsible for handling commands received from the server.
 */
export class PrincepsGameClient implements GameClient {

    private readonly commandsHandler: Map<ClientCommands, CommandHandler>;

    constructor(private gameCtrl: GameController) {
        this.commandsHandler = new Map<ClientCommands, CommandHandler>();

        this.setupCommandHandlers();
    }

    private setupCommandHandlers() {
        // @ts-ignore
        this.commandsHandler[ClientCommands.LOAD_MAP] = new LoadMap(this.gameCtrl);
    }

    onCommand(cmd: string, payload: any) {
        console.log(`Command received! cmd: ${cmd} payload: ${payload}`)

        const cmdKey = cmd as ClientCommands; //ClientCommands[cmd as keyof typeof ClientCommands];
        // @ts-ignore
        const handler = this.commandsHandler[cmdKey];

        if (!handler) {
            console.log(`Undefined command handler '${cmdKey}'`);
            return;
        }

        handler.execute(payload);
    }

    onDisconnection(reason: string) {
        console.log(`Disconnected from server ${reason}`)
    }

    onConnectError(error: Error) {
        console.log(`Connection error ${JSON.stringify(error)}`)

    }
}