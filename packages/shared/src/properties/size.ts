

export class Size {
    constructor(private _w: number, private _h: number) {}

    static of(w: number, h: number): Size {
        return new Size(w, h);
    }

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