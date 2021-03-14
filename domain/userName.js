export class InvalidNameException {
    constructor(name) {
        this.name = name
    }
}

export class UserName {
    constructor(name) {
        if (this.validate(name))
            this._value = name
        else
            throw new InvalidNameException(name)
    }

    valueOf() {
        return this._value
    }

    validate(name) {
        return name != ''
    }
}
