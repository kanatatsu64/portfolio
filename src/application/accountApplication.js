import { Account } from 'domain/account'

export class AccountApplicationData {
    constructor(repository) {
        this.repository = repository
    }
}

export class AccountApplication {
    constructor(serviceLocator, accountRepository) {
        this._accountRepository = accountRepository
        this._serviceLocator = serviceLocator
    }

    async register(id, password) {
        const account = new Account(id, password)
        await this._accountRepository.create(account)
    }

    async authenticate(id, password) {
        let result = false

        try {
            const account = await this._accountRepository.find(id)
            result = account.authenticate(password)
        } catch (e) {
            result = false
        }

        return result
    }

    async delete(id) {
        try {
            const account = await this._accountRepository.find(id)
            await this._accountRepository.delete(account)
        } catch (e) { }
    }

    _notify() {
        return new AccountApplicationData(this._accountRepository)
    }
}
