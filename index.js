var express     = require('express'),
    exphbs      = require('express-handlebars'),
    cfg         = require('./cfg'),
    session     = require('express-session'),
    flash       = require('connect-flash'),
    MongoStore  = require('connect-mongo')(session),
    passport    = require('passport'),
    compress    = require('compression'),
    app         = express();


// Use gzip compression
app.use(compress());

// serve static files
app.use('/static', express.static(cfg.paths.static));


// Use session
app.use(session({
    secret           : cfg.web.session.secret,
    resave           : true,
    saveUninitialized: true,
    store            : new MongoStore({
        url: cfg.web.session.mongo
    })
}));

// Use session flash vars
app.use(flash());

// Session user mods
app.use(function (req, res, next) {
    Object.defineProperties(req, {
        'user': {
            'get': function () {
                if (req.session) {
                    return req.session._user;
                }

                return null;
            },

            'set': function (user) {
                req.session._user = user;
            }
        }
    });

    next();
});

// Storing session in locals
app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.version = require('./package.json').version;
    next();
});

// Use passport
app.use(passport.initialize());
app.use(passport.session());

// Set views dir
app.set('views', cfg.paths.templates);

// Create Express handlebar instance
var hbs = exphbs.create({
    layoutsDir:  cfg.paths.templates,
    defaultLayout: 'master',
    // helpers: require('./helpers/view').helpers,
    // partialsDir: [
    //     cfg.paths.templates + '/partials/'
    // ]
});

// Initialize engine
app.engine('handlebars', hbs.engine);

// Set engine
app.set('view engine', 'handlebars');

// common routes
require('./routes')(app);

// login and logout
//app.use(require('./handlers/login')(cfg));

// register 500
app.use(function (err, req, res, next) {
    if (!err) {
        return next();
    }

    console.log('Error Stack:', err.stack);

    if (err.status === 401) {
        return res.redirect('/login?r=' + req.originalUrl);
    }

    if (err.status === 403) {
        res.status(403);
        return res.render('errors/403', {
            'title': 'This page is forbidden'
        });
    }

    if (err.status === 400) {
        res.status(400);
        return res.render('errors/400', {
            'title': 'Bad data - Grallo'
        });
    }

    res.status(500);
    res.render('errors/500', {
        'title': 'Something went wrong - Grallo'
    });
});

// register 404
app.use(function (req, res) {
    res.status(404);
    res.render('errors/404', {
        'title': 'Page not found - Grallo'
    });
});


app.listen(cfg.web.port);
console.log('Listening on port %s', cfg.web.port);
