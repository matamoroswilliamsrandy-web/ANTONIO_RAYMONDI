const mysql = require('mysql2');
const config = require('./appConfig');

let pool;

if (config.database.url) {
    pool = mysql.createPool(config.database.url);
} else {
    pool = mysql.createPool({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        port: config.database.port,
        waitForConnections: true,
        connectionLimit: config.database.connectionLimit,
        queueLimit: 0
    });
}

const promisePool = pool.promise();

module.exports = promisePool;
