require('dotenv').config()
const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    dialect : "mysql",
    host : process.env.DB_HOST,
    define : {
        charset : "utf8",
        collate : "utf8_general_ci",
        timestamps : true
    }
})

module.exports = db;