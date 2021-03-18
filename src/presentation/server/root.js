import { userApi } from './userApi'
import { authApi } from './authApi'

const express = require('express')

export const root = express()

root.use('/user', userApi)
root.use('/auth', authApi)
