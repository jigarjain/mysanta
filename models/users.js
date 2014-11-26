/**
 * @module users
 */
module.exports = function () {
    var _        = require('lodash'),
        mongojs  = require('mongojs'),
        cfg      = require('../cfg'),
        db       = mongojs(cfg.mongo.db),
        coll     = db.collection('users');


    function User() {
        this._id = null;

        this.name = null;

        this.fname = null;

        this.lname = null;

        this.email = null;

        this.emailVerified = false;

        this.social = {
            'twitter': null,
            'facebook': null
        };

        this.createTime = null;

        this.updateTime = null;
    }


    function Repo() {}
    Repo.add = function (user, socialId, type) {
        return this.getBySocialId(socialId, type)
            .then(function (fetched) {
                return new Promise(function (resolve, reject) {
                    if (fetched) {
                        return reject(new Error(
                            'A user with this social id already exists'
                        ));
                    }

                    user.createTime = _.now();
                    user.updateTime = _.now();

                    // Proceed with insert
                    coll.insert(user, function (err, doc) {
                        if (err) {
                            reject(err);
                        }

                        user._id = doc._id;
                        resolve(user._id);
                    });
                });
            });
    };


    Repo.getById = function (id) {
        return new Promise(function (resolve, reject) {
            coll.findOne({
                '_id': id
            }, function (err, doc) {
                if (err) {
                    reject(err);
                }

                resolve(doc ? _.create(new User(), doc) : null);
            });
        });
    };


    Repo.getByEmail = function (email) {
        return new Promise(function (resolve, reject) {
            coll.findOne({
                'email': email
            }, function (err, doc) {
                if (err) {
                    reject(err, null);
                }

                resolve(doc ? _.create(new User(), doc) : null);
            });
        });
    };

    Repo.getBySocialId = function (socialId, type) {
        return new Promise(function (resolve, reject) {
            var social = {};
            social[type + '.id'] = socialId;
            coll.findOne({

            }, function (err, doc) {
                if (err) {
                    reject(err, null);
                }

                resolve(doc ? _.create(new User(), doc) : null);
            });
        });
    };


    Repo.update = function (user) {
        return new Promise(function (resolve, reject) {
            user.updateTime = _.now();
            var updated = _.extend({}, user);

            coll.update({
                '_id': user._id
            }, {'$set': updated}, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve(true);
            });
        });
    };


    return {
        'User'     : User,
        'Repo'     : Repo,
    };
};
