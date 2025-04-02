

export class Size {
    constructor(private _w: number, private _h: number) {}

    get w(): number {
        return this._w;
    }

    set w(value: number) {
        this._w = value;
    }

    get h(): number {
        return this._h;
    }

    set h(value: number) {
        this._h = value;
    }
}