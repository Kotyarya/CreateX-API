const REQUIRED_DATABASE_KEYS = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT']

const parseOrigins = () => (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:4173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

const validateEnv = () => {
    const missing = []
    if (!process.env.DATABASE_URL) {
        missing.push(...REQUIRED_DATABASE_KEYS.filter((key) => !process.env[key]))
    }
    if (!process.env.RANDOM_KEY || process.env.RANDOM_KEY.length < 32) missing.push('RANDOM_KEY (min 32 chars)')

    if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGINS) missing.push('CORS_ORIGINS')

    if (missing.length) throw new Error(`Missing or invalid environment configuration: ${missing.join(', ')}`)
}

const corsOptions = () => {
    const origins = new Set(parseOrigins())
    return {
        origin(origin, callback) {
            if (!origin || origins.has(origin)) return callback(null, true)
            const error = new Error('Origin is not allowed by CORS')
            error.status = 403
            return callback(error)
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 600,
    }
}

module.exports = {validateEnv, corsOptions, parseOrigins}
