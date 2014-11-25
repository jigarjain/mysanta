module.exports = function (app) {
    app.use('/', require('./handlers/home'));
    app.use('/auth', require('./handlers/auth'));
};
