require('dotenv').config()

const app = require('./app')
const sequelize = require('./db')
const {validateEnv} = require('./config/env')

const PORT = Number(process.env.PORT) || 8000

const start = async () => {
    try {
        validateEnv()
        await sequelize.authenticate()
        await sequelize.sync()
        return app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
    } catch (error) {
        console.error(`Startup failed: ${error.message}`)
        process.exitCode = 1
        return null
    }
}

if (require.main === module) {
    start()
}

module.exports = {start}
