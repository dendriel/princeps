
export class Position {

    constructor(private _x: number, private _y: number, private _z?: number) {
        this._z = this._z ?? 0;
    }

    static of(x: number, y: number): Position {
        return new Position(x, y);
    }

    static ofPosition(pos: Position): Position {
        return new Position(pos.x, pos.y, pos.z);
    }

    add(x: number, y: number) {
        this._x += x;
        this._y += y;
    }

    addOffset(offset: Position) {
        this._x += offset.x;
        this._y += offset.y;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get z(): number {
        return this._z!;
    }

    set z(value: number) {
        this._z = value;
    }

    copy(): Position {
        return new Position(this.x, this.y, this.z);
    }
}