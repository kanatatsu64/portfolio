export class InMemoryDatabaseNotFoundException {
    constructor(key) {
        this.key = key
    }
}

export class InMemoryDatabaseData {
    constructor(table) {
        this.table = table
    }
}

export class InMemoryDatabase {
    constructor() {
        this._table = {}
    }

    upsert(key, value) {
        this._table[key] = value
    }

    find(key) {
        if (key in this._table)
            return this._table[key]
        else
            throw new InMemoryDatabaseNotFoundException(key)
    }

    query(filter) {
        const values = Object.values(this._table)
        const hits = values.filter(filter)
        return hits
    }

    delete(key) {
        this._table[key] = null
        delete this._table[key]
    }

    _notify() {
        return new InMemoryDatabaseData(this._table)
    }
}
