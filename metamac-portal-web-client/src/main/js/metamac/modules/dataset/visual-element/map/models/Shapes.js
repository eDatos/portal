(function () {
    'use strict';

    App.namespace('App.Map.Shapes');

    App.Map.Shapes = function () {
        this.store = new App.Map.ShapesStore();
        this.api = new App.Map.ShapesApi();
    };

    App.Map.Shapes.prototype = {

        _mixDbAndApiShapes : function (dbShapes, apiShapes) {
            var allShapes = [];
            for (var i = 0; i < dbShapes.length; i++) {
                if (_.isUndefined(dbShapes[i])) {
                    allShapes[i] = apiShapes.splice(0, 1)[0];
                } else {
                    allShapes[i] = dbShapes[i];
                }
            }
            return allShapes;
        },

        fetchShapes : function (normCodes, cb) {
            var self = this;
            var validNormCodes = this._filterValidNormCodes(normCodes);
            self._validateCache(validNormCodes, function (err) {
                if (err) return cb(err);

                self.store.get(normCodes, function (err, dbShapes) {
                    if (err) return cb(err);

                    var dbNormCodes = self._normCodesFromShapes(dbShapes);
                    var notDbNormCodes = _.difference(validNormCodes, dbNormCodes);
                    if (notDbNormCodes.length === 0) {
                        return cb(null, dbShapes);
                    }

                    self.api.getShapes(notDbNormCodes, function (err, apiShapes) {
                        if (err) return cb(err);
                        self.store.put(apiShapes, function () {
                            //ignore error saving shapes
                            var shapes = self._mixDbAndApiShapes(dbShapes, apiShapes);
                            cb(null, shapes);
                        });
                    });
                });
            });
        },

        _normCodesFromShapes : function (shapes) {
            return _.chain(shapes).compact().pluck("normCode").value();
        },

        fetchContainer : function (normCodes, cb) {
            var self = this;

            var validNormCodes = this._filterValidNormCodes(normCodes);
            if (validNormCodes.length == 0) {
                return cb();
            }

            self.api.getContainer(normCodes, function (err, containerNormCode) {
                if (err) return cb(err);

                self.fetchShapes([containerNormCode], function (err, shapes) {
                    if (err) return cb(err);

                    var shape = shapes? shapes[0] : undefined;
                    cb(null, shape);
                });
            });
        },

        _filterValidNormCodes : function (normCodes) {
            var notNullNormCodes = _.compact(normCodes);
            return notNullNormCodes;
        },

        _validateCache : function (normCodes, cb) {
            var self = this;
            if (self.lastUpdatedDate) {
                cb();
            } else {
                self.api.getLastUpdatedDate(normCodes, function (err, lastUpdatedDate) {
                    self.store.setLastUpdatedDate(lastUpdatedDate, function (err) {
                        self.lastUpdatedDate = lastUpdatedDate;
                        cb();
                    });
                });
            }
        }
    };

    _.extend(App.Map.Shapes.prototype, Backbone.Events);

}());

