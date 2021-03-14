import { InMemorySession } from 'infrastructure/session/inMemory'
import { ServiceLocator } from 'application/serviceLocator'
import { AccountRepository } from 'repository/inMemory/accountRepository'
import { UserRepository } from 'repository/inMemory/userRepository'
import { AuthSessionRepository } from 'repository/inMemory/authSessionRepository'
import { AccountApplication } from 'application/accountApplication'
import { UserApplication } from 'application/userApplication'
import { AuthSessionApplication } from 'application/authSessionApplication'
import { repl } from 'presentation/cli/repl'

function initialize(serviceLocator) {
    const accountRepository = new AccountRepository()
    const userRepository = new UserRepository()
    const authSessionRepository = new AuthSessionRepository()

    serviceLocator.register('account', new AccountApplication(serviceLocator, accountRepository))
    serviceLocator.register('user', new UserApplication(serviceLocator, userRepository))
    serviceLocator.register('auth-session', new AuthSessionApplication(serviceLocator, authSessionRepository))
}

export function main() {
    const session = new InMemorySession()
    const serviceLocator = new ServiceLocator()

    initialize(serviceLocator)

    repl(session, serviceLocator)
}
