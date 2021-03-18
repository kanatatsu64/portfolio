function hash(password) {
    return 'hashed:' + password
}

export class AccountData {
    constructor(id, hash) {
        this.id = id
        this.hash = hash
    }
}

export class Account {
    constructor(id, password) {
        this.id = id
        this._hash = hash(password)
    }

    static _restore(id, hash) {
        const account = new Account(null, '')
        account.id = id
        account._hash = hash

        return account
    }

    authenticate(password) {
        return hash(password) == this._hash
    }

    _notify() {
        return new AccountData(
            this.id,
            this._hash
        )
    }
}
