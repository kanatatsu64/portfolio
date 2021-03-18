import { Id } from './id'

export class AuthSessionData {
    constructor(key, user) {
        this.key = key
        this.user = user
    }
}

export class AuthSession {
    constructor(user) {
        this.key = new Id()
        this.user = user
    }

    static _restore(key, user) {
        const authSession = new AuthSession(null)
        authSession.key = key
        authSession.user = user

        return authSession
    }

    _notify() {
        return new AuthSessionData (
            this.key,
            this.user
        )
    }
}
