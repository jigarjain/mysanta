module.exports = function (app) {
    app.use('/', require('./handlers/home'));
    app.use('/admin', require('./handlers/admin'));
};
