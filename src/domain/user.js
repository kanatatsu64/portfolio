import { Id } from './id'

export { UserName } from './userName'

export class UserData {
    constructor(id, name) {
        this.id = id
        this.name = name
    }
}

export class User {
    constructor(name) {
        this.id = new Id()
        this.name = name
    }

    static _restore(id, name) {
        const user = new User(null)
        user.id = id
        user.name = name

        return user
    }

    changeName(name) {
        this.name = name
    }

    valueOf() {
        return this.id.valueOf()
    }

    _notify() {
        return new UserData(this.id, this.name)
    }
}
