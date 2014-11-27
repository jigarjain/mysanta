var bodyParser = require('body-parser'),
    cfg         = require('./cfg'),
    compress    = require('compression'),
    express     = require('express'),
    exphbs      = require('express-handlebars'),
    app         = express();


// Use gzip compression
app.use(compress());


// serve static files
app.use('/static', express.static(cfg.paths.static));


// Parse POST data
app.use(bodyParser.urlencoded({
    extended: true
}));


// Storing session in locals
app.use(function(req, res, next){
    res.locals.google = cfg.google;
    res.locals.version = require('./package.json').version;
    next();
});


// Set views dir
app.set('views', cfg.paths.templates);


// Create Express handlebar instance
var hbs = exphbs.create({
    layoutsDir:  cfg.paths.templates,
    defaultLayout: 'master',
    partialsDir: [
        cfg.paths.templates + '/partials/'
    ]
    // helpers: require('./helpers/view').helpers,
});


// Initialize engine
app.engine('handlebars', hbs.engine);


// Set engine
app.set('view engine', 'handlebars');


// common routes
require('./routes')(app);


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
            'title': 'Bad data'
        });
    }

    res.status(500);
    res.render('errors/500', {
        'title': 'Something went wrong'
    });
});

// register 404
app.use(function (req, res) {
    res.status(404);
    res.render('errors/404', {
        'title': 'Page not found'
    });
});


app.listen(cfg.web.port);
console.log('Listening on port %s', cfg.web.port);
