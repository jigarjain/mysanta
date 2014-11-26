var cfg      = require('../cfg'),
    mandrill = require('mandrill-api/mandrill'),
    mandrillClient = new mandrill.Mandrill(cfg.mandrill.apiKey);

function sendConfirmationEmail(entry) {
    var html = 'Sample text';
    var subject = 'this is subject';
    var to = entry.email;
    sendEmail(html, subject, to);
}

function sendEmail(html, subject, to) {
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
}

module.exports = {
    'sendConfirmationEmail': sendConfirmationEmail
};