import { SqliteTable } from 'infrastructure/database/sqlite'
import { Account } from 'domain/account'
import { Id } from 'domain/id'
import { AccountNotFoundException } from '../shared/accountRepository'

export class AccountRepository {
    constructor(table, schema) {
        this._table = table
        this._schema = schema
    }

    static async create() {
        const schema = {
            id: 'TEXT',
            password: 'TEXT'
        }
        const table = await SqliteTable.create('account', schema)

        return new AccountRepository(table, schema)
    }

    _convert(account) {
        const { id, _hash } = account
        return {
            id: id._value,
            password: _hash
        }
    }

    _restore(data) {
        const { id, password } = data
        const account = Account._restore(new Id(id), password)

        return account
    }

    async create(account) {
        const data = this._convert(account)
        await this._table.insert(data)
    }

    async find(id) {
        const match = { id: id._value }
        let data = undefined

        try {
            data = await this._table.find(match)
        } catch (e) {
            throw new AccountNotFoundException()
        }

        const account = this._restore(data)

        return account
    }

    async delete(account) {
        const match = this._convert(account)
        await this._table.delete(match)
    }
}
