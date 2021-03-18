import { InMemoryDatabase } from 'infrastructure/database/inMemory'
import { AccountNotFoundException } from '../shared/accountRepository'

export class AccountRepositoryData {
    constructor(database) {
        this.database = database
    }
}

export class AccountRepository {
    constructor() {
        this._database = new InMemoryDatabase()
    }

    _generateKey(account) {
        const id = account.id
        const key = id._value
        return key
    }

    async create(account) {
        const key = this._generateKey(account)
        this._database.upsert(key, account)
    }

    async find(id) {
        const key = id._value
        let account = undefined

        try {
            account = this._database.find(key)
        } catch (e) {
            throw new AccountNotFoundException()
        }

        return account
    }

    async delete(account) {
        const key = this._generateKey(account)
        this._database.delete(key)
    }

    _notify() {
        return new AccountRepositoryData(this._database)
    }
}
