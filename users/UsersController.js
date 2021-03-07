const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users', adminAuth, (req,res) => {
    User.findAll({
        raw: true
    }).then((users) => res.render('admin/users/index', { users }))
    .catch((error) => console.error(error));
});

router.get('/admin/users/create', adminAuth, (req,res) => {
    res.render('admin/users/create');
});

router.post('/admin/users/create', adminAuth, (req, res) => {
    const email = req.body.email;

    User.findOne({
        raw: true,
        where: {
            email: email
        }
    }).then((user) => {
        if (user !== null) {
            res.redirect('/admin/users/create');
        } else {
            const password = req.body.password;
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
        
            User.create({
                email: email,
                password: hash
            }).then(() => res.redirect('/'))
            .catch((error) => console.error(error));
        }
    });
});

router.get('/login', (req, res) => {
    res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email !== undefined && email.length > 0 && password !== undefined && password.length > 0) {
        User.findOne({
            raw: true,
            where: {
                email: email
            }
        }).then((user) => {
            if (user !== null) {
                const correctPass = bcrypt.compareSync(password, user.password);

                if (correctPass === true) {
                    req.session.user = {
                        id: user.id,
                        email: user.email
                    }

                    if (req.session.returnTo !== undefined) {
                        res.redirect(req.session.returnTo);
                    } else {
                        res.redirect('/');
                    }
                } else {
                    res.redirect('/login');
                }
            } else {
                res.redirect('/login');
            }
        }).catch((error) => console.error(error));
    } else {
        res.redirect('/login');
    }
});

router.get('/logout', (req,res) => {
    req.session.user = undefined;
    res.redirect('/');
});

module.exports = router;