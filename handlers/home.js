var entryModel  = require('../models/entries')(),
    express     = require('express'),
    router      = express.Router(),
    wrap        = require('co-express');

router.get('/', wrap(function* (req, res, next) {
    try {
        var allEntries = yield entryModel.Repo.getAll();

        var pageData = {
            'title': 'MySanta - Meet your santa here',
            'totalEntries': 134 + allEntries.length
        };

        res.render('home', pageData);
    }  catch (e) {
        next(e);
    }
}));

router.get('/faqs', function (req, res) {
    var pageData = {
        'title': 'MySanta - FAQs'
    };

    res.render('faqs', pageData);
});

module.exports = router;
