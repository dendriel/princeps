import {ActiveConnection, ConnectionInfo} from "rozsa-mogs";


export class Player {

    private _activeConn: ActiveConnection | undefined;

    constructor(private _connInfo: ConnectionInfo) {
    }

    get isConnected(): boolean {
        return this._activeConn !== undefined;
    }

    get socket() {
        return this._activeConn?.socket;
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
}