import { InMemoryDatabase } from 'infrastructure/database/inMemory'
import { AuthSessionNotFoundException } from '../shared/authSessionRepository'

export class AuthSessionRepositoryData {
    constructor(database) {
        this.database = database
    }
}

export class AuthSessionRepository {
    constructor() {
        this._database = new InMemoryDatabase()
    }

    _generateKey(authSession) {
        const authSessionKey = authSession.key
        const key = authSessionKey._value
        return key
    }

    async create(authSession) {
        const key = this._generateKey(authSession)
        this._database.upsert(key, authSession)
    }

    async find(authSessionKey) {
        const key = authSessionKey._value
        let authSession = undefined

        try {
            authSession = this._database.find(key)
        } catch (e) {
            throw new AuthSessionNotFoundException()
        }

        return authSession
    }

    async delete(authSession) {
        const key = this._generateKey(authSession)
        this._database.delete(key)
    }

    _notify() {
        return new AuthSessionRepositoryData(this._database)
    }
}
