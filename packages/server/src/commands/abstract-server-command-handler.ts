import {ServerCommandHandler} from "./server-command-handler.js";
import {Player} from "../game-server/player.js";
import {MatchHandler} from "../game-server/match-handler.js";
import {CommandDispatcher} from "./command-dispatcher.js";
import {PlayersHolder} from "../game-server/player-holder.js";

export abstract class AbstractServerCommandHandler<P, T> implements ServerCommandHandler {

    protected constructor(
        private _type: T,
        private _requirePlayerTurn: boolean,
        protected commandDispatcher: CommandDispatcher,
        protected matchHandler: MatchHandler,
        protected playersHolder: PlayersHolder
    ) {}

    get type(): T {
        return this._type;
    }

    requirePlayerTurn(): boolean {
        return this._requirePlayerTurn;
    }

    async execute(player: Player, payload: unknown): Promise<void> {
        try {
            const typedPayload = payload as P;

            console.log(`Handling ${this._type} command for player ${player.debug} with payload: ${JSON.stringify(typedPayload)}`);

            await this.handleCommand(player, typedPayload);
        } catch (error) {
            console.log(`Failed to handle command ${this._type}. Error: ${JSON.stringify(error)}`);
        }

        return Promise.resolve();;
    }

    abstract handleCommand(player: Player, payload: P): Promise<void>;
}