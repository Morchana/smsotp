require('dotenv').config()
import { configureApp } from './app'
const port = process.env.PORT || 9000
const server = configureApp().listen(port)
server.keepAliveTimeout = 61 * 1000
console.log(`Listening on port ${port}`)
