const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');
const connection = new Sequelize(
    'blog', //nome do banco
    'root', // nome do usuário master
    'root', // senha do usuário master
    {
        host: 'localhost', // endereço do servidor
        dialect: 'mysql', // tipo do banco
        dialectOptions: {
            dateStrings: true,
            typeCast: true
        },
        timezone: '-03:00',
        logging: false // desabilita o log dos comandos no console
    }
);

module.exports = connection;