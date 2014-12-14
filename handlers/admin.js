var entryModel    = require('../models/entries')(),
    express       = require('express'),
    pairingModel  = require('../models/pairing')(),
    validator     = require('validator'),
    router        = express.Router(),
    wrap          = require('co-express'),
    _             = require('lodash');

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


router.get('/chimney/pairing', wrap (function* (req, res, next) {
    try {
        var pagedata ={
            'title': 'Pairings',
            'total': 0,
            'cities': {
                'Mumbai': [],
                'Bangalore': [],
                'Delhi': [],
                'Kolkata': [],
                'Others': []
            }
        };

        var allEntries = yield entryModel.Repo.getAll();

        // Filter only those whose email is verified
        allEntries = _.filter(allEntries, function (e) {
            return e.emailVerified;
        });

        pagedata.total = allEntries.length;


        // Group based on cities
        var cities = ['Mumbai', 'Bangalore', 'Delhi', 'Kolkata'];

        _.each(allEntries, function (entry) {
            var exist = false;
            for (var i = 0; i < cities.length; i++) {
                if (entry.city.toLowerCase().trim() === cities[i].toLowerCase()) {
                    pagedata.cities[cities[i]].push(entry);
                    exist = true;
                    break;
                }
            }

            if (! exist) {
                pagedata.cities.Others.push(entry);
            }
        });

        res.render('admin/pairing', pagedata);
    } catch (e) {
        next(e);
    }
}));

router.post('/chimney/pairing/add', wrap (function* (req, res, next) {
    try {
        var input = req.body;
        var output = {
            'code': null,
            'error': null,
            'url': null
        };
        var pairing = new pairingModel.Pairing();

        // validate santa email
        if (validator.isEmail(input.santaEmail)) {
            pairing.santa = yield entryModel.Repo.getByEmail(input.santaEmail);

            if (! pairing.santa) {
                output.code = 0;
                output.error = 'Santa email does not exist';
                res.jsonp(output);
                return;
            }
        } else {
            output.code = 0;
            output.error = 'Santa email is incorrect';
            res.jsonp(output);
            return;
        }

        // validate santee email
        if (validator.isEmail(input.santeeEmail)) {
            pairing.santee = yield entryModel.Repo.getByEmail(input.santeeEmail);

            if (! pairing.santee) {
                output.code = 0;
                output.error = 'Santee email does not exist';
                res.jsonp(output);
                return;
            }
        } else {
            output.code = 0;
            output.error = 'Santee email is incorrect';
            res.jsonp(output);
            return;
        }

        // save the pairing
        yield pairingModel.Repo.add(pairing);

        output.code = 1;
        res.jsonp(output);
    } catch (e) {
        var output = {
            'code': 0,
            'error': 'Something went wrong. Try again',
        };
        res.jsonp(output);
        next(e);
    }
}));

module.exports = router;
