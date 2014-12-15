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


function sendUpdateEntryEmail(entry) {
    return new Promise(function (resolve, reject) {
        var data = _.extend(entry, {
            'baseurl': cfg.baseurl,
            'updateLink': cfg.baseurl + '/entry/' + entry._id + '/edit'
        });

        app.render('emailers/updateEntryEmail', data, function(err, html) {

            if (err) {
                return reject(err);
            }

            var subject = 'One more chance';
            var to = entry.email;
            return sendEmail(html, subject, to)
                .then(function (result) {
                    resolve(result);
                });
        });
    });
}

function sendSanteeEmail(pairing) {
    return new Promise(function (resolve, reject) {
        var data = _.extend({}, pairing);

        data.baseurl = cfg.baseurl;

        // Check for twitter handle
        if (! data.santee.twitter || ! data.santee.twitter.length) {
            data.santee.twitter = '-';
        }

        // Check for address
        if (! data.santee.address || ! data.santee.address.length) {
            data.santee.address = '-';
        }

        app.render('emailers/santeeEmail', data, function(err, html) {

            if (err) {
                console.log(err);
                return reject(err);
            }

            var subject = 'Brace yourself! Details of your Santee are here';
            var to = pairing.santa.email;

            return sendEmail(html, subject, to)
                .then(function (result) {
                    resolve(result);
                });
        });
    });
}


function sendEmail(html, subject, to) {
    return new Promise(function (resolve, reject) {
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
            resolve(result);
        }, function(e) {
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            reject(e);
        });
    });
}

module.exports = {
    'sendConfirmationEmail': sendConfirmationEmail,
    'sendUpdateEntryEmail': sendUpdateEntryEmail,
    'sendSanteeEmail': sendSanteeEmail
};