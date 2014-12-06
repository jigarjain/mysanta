var cfg            = require('../cfg'),
    express        = require('express'),
    exphbs         = require('express-handlebars'),
    mandrill       = require('mandrill-api/mandrill'),
    mandrillClient = new mandrill.Mandrill(cfg.mandrill.apiKey),
    _              = require('lodash'),
    app            = express();

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

function sendConfirmationEmail(entry) {
    try {
        var data = _.extend(entry, {
            'baseurl': cfg.baseurl,
            'confirmLink': cfg.baseurl + '/confirmEmail/' + entry._id
        });
        app.render('emailers/confirmationEmail', data, function(err, html) {
            var subject = 'Confirm your email address';
            var to = entry.email;
            sendEmail(html, subject, to);
        });
    } catch (e) {
        console.log('New Error caught in mail:' + e);
    }
}

function sendEmail(html, subject, to) {
    try {
        var message = {
            'html': html,
            'subject': subject,
            'from_email': cfg.mandrill.email,
            'from_name': cfg.mandrill.name,
            'to': [
                {
                    'email': to,
                    'type': 'to'
                }
            ]
        };


        mandrillClient.messages.send({'message': message}, function(result) {
            console.log(result);
        }, function(e) {
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        });
    } catch (e) {
        console.log('New Error caught in mail 2nd block:' + e);
    }
}

module.exports = {
    'sendConfirmationEmail': sendConfirmationEmail
};