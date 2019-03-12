module.exports = {
    ensureAuthentication: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.flash({ "error_msg": "You are not authorized" });
        return res.redirect('/users/login');
    }
};