const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const router = require('./routes')
const errorHandler = require('./Middleware/ErrorHandlingMiddleware')
const {createRateLimit} = require('./Middleware/rateLimit')
const {corsOptions} = require('./config/env')

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(cors(corsOptions()))
app.use(express.json({limit: '100kb'}))
app.use(express.urlencoded({extended: false, limit: '100kb'}))
app.use(createRateLimit({windowMs: 60_000, max: 120}))
app.use(express.static(path.resolve(__dirname, 'static'), {
    dotfiles: 'deny',
    fallthrough: true,
    maxAge: '1d',
}))
app.use(fileUpload({
    limits: {fileSize: 5 * 1024 * 1024},
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
}))

app.get('/api/health', (_req, res) => res.status(200).json({status: 'ok'}))
app.use('/api', router)
app.use(errorHandler)

module.exports = app
