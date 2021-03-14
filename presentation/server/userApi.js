import { ExpressSession } from 'infrastructure/session/express'

import Router from 'express-promise-router'
const express = require('express')

export const userApi = Router()

userApi.use(express.json())
userApi.use(express.urlencoded())

userApi.post('/register', async (req, res) => {
    const serviceLocator = req.serviceLocator
    const { name, password } = req.body

    const userApplication = serviceLocator.load('user')
    await userApplication.register(name, password)

    res.sendStatus(200)
})

userApi.post('/delete', async (req, res) => {
    const session = new ExpressSession(req)
    const serviceLocator = req.serviceLocator
    const { name } = req.body

    const userApplication = serviceLocator.load('user')
    try {
        await userApplication.delete(session, name)
    } catch (e) {
        res.sendStatus(403)
        return
    }

    res.sendStatus(200)
})
