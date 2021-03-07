function adminAuth(req, res, next) {
    if (req.session.user !== undefined) {
        next();
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    }
}

module.exports = adminAuth;