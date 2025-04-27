import {MatchmakingPlayersHolder} from "./matchmaking-players-holder.js";
import {ActiveConnection} from "rozsa-mogs";
import {Player} from "./player.js";

/**
 * Handle expected players in lobby mode.
 */
export class LobbyPlayersHolder extends MatchmakingPlayersHolder {

    constructor(private playersCount: number) {
        super();
    }

    addConnectionInfo(conn: ActiveConnection): Player | undefined {
        // If the lobby was already filled and this is not a player from the match, refuse the connection.
        if (this.allPlayersJoined() && !this.get(conn)) {
            return undefined;
        }

        if (!this.get(conn)) {
            // If this player didn't connect before, register it.
            this.add(new Player(conn.info));
        }

        return super.addConnectionInfo(conn);
    }

    /**
     * Checks against total players.
     */
    allPlayersOnline(): boolean {
        return this.connectedPlayersCount() === this.playersCount;
    }

    /**
     * Checks against total players.
     */
    allPlayersJoined(): boolean {
        return this.totalPlayers === this.playersCount;
    }
}