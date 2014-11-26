var cfg                 = require('../cfg'),
    co                  = require('co'),
    express             = require('express'),
    router              = express.Router(),
    passport            = require('passport'),
    TwitterStrategy     = require('passport-twitter').Strategy,
    userModel           = require('../models/users'),
    wrap                = require('co-express');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: cfg.twitter.consumerKey,
    consumerSecret: cfg.twitter.consumerSecret,
    callbackURL: cfg.twitter.cbUrl
}, co(twAuth)));

function* twAuth(token, refreshToken, profile, done) {
    var twitterData = profile._json;
    var existingUser  = yield userModel.Repo.getBySocialId(twitterData.id, 'twitter');
    done(null, profile);
}

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/cb',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        console.log('scuessss');
        res.redirect('/');
});


module.exports = router;
