require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');
const Article = require('./articles/Article');
const Category = require('./categories/Category');

app.set('view engine', 'ejs'); //engine de html
app.use(express.urlencoded({ extended: false })); //parse em forms
app.use(express.json()); //parse em json
app.use(express.static('public')); //pasta dos arquivos estáticos
app.use(session({ //sessões
    secret: "asdjiiO!joj&yHDA980_t-a8dhasui@dA&sd7aduisha", //string aleatória pra aumentar a segurança
    cookie: {
        maxAge: 300000 //tempo que irá durar a sessão (em ms)
    },
    saveUninitialized: true,
    resave: true
}));
app.use('/', categoriesController); //adicionar rotas do controller das categorias
app.use('/', articlesController); //adicionar rotas do controller dos artigos
app.use('/', usersController); //adicionar rotas do controller dos usuários
app.get('/favicon.ico', (req, res) => res.status(204));

//teste de conexão ao banco
/*conn
    .authenticate()
    .then(() => console.log('Conectado ao banco.'))
    .catch((error) => console.error('Erro ao conectar ao banco. Erro: ' + error));*/

//rotas 
app.get('/', (req, res) => {
    Article.findAll({
        raw: true,
        order: [
            [ 'id', 'DESC' ]
        ],
        limit: 4
    }).then((articles) => {
        Category.findAll({
            raw: true
        }).then((categories) => res.render('index', { articles, categories }))
        .catch((error) => console.error(error));
    }).catch((error) => console.error(error));
});

app.get('/:slug', (req, res) => {
    const slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        },
        raw: true
    }).then((article) => {
        if (article !== undefined && article !== null) {
            Category.findAll({
                raw: true
            }).then((categories) => res.render('article', { article, categories }))
            .catch((error) => console.error(error));
        } else {
            res.redirect('/');
        }
    }).catch((error) => {
        console.error(error);
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    const slug = req.params.slug;
    
    if (!slug) { 
        res.redirect('/'); 
    }

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article,
            required: true,
            as: 'category'
        }]
    }).then((category) => {
        if (category !== undefined) {
            Category.findAll().then((categories) => res.render('index', { articles: category.category, categories: categories }))
            .catch((error) => console.error(error));
        } else {
            res.redirect('/');
        }
    }).catch((error) => {
        console.error(error);
        res.redirect('/');
    });
});

app.listen(8080, () => console.log('App rodando...'));