var co             = require('co'),
    emailer        = require('../emailers/emailer'),
    pairingModel   = require('../models/pairing')(),
    _              = require('lodash');

co(function*  sendSanteeEmail() {
    // Fetch all pairings
    var allEntries = yield pairingModel.Repo.getAll();
    console.log('Pairings fetched: ' + allEntries.length);

    allEntries = _.filter(allEntries, function (pairing) {
        return ! pairing.emailSent;
    });

    console.log('Pairings to send: ' + allEntries.length);

    // Send update email for every entry;
    for(var i = 0; i < allEntries.length; i++) {

        yield emailer.sendSanteeEmail(allEntries[i]);
        allEntries[i].emailSent = true;
        yield pairingModel.Repo.update(allEntries[i]);
        console.log();
        console.log();
    }

    console.log('All sent');
}).catch();