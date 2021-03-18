const sqlite3 = require('sqlite3')

export class RecordNotFoundException {
    constructor() {

    }
}

export class RecordMultipleException {
    constructor() {

    }
}

class Database {
    constructor(file) {
        this._db = new sqlite3.Database(file)
    }

    async _wrap(run, query) {
        console.log(query)
        return new Promise((resolve, refuse) => {
            run(query, (err, res) => {
                if (err == null)
                    resolve(res)
                else
                    refuse(err)
            })
        })
    }

    async run(query) {
        return await this._wrap(this._db.run.bind(this._db), query)
    }

    async all(query) {
        return await this._wrap(this._db.all.bind(this._db), query)
    }
}
const db = new Database('internal/main.db')

function transpose(array) {
    return array[0].map((col, i) => array.map(row => row[i]))
}

export class SqliteTable {
    constructor(name, schema) {
        this._name = name
        this._schema = schema
    }

    static async create(name, schema) {
        const defs = Object.entries(schema).map(([key, type]) => (
            `${key} ${type}`
        ))
        const createQuery =
            `CREATE TABLE IF NOT EXISTS ${name} (${defs.join(', ')});`
        await db.run(createQuery)

        return new SqliteTable(name, schema)
    }

    _format(value, type) {
        switch (type) {
            case 'TEXT':
            case 'test':
                return `"${value}"`    
            default:
                return value
        }
    }

    async insert(data) {
        const [keys, values] = transpose(Object.entries(data).map(([key, value]) => {
            const type = this._schema[key]
            return [key, this._format(value, type)]
        }))
        const insertQuery =
            `INSERT INTO ${this._name} (${keys.join(', ')}) VALUES (${values.join(', ')});`
        await db.run(insertQuery)
    }

    async findAll(match) {
        const conds = Object.entries(match).map(([key, value]) => {
            const type = this._schema[key]
            return `${key}=${this._format(value, type)}`
        })
        const selectQuery =
            `SELECT * FROM ${this._name} WHERE ${conds.join(' AND ')};`
        return await db.all(selectQuery)
    }
        
    async find(match) {
        const rows = await this.findAll(match)

        if (rows.length == 0)
            throw new RecordNotFoundException()
        else if (rows.length > 1)
            throw new RecordMultipleException()
        else
            return rows[0]
    }

    async exists(match) {
        const rows = await this.findAll(match)

        return rows.length > 0
    }

    async delete(match) {
        const conds = Object.entries(match).map(([key, value]) => {
            const type = this._schema[key]
            return `${key}=${this._format(value, type)}`
        })
        const deleteQuery =
            `DELETE FROM ${this._name} WHERE ${conds.join(' AND ')};`
        await db.run(deleteQuery)
    }
}
