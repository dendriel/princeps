export class Size {
    _w;
    _h;
    constructor(_w, _h) {
        this._w = _w;
        this._h = _h;
    }
    static of(w, h) {
        return new Size(w, h);
    }
    get w() {
        return this._w;
    }
    set w(value) {
        this._w = value;
    }
    get h() {
        return this._h;
    }
    set h(value) {
        this._h = value;
    }
}
