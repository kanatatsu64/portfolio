import { ExpressSession } from 'infrastructure/session/express'

import Router from 'express-promise-router'
const express = require('express')

export const authApi = Router()

authApi.use(express.json())
authApi.use(express.urlencoded())

authApi.post('/login', async (req, res) => {
    const session = new ExpressSession(req)
    const serviceLocator = req.serviceLocator
    const { name, password } = req.body

    try {
        const userApplication = serviceLocator.load('user')
        await userApplication.login(session, name, password)
    } catch (e) {
        res.sendStatus(403)
        return
    }

    res.sendStatus(200)
})

authApi.post('/logout', async (req, res) => {
    const session = new ExpressSession(req)
    const serviceLocator = req.serviceLocator

    const userApplication = serviceLocator.load('user')
    await userApplication.logout(session)

    res.sendStatus(200)
})
