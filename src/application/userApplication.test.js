import { InMemorySession } from 'infrastructure/session/inMemory'
import { ServiceLocator } from './serviceLocator'
import { initialize } from 'testInit'

test('user life cycle', async () => {
    const serviceLocator = new ServiceLocator()
    initialize(serviceLocator)
    const userApplication = serviceLocator.load('user')

    const session = new InMemorySession()
    const name = 'name'
    const password = 'pass'
    await userApplication.register(name, password)
    await userApplication.login(session, name, password)
    await userApplication.delete(session, name)
})

test('login with incorrect password', async () => {
    const serviceLocator = new ServiceLocator()
    initialize(serviceLocator)
    const userApplication = serviceLocator.load('user')

    const session = new InMemorySession()
    const name = 'name'
    const password = 'pass'
    await userApplication.register(name, password)

    let failure = false

    try {
        await userApplication.login(session, name, password+'incorrect')
    } catch (e) {
        failure = true
    }

    expect(failure).toBeTruthy()
})

test('logout twice', async () => {
    const serviceLocator = new ServiceLocator()
    initialize(serviceLocator)
    const userApplication = serviceLocator.load('user')

    const session = new InMemorySession()
    const name = 'name'
    const password = 'pass'
    await userApplication.register(name, password)
    await userApplication.login(session, name, password)
    await userApplication.logout(session)

    let failure = false

    try {
        await userApplication.logout(session)
    } catch (e) {
        failure = true
    }

    expect(failure).toBeFalsy()
})
