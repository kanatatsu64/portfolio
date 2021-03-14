export class InMemorySessionNotFoundException {
    constructor() {

    }
}

export class InMemorySessionData {
    constructor(data) {
        this.data = data
    }
}

export class InMemorySession {
    constructor() {
        this._data = {}
    }

    add(tag, value) {
        this._data[tag] = value
    }

    read(tag) {
        if (tag in this._data)
            return this._data[tag]
        else
            throw new InMemorySessionNotFoundException()
    }

    remove(tag) {
        if (tag in this._data)
            delete this._data[tag]
    }

    _notify() {
        return new InMemorySessionData(this._data)
    }
}
