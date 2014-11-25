var cfg                 = require('../cfg'),
    co                  = require('co'),
    express             = require('express'),
    router              = express.Router(),
    passport            = require('passport'),
    FacebookStrategy    = require('passport-facebook').Strategy,
    wrap                = require('co-express');


passport.use(new FacebookStrategy({
        clientID    : cfg.facebook.appId,
        clientSecret: cfg.facebook.appSecret,
        callbackURL : cfg.baseurl + cfg.facebook.cbUrl,
        enableProof : cfg.facebook.enableProof
    }, co(validateFbUser)));

router.get('/facebook', passport.authenticate('facebook', { scope : 'email'}));

router.get('/facebook/cb', function (req, res, next) {
    passport.authenticate('facebook', function (err, result) {
        if (err) {
            return next(err);
        }

        console.log(result);

    })(req, res, next);
});

function validateFbUser(token, refreshToken, profile) {
    return {
        token: token,
        refreshToken: refreshToken,
        profile: profile
    };
}

module.exports = router;
