import {ServerCommandHandler} from "./server-command-handler.js";
import {Player} from "../services/player.js";
import {MatchHandler} from "../services/match-handler.js";
import {CommandDispatcher} from "./command-dispatcher.js";
import {PlayersHolder} from "../services/players-holder.js";

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
        } catch (error: unknown) {
            console.error(`Failed to handle command ${this._type}.`, error);
        }

        return Promise.resolve();
    }

    abstract handleCommand(player: Player, payload: P): Promise<void>;
}