import { User, UserName } from 'domain/user'

export class IncorrectCredentialException {
    constructor() {

    }
}

export class UnauthorizedException {
    constructor() {

    }
}

export class UserApplicationData {
    constructor(repository) {
        this.repository = repository
    }
}

export class UserApplication {
    constructor(serviceLocator, userRepository) {
        this._userRepository = userRepository
        this._serviceLocator = serviceLocator
    }

    async register(rawName, password) {
        const name = new UserName(rawName)
        const user = new User(name)
        await this._userRepository.create(user)

        const accountApplication = this._serviceLocator.load('account')
        await accountApplication.register(user.id, password)
    }

    async authenticate(rawName, password) {
        const name = new UserName(rawName)
        const user = await this._userRepository.findByName(name)

        const accountApplication = this._serviceLocator.load('account')
        const result = await accountApplication.authenticate(user.id, password)

        return result
    }

    async loggedIn(session, rawName) {
        const name = new UserName(rawName)
        let loggedIn = false

        try {
            const user = await this._userRepository.findByName(name)
            const authSessionApplication = this._serviceLocator.load('auth-session')
            const authSession = await authSessionApplication.load(session)
            const current = authSession.user
            loggedIn = user.valueOf() == current.valueOf()
        } catch (e) {
            loggedIn = false
        }

        return loggedIn
    }

    async requireLoggedIn(session, rawName) {
        if (!await this.loggedIn(session, rawName))
            throw new UnauthorizedException()
    }

    async login(session, rawName, password) {
        if (await this.authenticate(rawName, password)) {
            const name = new UserName(rawName)
            const user = await this._userRepository.findByName(name)

            const authSessionApplication = this._serviceLocator.load('auth-session')
            await authSessionApplication.add(session, user)
        } else {
            throw new IncorrectCredentialException()
        }
    }

    async logout(session) {
        const authSessionApplication = this._serviceLocator.load('auth-session')
        await authSessionApplication.remove(session)
    }

    async delete(session, rawName) {
        await this.requireLoggedIn(session, rawName)

        const name = new UserName(rawName)

        try {
            const user = await this._userRepository.findByName(name)
            await this._userRepository.delete(user)
            const accountApplication = this._serviceLocator.load('account')
            await accountApplication.delete(user.id)
            await this.logout(session)
        } catch (e) { }
    }

    _notify() {
        return new UserApplicationData(this._userRepository)
    }
}
