const Sequelize = require('sequelize');
const conn = require('../database/database');
const Category = require('../categories/Category');

const Article = conn.define('ARTICLES', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//uma categoria tem muitos artigos
Category.hasMany(Article, { foreignKey: 'categoryId', as: 'category' });

//um artigo pertence a uma categoria
Article.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = Article;