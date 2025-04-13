import {Player} from "./player.js";
import {ActiveConnection} from "rozsa-mogs";

export class PlayersHolder {

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
        return this.playersByToken.values().toArray()[index];
    }

    getCurrentPlayerToPlay(): Player {
        const currPlayerIdx = this.currPlayersTurn;
        return this.getByIndex(currPlayerIdx);
    }

    updateNextPlayerToPlay() {
        this.currPlayersTurn = (this.currPlayersTurn + 1) % this.totalPlayers;
    }

    isPlayerTurn(player: Player): boolean {
        const currPlayer = this.getCurrentPlayerToPlay();
        return player.sameAs(currPlayer);
    }

    addConnectionInfo(activeConnection: ActiveConnection): Player | undefined {
        const player = this.playersByToken.get(activeConnection.info.token());
        if (!player) {
            console.log(`Player with token ${activeConnection.info.token()} was not found!`);
            return undefined;
        }

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
        return this.playersByToken.values()
            .filter((player, _) => player.isConnected)
            .toArray()
            .length;
    }

    allPlayersAlreadyConnected(): boolean {
        return this.connectedPlayersCount() == this.totalPlayers;
    }
}