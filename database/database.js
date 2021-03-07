const { Sequelize } = require('sequelize');

const connection = new Sequelize(
    process.env.DB_NAME, //nome do banco
    process.env.DB_USER, // nome do usuário master
    process.env.DB_PASSWORD, // senha do usuário master
    {
        host: process.env.DB_HOST, // endereço do servidor
        dialect: 'mysql', // tipo do banco
        dialectOptions: {
            dateStrings: true,
            typeCast: true
        },
        timezone: process.env.DB_TIMEZONE,
        logging: false // desabilita o log dos comandos no console
    }
);

module.exports = connection;