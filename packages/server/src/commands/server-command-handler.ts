import {Player} from "../services/player.js";

/**
 * Contract for handling commands received from the server.
 */
export interface ServerCommandHandler {
    execute(player: Player, payload: unknown): Promise<void>

    requirePlayerTurn(): boolean
}