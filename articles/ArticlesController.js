const express = require('express');
const { default: slugify } = require('slugify');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({ 
        include: [{
            model: Category,
            attributes: [ 'id', 'title' ],
            raw: true,
            required: true,
            as: 'category'
        }], //join em categories
        order: [
            [ 'id', 'DESC' ]
        ]
    }).then((articles) => res.render('admin/articles/index', { articles })).catch((error) => console.error(error));
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll({
        raw: true
    }).then((categories) => res.render('admin/articles/new', { categories })).catch((error) => console.error(error));
});

router.post('/admin/articles/save', adminAuth, (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const categoryId = parseInt(req.body.category);

    if (title.length > 0 && body.length > 0) {
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: categoryId
        }).then(() => res.redirect('/admin/articles')).catch((error) => console.error(error));
    } else {
        res.redirect('/admin/articles');
    }
});

router.post('/admin/articles/delete/:id', adminAuth, (req, res) => {
    const id = parseInt(req.params.id);

    if (id !== undefined  && !isNaN(id) && id > 0) {
        Article.destroy({
            where: {
                id: id
            }
        }).then(() => res.redirect('/admin/articles'))
            .catch((error) => console.error(error));
    } else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id;
    
    if (isNaN(id) || id === 0) {
        res.redirect('/admin/articles');
        return;
    }

    Article.findByPk(id, {
        raw: true
    }).then((article) => {
        Category.findAll({
            raw: true
        }
        ).then((categories) => {
            res.render('admin/articles/edit', { article, categories });
        }).catch((error) => {
            console.error(error);
            res.redirect('/admin/articles');
        });
    }).catch((error) => {
        console.error(error);
        res.redirect('/admin/articles');
    });
});

router.post('/admin/articles/update/:id', adminAuth, (req, res) => {
    const id = req.params.id;

    if (isNaN(id) || id === 0) {
        res.redirect('/admin/articles');
        return;
    }

    const title = req.body.title;
    const categoryId = req.body.category;
    const body = req.body.body;

    Article.update({
        title: title,
        slug: slugify(title),
        categoryId: categoryId,
        body: body
    }, {
        where: {
            id: id
        }
    }).then(() => res.redirect('/admin/articles'))
    .catch((error) => {
        console.error(error);
        res.redirect('/admin/articles')
    });
});

router.get('/articles/get/:num', adminAuth, (req, res) => {
    const page = parseInt(req.params.num);
    let offset = (isNaN(page) || page == 0 || page == 1) ? 0 : (page - 1) * 4;

    Article.findAndCountAll({
        raw: true,
        limit: 4,
        offset: offset, //artigo após X
        order: [
            [ 'id', 'DESC' ]
        ]
    }).then((articles) => {
        let next = false;
        if (offset + 4 >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        let result = {
            page,
            articles,
            next
        };

        Category.findAll({
            raw: true
        }).then((categories) => {
            res.render('admin/articles/page', {
                result,
                categories
            });
        }).catch((error) => console.error(error));
    }).catch((error) => console.error(error));
});

module.exports = router;