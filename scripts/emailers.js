var co             = require('co'),
    emailer        = require('../emailers/emailer'),
    entryModel     = require('../models/entries')(),
    _              = require('lodash');

co(function*  sendUpdateEntriesEmail() {
    // Fetch all entries
    var allEntries = yield entryModel.Repo.getAll();
    console.log('entries fetched: ' + allEntries.length);

    allEntries = _.filter(allEntries, function (entry) {
        return ! entry.updated;
    });

    // Send update email for every entry;
    for(var i = 0; i <= allEntries.length; i++) {
        yield emailer.sendUpdateEntryEmail(allEntries[i]);
        console.log();
        console.log();
    }
}).catch();