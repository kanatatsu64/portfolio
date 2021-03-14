import { InMemoryDatabase } from 'infrastructure/database/inMemory'
import { UserNotFoundException, UserMultipleFoundException } from '../shared/userRepository'

export class UserRepositoryData {
    constructor(database) {
        this.database = database
    }
}

export class UserRepository {
    constructor() {
        this._database = new InMemoryDatabase()
    }

    _generateKey(user) {
        const userId = user.id
        const key = userId._value
        return key
    }

    async create(user) {
        const key = this._generateKey(user)
        this._database.upsert(key, user)
    }

    async update(user) {
        const key = this._generateKey(user)
        try {
            this._database.find(key)
            this._database.upsert(key, user)
        } catch (e) {
            throw new UserNotFoundException()
        }
    }

    async find(userId) {
        const key = userId._value
        let user = undefined

        try {
            user = this._database.find(key)
        } catch (e) {
            throw new UserNotFoundException()
        }

        return user
    }

    async findByName(userName) {
        const hits = this._database.query(user =>
            user.name.valueOf() == userName.valueOf()
        )
        let user = undefined

        if (hits.length == 0)
            throw new UserNotFoundException()
        else if (hits.length > 1)
            throw new UserMultipleFoundException()
        else
            user = hits[0]
        
        return user
    }

    async delete(user) {
        const key = this._generateKey(user)
        this._database.delete(key)
    }

    _notify() {
        return new UserRepositoryData(this._database)
    }
}
