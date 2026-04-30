const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    database: {
        url: process.env.MYSQL_URL || process.env.DATABASE_URL,
        host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
        user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
        name: process.env.MYSQLDATABASE || process.env.DB_NAME || 'institucional_db',
        port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
        connectionLimit: 10
    },
    session: {
        secret: process.env.SESSION_SECRET || 'antonio-raymondi-secret-2026',
        name: 'ar.session',
        ttl: 1000 * 60 * 60 * 8
    },
    paths: {
        views: path.join(__dirname, '../views'),
        public: path.join(__dirname, '../../public'),
        uploads: path.join(__dirname, '../../public/uploads')
    }
};

module.exports = config;
