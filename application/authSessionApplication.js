import { Id } from 'domain/id'
import { AuthSession } from 'domain/authSession'

export class AuthSessionNotFoundException {
    constructor() {

    }
}

export class AuthSessionData {
    constructor(repository) {
        this.repository = repository
    }
}

export class AuthSessionApplication {
    constructor(serviceLocator, authSessionRepository) {
        this._authSessionRepository = authSessionRepository
        this._serviceLocator = serviceLocator
    }

    async add(session, user) {
        const authSession = new AuthSession(user)
        await this._authSessionRepository.create(authSession)
        const key = authSession.key.valueOf()
        session.add('auth', key)
    }

    async remove(session) {
        try {
            const authSession = await this.load(session)
            session.remove('auth')
            await this._authSessionRepository.delete(authSession)
        } catch (e) { }
    }

    async load(session) {
        let authSession = undefined

        try {
            const key = session.read('auth')
            const authSessionKey = new Id(key)
            authSession = await this._authSessionRepository.find(authSessionKey)
        } catch (e) {
            throw new AuthSessionNotFoundException()
        }

        return authSession
    }

    _notify() {
        return new AuthSessionData(this._authSessionRepository)
    }
}
