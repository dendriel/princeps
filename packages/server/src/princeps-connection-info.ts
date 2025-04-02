import {ConnectionInfo} from "rozsa-mogs";


export class PrincepsConnectionInfo implements ConnectionInfo {

    constructor(private _token: string) {
    }

    token(): string {
        return this._token;
    }

}