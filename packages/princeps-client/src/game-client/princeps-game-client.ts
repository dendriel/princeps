import {GameClient} from "rozsa-mogs-client";
import {ClientCommand, CommandHandler} from "../../../shared/dist/princeps-shared.js"
import {LoadGame} from "./command-handlers/load-game.js";
import {GameController} from "../game/game-controller.js";
import {ActivateTurn} from "./command-handlers/activate-turn.js";
import {DeactivateTurn} from "./command-handlers/deactivate-turn.js";
import {CommandDispatcher} from "./commands/command-dispatcher.js";
import {Card} from "../game/card.js";
import {ShowCard} from "./command-handlers/show-card.js";
import {HideCards} from "./command-handlers/hide-cards.js";
import {UpdateScore} from "./command-handlers/update-score.js";
import {ShowMessage} from "./command-handlers/show-message.js";
import {FinishGame} from "./command-handlers/finish-game.js";

/**
 * Responsible for handling commands received from the server.
 */
export class PrincepsGameClient implements GameClient {

    private readonly commandsHandler: Map<ClientCommand, CommandHandler>;

    private commandsDispatcher: CommandDispatcher | undefined;

    constructor(private readonly gameCtrl: GameController) {
        this.commandsHandler = new Map<ClientCommand, CommandHandler>();
        this.setupControllerListeners();
    }

    setDispatcher(commandsDispatcher: CommandDispatcher) {
        this.commandsDispatcher = commandsDispatcher;
        this.setupCommandHandlers();
    }

    private setupCommandHandlers() {
        // @ts-ignore
        this.commandsHandler[ClientCommand.LOAD_GAME] = new LoadGame(this.gameCtrl, this.commandsDispatcher);
        // @ts-ignore
        this.commandsHandler[ClientCommand.ACTIVATE_TURN] = new ActivateTurn(this.gameCtrl);
        // @ts-ignore
        this.commandsHandler[ClientCommand.DEACTIVATE_TURN] = new DeactivateTurn(this.gameCtrl);
        // @ts-ignore
        this.commandsHandler[ClientCommand.SHOW_CARD] = new ShowCard(this.gameCtrl);
        // @ts-ignore
        this.commandsHandler[ClientCommand.HIDE_CARDS] = new HideCards(this.gameCtrl);
        // @ts-ignore
        this.commandsHandler[ClientCommand.UPDATE_SCORE] = new UpdateScore(this.gameCtrl);
        // @ts-ignore
        this.commandsHandler[ClientCommand.SHOW_MESSAGE] = new ShowMessage(this.gameCtrl);
        // @ts-ignore
        this.commandsHandler[ClientCommand.FINISH_GAME] = new FinishGame(this.gameCtrl);
    }

    private setupControllerListeners() {
        this.gameCtrl.addCardClickedListener(this.onCardClicked.bind(this));
        this.gameCtrl.addTextChatSubmitListener(this.onChatSubmit.bind(this));
    }

    private onCardClicked(card: Card) {
        this.commandsDispatcher?.selectCard(card);
    }

    private onChatSubmit(text: string) {
        this.commandsDispatcher?.sendChatMessage(text);
    }

    onCommand(cmd: string, payload: any) {
        // console.log(`Command received! cmd: ${cmd} payload: ${JSON.stringify(payload)}`)

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