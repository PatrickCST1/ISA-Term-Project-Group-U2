// services/db/db.js
const mysql = require("mysql2/promise");

const restrictedPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_RESTRICTED_USER,
    password: process.env.DB_RESTRICTED_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const adminPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    password: process.env.DB_ADMIN_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function restrictedQuery(table, sql, params = []) {
    const fullSql = sql.replace("{{table}}", table);
    const [rows] = await restrictedPool.query(fullSql, params);
    return rows;
}

async function adminQuery(table, sql, params = []) {
    const fullSql = sql.replace("{{table}}", table);
    const [rows] = await adminPool.query(fullSql, params);
    return rows;
}

module.exports = { restrictedQuery, adminQuery };