const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new');
});

router.post('/categories/save', adminAuth, (req, res) => {
    const title = req.body.title;

    if (title !== undefined && title.length > 0) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(res.redirect('/admin/categories'))
            .catch((error) => console.error(error));
    } else {
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll({
        raw: true
    }).then((categories) =>
        res.render('admin/categories/index', { categories })
    ).catch((error) => console.error(error));
});

router.post('/admin/categories/delete/:id', adminAuth, (req, res) => {
    const id = parseInt(req.params.id);

    if (id !== undefined  && !isNaN(id) && id > 0) {
        Category.destroy({
            where: {
                id: id
            }
        }).then(() => res.redirect('/admin/categories'))
            .catch((error) => console.error(error));
    } else {
        res.redirect('/admin/categories');
    }
});

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id === 0) {
        res.redirect('/admin/categories');
        return;
    }

    Category.findByPk(id, {
        raw: true
    }).then((category) => {
            if (category !== null) {
                res.render('admin/categories/edit', { category });
            } else {
                res.redirect('/admin/categories');
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/admin/categories');
        });
});

router.post('/admin/categories/update/:id', adminAuth, (req, res) => {
    const id = parseInt(req.params.id);
    const title = req.body.title;

    if (!isNaN(id) && id > 0 && title !== undefined && title.length > 0) {
        Category.update({ title: title, slug: slugify(title) }, {
            where: {
                id: id
            }
        }).then(() => res.redirect('/admin/categories'))
            .catch((error) => console.error(error));
    }
});

module.exports = router;