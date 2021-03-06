/**
 * @module entries
 */
module.exports = function () {
    var _        = require('lodash'),
        cfg      = require('../cfg'),
        db       = require('mongojs')(cfg.mongo),
        coll     = db.collection('entries');


    function Entry() {
        this._id = null;

        this.name = null;

        this.email = null;

        this.emailVerified = false;

        this.gender = null;

        this.city = null;

        this.address = null;

        this.wishlist = [];

        this.twitter = null;

        this.createTime = null;

        this.updateTime = null;

        this.updated = false;

    }


    function Repo() {}
    Repo.add = function (entry) {
        return new Promise(function (resolve, reject) {
            entry.createTime = _.now();
            entry.updateTime = _.now();

            // Proceed with insert
            coll.insert(entry, function (err, doc) {
                if (err) {
                    reject(err);
                }

                entry._id = doc._id;
                resolve(entry._id);
            });
        });
    };


    Repo.getById = function (id) {
        return new Promise(function (resolve, reject) {
            coll.findOne({
                '_id': db.ObjectId(id)
            }, function (err, doc) {
                if (err) {
                    reject(err);
                }

                resolve(doc ? _.create(new Entry(), doc) : null);
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

                resolve(doc ? _.create(new Entry(), doc) : null);
            });
        });
    };

    Repo.update = function (entry) {
        return new Promise(function (resolve, reject) {
            entry.updateTime = _.now();
            var updated = _.extend({}, entry);

            coll.update({
                '_id': entry._id
            }, {'$set': updated}, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve(true);
            });
        });
    };

    Repo.getAll = function () {
        return new Promise(function (resolve, reject) {
            coll.find({}, function (err, docs) {
                if (err) {
                    reject(err, null);
                }

                var results = _.collect(docs, function (doc) {
                    return _.create(new Entry(), doc);
                });

                resolve(results);
            });
        });
    };

    Repo.remove = function (id) {
        return new Promise(function (resolve, reject) {
            coll.remove({
                '_id': db.ObjectId(id)
            }, {
                'justOne': true
            }, function (err, res) {
                if (err) {
                    reject(err, null);
                }

                resolve(res);
            });
        });
    };


    return {
        'Entry' : Entry,
        'Repo'  : Repo,
    };
};
