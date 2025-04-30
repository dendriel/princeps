import {Player} from "./player.js";
import {ActiveConnection} from "rozsa-mogs";

/**
 * Handle player's information and state.
 * Helps to control the number of expected players in the match, player's turns and score.
 */
export interface PlayersHolder {
    add(player: Player): void;

    get players(): Player[];

    get(activeConnection: ActiveConnection): Player | undefined;

    addConnectionInfo(activeConnection: ActiveConnection): Player | undefined;

    removeConnectionInfo(activeConnection: ActiveConnection): Player | undefined;

    getPlayerWithMostPoints(): Player[];

    getCurrentPlayerToPlay(): Player;

    updateNextPlayerToPlay(): void;

    isPlayerTurn(player: Player): boolean;

    /**
     * All expected players joined and are currently connected?
     */
    allPlayersOnline(): boolean;

    /**
     * All expected players have already connected/registered (even if they may be no connected right now)?
     */
    allPlayersJoined(): boolean;
}