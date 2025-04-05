import {ServerCommandHandler} from "./server-command-handler.js";
import {Player} from "../game-server/player.js";
import {MatchHandler} from "../game-server/match-handler.js";

export abstract class AbstractServerCommandHandler<P, T> implements ServerCommandHandler {

    protected constructor(private _type: T, protected matchHandler: MatchHandler) {}

    get type(): T {
        return this._type;
    }

    execute(player: Player, payload: unknown): void {
        try {
            const typedPayload = payload as P;

            console.log(`Handling ${this._type} command for player ${player.debug} with payload: ${JSON.stringify(typedPayload)}`);

            this.handleCommand(player, typedPayload);
        } catch (error) {
            console.log(`Failed to handle command ${this._type}. Error: ${JSON.stringify(error)}`);
        }
    }

    abstract handleCommand(player: Player, payload: P): void;
}