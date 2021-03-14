import { input } from './io'

async function register(session, serviceLocator) {
    console.log("Please input the user name and the password.")
    const rawName = await input('user name> ')
    const password = await input('password> ')

    const userApplication = serviceLocator.load('user')
    await userApplication.register(rawName, password)
}

async function login(session, serviceLocator) {
    console.log("Please input the user name and the password.")
    const rawName = await input('user name> ')
    const password = await input('password> ')

    const userApplication = serviceLocator.load('user')

    try {
        await userApplication.login(session, rawName, password)
        console.log('Successfully logged in.')
    } catch (e) {
        console.log('Failed to log in.')
    }
}

async function logout(session, serviceLocator) {
    const authSessionApplication = serviceLocator.load('auth-session')
    const userApplication = serviceLocator.load('user')

    try {
        await authSessionApplication.load(session)
    } catch (e) {
        console.log('You are not logged in.')
        return
    }

    try {
        await userApplication.logout(session)
        console.log('Successfully logged out.')
    } catch (e) {
        console.log('Failed to log out.')
    }
}

async function remove(session, serviceLocator) {
    console.log("Plese input the user name.")
    const rawName = await input('user name> ')

    const userApplication = serviceLocator.load('user')

    try {
        await userApplication.delete(session, rawName)
        console.log('Successfully removed')
    } catch (e) {
        console.log('You are not authorized.')
    }
}

export const handlers = {
    register,
    login,
    logout,
    remove
}
