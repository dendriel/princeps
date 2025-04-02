import {GameClient} from "rozsa-mogs-client";
import {CommandHandler} from "./command-handlers/command-handler.js";
import {ClientCommand} from "../../../shared/dist/princeps-shared.js"
import {LoadGame} from "./command-handlers/load-game.js";
import {GameController} from "../game/game-controller.js";
import {ActivateTurn} from "./command-handlers/activate-turn.js";
import {DeactivateTurn} from "./command-handlers/deactivate-turn.js";
import {CommandDispatcher} from "./commands/command-dispatcher.js";
import {Card} from "../game/card.js";

/**
 * Responsible for handling commands received from the server.
 */
export class PrincepsGameClient implements GameClient {

    private readonly commandsHandler: Map<ClientCommand, CommandHandler>;

    private commandsDispatcher: CommandDispatcher | undefined;

    constructor(private readonly gameCtrl: GameController) {
        this.commandsHandler = new Map<ClientCommand, CommandHandler>();

        this.setupCommandHandlers();
        this.setupControllerListeners();
    }

    setDispatcher(commandsDispatcher: CommandDispatcher) {
        this.commandsDispatcher = commandsDispatcher;
    }

    private setupCommandHandlers() {
        // @ts-ignore
        this.commandsHandler[ClientCommand.LOAD_GAME] = new LoadGame(this.gameCtrl);
        // @ts-ignore
        this.commandsHandler[ClientCommand.ACTIVATE_TURN] = new ActivateTurn(this.gameCtrl);
        // @ts-ignore
        this.commandsHandler[ClientCommand.DEACTIVATE_TURN] = new DeactivateTurn(this.gameCtrl);
    }

    private setupControllerListeners() {
        this.gameCtrl.addCardClickedListener(this.onCardClicked.bind(this));
    }

    private onCardClicked(card: Card) {
        // TODO: check if the card is already open.

        this.commandsDispatcher?.selectCard(card);
    }

    onCommand(cmd: string, payload: any) {
        console.log(`Command received! cmd: ${cmd} payload: ${JSON.stringify(payload)}`)

        const cmdKey = cmd as ClientCommand; //ClientCommands[cmd as keyof typeof ClientCommands];
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