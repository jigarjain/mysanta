var _ = require('lodash');

var cfg = {
    'baseurl'     : process.env.BASEURL || 'http://localhost:5060',
    'mongo'       : 'mysanta',
    'paths': {
        'static'   : __dirname + '/../static',
        'templates': __dirname + '/../views'
    },
    'web': {
        'port': 5060,
        'session': {
            'secret': 'mysanta2514',
            'mongo' : 'mongodb://127.0.0.1/sess_mysanta'
        },
    },
    'mandrill': {
        'apiKey': 'DvA8gIyPNGPqKEhISN1i7Q',
        'email': 'mysantaweb@gmail.com',
        'name': 'MySanta.in'
    },

};

if (process.env.NODE_ENV) {
    module.exports = _.extend(cfg, require('./' + process.env.NODE_ENV));
} else {
    module.exports = cfg;
}
