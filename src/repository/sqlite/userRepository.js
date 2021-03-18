import { SqliteTable } from 'infrastructure/database/sqlite'
import { User } from 'domain/user'
import { Id } from 'domain/id'
import { UserName } from 'domain/userName'
import { UserMultipleFoundException, UserNotFoundException } from '../shared/userRepository'

export class UserRepository {
    constructor(table, schema) {
        this._table = table
        this._schema = schema
    }

    static async create() {
        const schema = {
            id: 'TEXT',
            name: 'TEXT'
        }
        const table = await SqliteTable.create('user', schema)

        return new UserRepository(table, schema)
    }

    _convert(user) {
        const { id, name } = user
        return {
            id: id._value,
            name: name._value
        }
    }

    _restore(data) {
        const { id, name } = data
        const user = User._restore(new Id(id), new UserName(name))

        return user
    }

    async create(user) {
        const data = this._convert(user)
        await this._table.insert(data)
    }

    async find(id) {
        const match = { id: id._value }
        let data = undefined

        try {
            data = await this._table.find(match)
        } catch (e) {
            throw new UserNotFoundException()
        }

        const user = this._restore(data)

        return user
    }

    async findByName(name) {
        const match = { name: name._value }
        let rows = await this._table.findAll(match)

        if (rows.length == 0)
            throw new UserNotFoundException()
        else if (rows.length > 1)
            throw new UserMultipleFoundException()

        const data = rows[0]
        const user = this._restore(data)

        return user
    }

    async delete(user) {
        const match = this._convert(user)
        await this._table.delete(match)
    }
}
