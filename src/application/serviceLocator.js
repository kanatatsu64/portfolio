export class NotFoundException {
    constructor() {

    }
}

export class ServiceLocator {
    constructor() {
        this._services = {}
    }

    register(tag, service) {
        this._services[tag] = service
    }

    load(tag) {
        const service = this._services[tag]

        if (!service)
            throw new NotFoundException()
        
        return service
    }
}
