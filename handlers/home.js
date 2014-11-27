var cfg         = require('../cfg'),
    emailer     = require('../emailers/emailer'),
    entryModel  = require('../models/entries')(),
    express     = require('express'),
    _           = require('lodash'),
    validator   = require('validator'),
    router      = express.Router(),
    wrap        = require('co-express');

router.get('/', wrap(function* (req, res) {

    var allEntries = yield entryModel.Repo.getAll();

    var pageData = {
        'title': 'MySanta - Meet your santa here',
        'totalEntries': 134 + allEntries.length
    };

    res.render('home', pageData);
}));

router.post('/submit', wrap(function* (req, res, next) {
    try {
        var input = req.body;
        var output = {
            'code': null,
            'error': null,
            'url': null
        };

        var entry = new entryModel.Entry();

        // validate name
        if (! validator.isLength(input.name, 1)) {
            output.code = 0;
            output.error = 'Enter your correct name';
            res.jsonp(output);
            return;
        } else {
            entry.name = input.name;
        }

        // validate email
        if (! validator.isEmail(input.email)) {
            output.code = 0;
            output.error = 'Enter a proper email address';
            res.jsonp(output);
            return;
        } else {
            entry.email = input.email;
        }

        // validate city
        if (! validator.isLength(input.city, 3)) {
            output.code = 0;
            output.error = 'Enter a correct city name';
            res.jsonp(output);
            return;
        } else {
            entry.city = input.city;
        }

        // validate wishlist
        if (! (input.wishlist && input.wishlist.length)) {
            output.code = 0;
            output.error = 'Mention atleast one wishlist';
            res.jsonp(output);
            return;
        } else {
            entry.wishlist = input.wishlist;
        }

        // save input
        var existingEntry = yield entryModel.Repo.getByEmail(entry.email);

        // If entry exists with verified email then error
        // If entry exists but email not verified then update
        // Else add the entry
        if (existingEntry && existingEntry.emailVerified) {
            output.code = 0;
            output.error = 'Email already exist. Try using other email address';
            res.jsonp(output);
            return;
        } else {
            if (existingEntry && ! existingEntry.emailVerified) {
                delete entry.createTime;
                entry._id = existingEntry._id;
                var updatedEntry = _.extend(existingEntry, entry);
                yield entryModel.Repo.update(updatedEntry);
            } else {
                yield entryModel.Repo.add(entry);
            }
        }

        // send them email
        emailer.sendConfirmationEmail(entry);

        // redirect to confirm email page
        output.code = 1;
        output.url = cfg.baseurl + '/confirmEmail?email=' + entry.email ;
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


router.get('/confirmEmail', function (req, res) {
    var email = req.query.email;
    var pageData = {
        'title': 'Confirm your email',
        'email': email
    };

    res.render('confirmEmail', pageData);
});


router.get('/confirmEmail/:id', wrap(function* (req, res, next) {
    try {
        var entryId = req.params.id;

        var entry = yield entryModel.Repo.getById(entryId);

        console.log(entry);
        if (! entry) {
            next();
            return;
        }

        entry.emailVerified = true;
        yield entryModel.Repo.update(entry);

        res.render('emailConfirmed', {});
    } catch (e) {
        next(e);
    }

}));

module.exports = router;
