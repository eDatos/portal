(function () {
    'use strict';

    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    var DB = "shapes";
    var STORE = "shapes";

    STAT4YOU.namespace('STAT4YOU.Map.ShapesStore');

    STAT4YOU.Map.ShapesStore = function () {
        var self;
        if (STAT4YOU.Map.ShapesStore.hasIndexedDbSupport()) {
            self = new STAT4YOU.Map.ShapesIndexedDbStore();
        } else {
            self = new STAT4YOU.Map.ShapesHashStore();
        }
        return self;
    };

    STAT4YOU.Map.ShapesStore.hasIndexedDbSupport = function () {
        return !_.isUndefined(indexedDB);
    };

    STAT4YOU.Map.ShapesIndexedDbStore = function () {
    };

    STAT4YOU.Map.ShapesIndexedDbStore.prototype = {

        _dbOpen : function () {
            var result = new $.Deferred();
            if (this._db) {
                result.resolveWith(null, [this._db]);
            } else {
                var version = parseInt(STAT4YOU.configuration["map.version"], 10) || 1;
                var request = indexedDB.open(DB, version);
                var self = this;

                request.onupgradeneeded = function (e) {
                    var db = e.target.result;

                    if (db.objectStoreNames.contains(STORE)) {
                        db.deleteObjectStore(STORE);
                    }

                    db.createObjectStore(STORE, { keyPath : "normCode", autoIncrement : false });
                };

                request.onerror = function () {
                    result.reject();
                };

                request.onsuccess = function (e) {
                    self._db = e.target.result;
                    result.resolveWith(null, [self._db]);
                };
            }
            return result.promise();
        },

        _dbExecute : function (callback) {
            var deferred = new $.Deferred();
            var open = this._dbOpen();
            open.done(function (db) {
                callback(db, deferred);
            });
            open.fail(function () {
                console.log('Error opening db');
            });
            return deferred.promise();
        },

        save : function (shapes) {
            shapes = _.isArray(shapes) ? shapes : [shapes];
            var self = this;
            var promise = this._dbExecute(function (db, deferred) {
                var transaction = db.transaction([STORE], "readwrite");
                transaction.onerror = self._dbError;

                var objectStore = transaction.objectStore(STORE);
                _.each(shapes, function (shape) {
                    objectStore.put(shape);
                });

                transaction.oncomplete = function (e) {
                    deferred.resolve();
                };

                transaction.onerror = function (e) {
                    deferred.reject();
                };
            });
            return promise;
        },

        get : function (normCodes) {
            var self = this;
            var promise = this._dbExecute(function (db, deferred) {
                var transaction = db.transaction([STORE]);
                transaction.onerror = self._dbError;

                var objectStore = transaction.objectStore(STORE);

                var result;
                if (_.isArray(normCodes)) {
                    result = [];
                    _.each(normCodes, function (normCode) {
                        if (normCode) {
                            objectStore.get(normCode).onsuccess = function (e) {
                                result.push(e.target.result);
                            };
                        } else {
                            result.push(undefined);
                        }
                    });
                } else {
                    if (normCodes) {
                        objectStore.get(normCodes).onsuccess = function (e) {
                            result = e.target.result;
                        };
                    }
                }

                transaction.oncomplete = function () {
                    deferred.resolveWith(null, [result]);
                };
                transaction.onerror = function () {
                    var error = "Error";
                    deferred.rejectWith(null, [error]);
                };
            });
            return promise;
        },

        clear : function () {
            var self = this;
            var promise = this._dbExecute(function (db, deferred) {
                var transaction = db.transaction([STORE], "readwrite");
                transaction.onerror = self._dbError;

                var objectStore = transaction.objectStore(STORE);
                var req = objectStore.clear();

                req.onsuccess = function () {
                    deferred.resolve();
                };

                req.onerror = function (e) {
                    var error = "Error";
                    deferred.rejectWith(null, [error]);
                };
            });
            return promise;
        }

    };

    STAT4YOU.Map.ShapesHashStore = function () {
        this.clear();
    };

    STAT4YOU.Map.ShapesHashStore.prototype = {

        _getShape : function (normCode) {
            return this._cache[normCode];
        },

        get : function (normCodes) {
            var shapes;
            if (_.isArray(normCodes)) {
                shapes = _.map(normCodes, this._getShape, this);
            } else {
                shapes = this._getShape(normCodes);
            }
            var result = new $.Deferred();
            result.resolveWith(null, [shapes]);
            return result;
        },

        _saveShape : function (shape) {
            this._cache[shape.normCode] = shape;
        },

        _emptyResolvedPromise : function () {
            var result = new $.Deferred();
            result.resolve();
            return result.promise();
        },

        save : function (shapes) {
            if (_.isArray(shapes)) {
                _.each(shapes, this._saveShape, this);
            } else {
                this._saveShape(shapes);
            }
            return this._emptyResolvedPromise();
        },

        clear : function () {
            this._cache = {};
            return this._emptyResolvedPromise();
        }

    };


}());