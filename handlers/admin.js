var entryModel  = require('../models/entries')(),
    express     = require('express'),
    router      = express.Router(),
    wrap        = require('co-express');

router.get('/chimney', wrap(function* (req, res) {

    var allEntries = yield entryModel.Repo.getAll();

    var pageData = {
        'title': 'Chimney - Santa access only',
        'allEntries': allEntries
    };

    res.render('admin/chimney', pageData);
}));



module.exports = router;
