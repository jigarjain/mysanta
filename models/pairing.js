/**
 * @module pairing
 */
module.exports = function () {
    var _        = require('lodash'),
        cfg      = require('../cfg'),
        db       = require('mongojs')(cfg.mongo),
        coll     = db.collection('pairing_2014');


    function Pairing() {
        this._id = null;

        this.santa = {};

        this.santee = {};

        this.createTime = null;

        this.updateTime = null;

        this.emailSent = false;
    }


    function Repo() {}
    Repo.add = function (pairing) {
        return new Promise(function (resolve, reject) {
            pairing.createTime = _.now();
            pairing.updateTime = _.now();

            // Proceed with insert
            coll.insert(pairing, function (err, doc) {
                if (err) {
                    reject(err);
                }

                pairing._id = doc._id;
                resolve(pairing._id);
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

                resolve(doc ? _.create(new Pairing(), doc) : null);
            });
        });
    };


    Repo.update = function (pairing) {
        return new Promise(function (resolve, reject) {
            pairing.updateTime = _.now();
            var updated = _.extend({}, pairing);

            coll.update({
                '_id': pairing._id
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
                    return _.create(new Pairing(), doc);
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
        'Pairing' : Pairing,
        'Repo'  : Repo,
    };
};
