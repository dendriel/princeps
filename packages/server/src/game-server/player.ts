import {ActiveConnection, ConnectionInfo} from "rozsa-mogs";


export class Player {

    private _activeConn: ActiveConnection | undefined;

    private _score: number = 0;

    private _nickname: string = "";

    private _isCombo: boolean = false;

    constructor(private _connInfo: ConnectionInfo) {}

    get isConnected(): boolean {
        return this._activeConn !== undefined;
    }

    get socket() {
        return this._activeConn?.socket;
    }

    get nickname(): string {
        return this._nickname;
    }

    set nickname(value: string) {
        this._nickname = value;
    }

    get isCombo(): boolean {
        return this._isCombo;
    }

    setInCombo() {
        this._isCombo = true;
    }

    resetCombo() {
        this._isCombo = false;
    }

    get score(): number {
        return this._score;
    }

    addScore(value: number): number {
        if (value < 0) {
            return this._score;
        }

        value *= this.isCombo ? 2 : 1;
        console.log(`In combo: ${this.isCombo}; score: ${value}`);

        this._score += value;
        return this._score;
    }

    get connInfo(): ConnectionInfo {
        return this._connInfo;
    }

    set activeConn(value: ActiveConnection) {
        this._activeConn = value;
    }

    clearActiveConn() {
        this._activeConn = undefined;
    }

    get token() {
        return this._connInfo.token();
    }

    sameAs(player: Player): boolean {
        return player.token == this.token;
    }

    get debug(): string {
        return JSON.stringify(this._connInfo);
    }
}