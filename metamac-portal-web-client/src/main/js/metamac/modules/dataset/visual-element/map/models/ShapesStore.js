(function () {
    'use strict';

    App.namespace('App.Map.ShapesStore');

    var DB_CONFIG = {
        server : 'metamac',
        version : 1,
        schema : {
            shapes : {
                key : { keyPath : 'normCode', autoIncrement : true }
            },
            config : {
                key : {keyPath : 'key', autoIncrement : false}
            }
        }
    };

    var LAST_UPDATED_DATE = "LAST_UPDATED_DATE";

    App.Map.ShapesStore = function () {
        this.db = new App.DB(DB_CONFIG);
    };

    App.Map.ShapesStore.prototype = {

        _connect : function (cb) {
            var self = this;
            if (this._isConnected) {
                cb();
            } else {
                this.db.connect(function () {
                    self._isConnected = true;
                    cb();
                });
            }
        },

        put : function (shapes, cb) {
            var db = this.db;
            this._connect(function () {
                db.shapes.put(shapes, cb);
            });
        },

        get : function (normCodes, cb) {
            var db = this.db;
            this._connect(function () {
                db.shapes.get(normCodes, cb);
            });
        },

        clear : function (cb) {
            var db = this.db;
            this._connect(function () {
                db.shapes.clear(function () {
                    db.config.clear(cb);
                });
            });
        },

        setLastUpdatedDate : function (lastUpdatedDate, cb) {
            var self = this;
            this._connect(function () {
                var db = self.db;
                db.config.get(LAST_UPDATED_DATE, function (err, dbProperty) {
                    console.log("GET LAST_UPDATED_DATE FROM DATABASE", dbProperty);
                    if (!dbProperty || lastUpdatedDate > dbProperty.value) {
                        var record = {key : LAST_UPDATED_DATE, value : lastUpdatedDate};
                        db.config.put(record, function (err) {
                            self.invalidateCache(cb);
                        });
                    } else {
                        cb();
                    }
                });
            });
        },

        invalidateCache : function (cb) {
            this.db.shapes.clear(cb);
        }

    };

}());