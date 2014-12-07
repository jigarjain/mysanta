var entryModel  = require('../models/entries')(),
    express     = require('express'),
    router      = express.Router(),
    wrap        = require('co-express'),
    _           = require('lodash');

router.get('/chimney', wrap(function* (req, res) {

    var allEntries = yield entryModel.Repo.getAll();

    var pageData = {
        'title': 'Chimney - Santa access only',
        'allEntries': allEntries
    };

    res.render('admin/chimney', pageData);
}));


router.get('/chimney/entry/:id/edit', wrap(function* (req, res, next) {
    try {
        var entry = yield entryModel.Repo.getById(req.params.id);

        if (! entry) {
            return next();
        }


        var pageData = {
            'title': 'Admin Edit',
            'formData': entry,
        };

        res.render('admin/edit', pageData);
    } catch (e) {
        next(e);
    }
}));

router.post('/chimney/entry/:id/edit', wrap(function* (req, res, next) {
    try {

        var entry = yield entryModel.Repo.getById(req.params.id);
        var input = req.body;

        if (! entry) {
            return next();
        }

        entry = _.extend(entry, input);

        yield entryModel.Repo.update(entry);
        res.redirect('/admin/chimney');
    } catch (e) {
        next(e);
    }
}));


router.post('/chimney/entry/:id/delete', wrap(function* (req, res, next) {
    try {

        yield entryModel.Repo.remove(req.params.id);
        res.redirect('/admin/chimney');
    } catch (e) {
        next(e);
    }
}));


module.exports = router;
