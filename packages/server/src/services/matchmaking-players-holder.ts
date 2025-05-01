import {Player} from "./player.js";
import {ActiveConnection} from "rozsa-mogs";
import {PlayersHolder} from "./players-holder.js";

export class MatchmakingPlayersHolder implements PlayersHolder {

    private readonly playersByToken: Map<String, Player>;

    private currPlayersTurn: number = 0;

    constructor() {
        this.playersByToken = new Map<String, Player>;
    }

    add(player: Player) {
        this.playersByToken.set(player.token, player);
    }

    remove(player: Player) {
        this.playersByToken.delete(player.token);
    }

    get(activeConnection: ActiveConnection): Player | undefined {
        return this.playersByToken.get(activeConnection.info.token());
    }

    get players(): Player[] {
        return [...this.playersByToken.values()];
    }

    get totalPlayers(): number {
        return this.playersByToken.size;
    }

    private getByIndex(index: number): Player {
        // todo: always creating a new array. We can create it in a wrapUp phase or something like that.
        return [...this.playersByToken.values()][index];
    }

    getCurrentPlayerToPlay(): Player {
        const currPlayerIdx = this.currPlayersTurn;
        return this.getByIndex(currPlayerIdx);
    }

    updateNextPlayerToPlay() {
        this.currPlayersTurn = (this.currPlayersTurn + 1) % this.totalPlayers;
    }

    /**
     * Find the players with most points. If more than one player is returned, it is draw.
     */
    getPlayerWithMostPoints(): Player[] {
        const sorted = this.players.sort((a, b) => b.score - a.score);

        const winners : Player[] = [];
        const first = sorted[0];
        winners.push(first);

        // Check if anyone else has the same points as the player with most points.
        for (let i = 1; i < sorted.length; i++) {
            const nextPlayer = sorted[i];
            if (nextPlayer.score === first.score) {
                winners.push(nextPlayer);
            }
        }

        return winners;
    }

    isPlayerTurn(player: Player): boolean {
        const currPlayer = this.getCurrentPlayerToPlay();
        return player.sameAs(currPlayer);
    }

    addConnectionInfo(activeConnection: ActiveConnection): Player | undefined {
        if (!activeConnection.info) {
            console.log(`No connection info available for connection: ${JSON.stringify(activeConnection)}`);
            return;
        }

        const player = this.playersByToken.get(activeConnection.info.token());
        if (!player) {
            console.log(`Player with token ${activeConnection.info.token()} was not found!`);
            return undefined;
        }

        player.nickname = activeConnection.params.get('nickname')!;
        player.activeConn = activeConnection;
        return player;
    }

    removeConnectionInfo(activeConnection: ActiveConnection): Player | undefined {
        const player = this.playersByToken.get(activeConnection.info.token());
        if (!player) {
            console.log(`Player with token ${activeConnection.info.token()} was not found!`);
            return undefined;
        }

        player.clearActiveConn();
        return player;

    }

    connectedPlayersCount(): number {
        const count = [...this.playersByToken.values()] // spread is required to work on js
            .filter((player, _) => player.isConnected)
            .length;
        console.log(`Connected players count: ${count}`);
        return count;
    }

    /**
     * Checks against 'expected players'
     */
    allPlayersOnline(): boolean {
        return this.connectedPlayersCount() === this.totalPlayers;
    }

    /**
     * Checks against 'expected players'
     */
    allPlayersJoined(): boolean {
        return this.players.length === this.totalPlayers;
    }

    anyPlayersOnline(): boolean {
        return this.connectedPlayersCount() > 0;
    }
}