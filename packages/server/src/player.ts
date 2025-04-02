import {ActiveConnection} from "rozsa-mogs";


export class Player {
    constructor(private conn: ActiveConnection) {
    }

    get info() {
        return this.conn.info;
    }
}