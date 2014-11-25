var express   = require('express'),
    router    = express.Router(),
    wrap      = require('co-express');

router.get('/', wrap(function* (req, res, next) {
    try {
        var pageData = {
            'title': 'home'
        };

        res.render('home', pageData);
    } catch (e) {
        return next(e);
    }
}));

module.exports = router;
