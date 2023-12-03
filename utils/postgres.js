const { Pool } = require('pg');
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 2000
})

const run = async () => {
    try {
        console.log("PostgreSQL is connected");
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    run,
    query: async (text, args) => {
        try {
            const resp = await pool.query(text, args)
            return resp;
        } catch (error) {
            console.log(error)
            return {}
        }
    }
}
