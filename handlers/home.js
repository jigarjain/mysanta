var express   = require('express'),
    router    = express.Router();

router.get('/', function (req, res, next) {
    try {
        var pageData = {
            'title': 'MySanta - Everyone has their own Santa'
        };

        res.render('home', pageData);
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
