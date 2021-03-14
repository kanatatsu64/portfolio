const express = require('express')
const session = require('express-session')

import { ServiceLocator } from 'application/serviceLocator'
import { AccountRepository } from 'repository/sqlite/accountRepository'
import { UserRepository } from 'repository/sqlite/userRepository'
import { AuthSessionRepository } from 'repository/sqlite/authSessionRepository'
import { AccountApplication } from 'application/accountApplication'
import { UserApplication } from 'application/userApplication'
import { AuthSessionApplication } from 'application/authSessionApplication'
import { root } from 'presentation/server/root'

async function initialize(app) {
    const serviceLocator = new ServiceLocator()

    const accountRepository = await AccountRepository.create()
    const userRepository = await UserRepository.create()
    const authSessionRepository = await AuthSessionRepository.create(userRepository)

    serviceLocator.register('account', new AccountApplication(serviceLocator, accountRepository))
    serviceLocator.register('user', new UserApplication(serviceLocator, userRepository))
    serviceLocator.register('auth-session', new AuthSessionApplication(serviceLocator, authSessionRepository))

    app.use((req, res, next) => {
        req.serviceLocator = serviceLocator
        next()
    })

    app.use(session({
        secret: "test secret",
        cookie: {
            maxAge: 5 * 60 * 1000 // 5 min
        }
    }))
}

export async function main() {
    const app = express()
    const port = 3000

    await initialize(app)

    app.use('/', root)

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
}
