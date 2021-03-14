export class Id {
    constructor(id) {
        this._value = id || 'id:' + this._generateRandom()
    }

    valueOf() {
        return this._value
    }

    _generateRandom() {
        const date = new Date()
        const timestamp = date.getTime()
        return timestamp.toString()
    }
}
