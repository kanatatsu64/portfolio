export class TagNotFoundException {
    constructor() {

    }
}

export class ExpressSession {
    constructor(req) {
        this._session = req.session
    }

    add(tag, value) {
        this._session[tag] = value
    }

    read(tag) {
        if (tag in this._session)
            return this._session[tag]
        else
            throw new TagNotFoundException()
    }

    remove(tag) {
        if (tag in this._session)
            delete this._session[tag]
    }
}
