import { AccountRepository } from 'repository/inMemory/accountRepository'
import { UserRepository } from 'repository/inMemory/userRepository'
import { AuthSessionRepository } from 'repository/inMemory/authSessionRepository'
import { AccountApplication } from 'application/accountApplication'
import { UserApplication } from 'application/userApplication'
import { AuthSessionApplication } from 'application/authSessionApplication'

export function initialize(serviceLocator) {
    const accountRepository = new AccountRepository()
    const userRepository = new UserRepository()
    const authSessionRepository = new AuthSessionRepository()

    serviceLocator.register('account', new AccountApplication(serviceLocator, accountRepository))
    serviceLocator.register('user', new UserApplication(serviceLocator, userRepository))
    serviceLocator.register('auth-session', new AuthSessionApplication(serviceLocator, authSessionRepository))
}
