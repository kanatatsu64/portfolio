import { SqliteTable } from 'infrastructure/database/sqlite'
import { AuthSession } from 'domain/authSession'
import { Id } from 'domain/id'

export class AuthSessionRepository {
    constructor(userRepository, table, schema) {
        this._userRepository = userRepository
        this._table = table
        this._schema = schema
    }

    static async create(userRepository) {
        const schema = {
            key: 'TEXT',
            userId: 'TEXT'
        }
        const table = await SqliteTable.create('authSession', schema)
        
        return new AuthSessionRepository(userRepository, table, schema)
    }

    _convert(authSession) {
        const { key, user } = authSession
        return {
            key: key._value,
            userId: user.id._value
        }
    }

    async _restore(data) {
        const { key, userId } = data
        const user = await this._userRepository.find(new Id(userId))
        const authSession = AuthSession._restore(new Id(key), user)

        return authSession
    }

    async create(authSession) {
        const data = this._convert(authSession)
        await this._table.insert(data)
    }

    async find(key) {
        const match = { key: key._value }
        let data = undefined

        try {
            data = await this._table.find(match)
        } catch (e) {
            throw new AuthSessionNotFoundException()
        }

        const authSession = await this._restore(data)

        return authSession
    }

    async delete(authSession) {
        const match = this._convert(authSession)
        await this._table.delete(match)
    }
}
