(function () {
    'use strict';

    App.namespace('App.Map.Shapes');

    // Collection that allow indexing granularityOrder by normCode
    var GranularityOrderCollection = Backbone.Collection.extend({
        model: Backbone.Model.extend({
            idAttribute: "urn"
        })
    });

    App.Map.Shapes = function () {
        this.store = new App.Map.ShapesStore();
        this.api = new App.Map.ShapesApi();
    };

    App.Map.Shapes.prototype = {

        _chunkNormCodesIntoValidUrlSize: function (normCodes) {
            if (!normCodes) { return []; }

            var chunks = [];
            var i = 0;
            while (i < normCodes.length) {
                var chunk = [];
                var totalQueryLength = 0;
                while (i < normCodes.length && totalQueryLength + normCodes[i].length + 1 < App.Constants.maxUrlQueryLength) {
                    chunk.push(normCodes[i]);
                    totalQueryLength += (normCodes[i].length + 1);
                    i++;
                }

                chunks.push(chunk);
            }
            return chunks;
        },

        fetchShapes: function (normCodes, cb) {
            var self = this;
            var validNormCodes = this._filterValidNormCodes(normCodes);

            self._validateCache(validNormCodes, function (err) {
                if (err) return cb(err);

                self.store.get(normCodes, function (err, dbShapes) {
                    if (err) return cb(err);

                    var dbNormCodes = self._normCodesFromShapes(dbShapes);
                    var notDbNormCodes = _.difference(validNormCodes, dbNormCodes);
                    if (notDbNormCodes.length === 0) {
                        return self._setShapesHierarchy(dbShapes, cb);
                    }

                    var shapeRequests = [];
                    self._chunkNormCodesIntoValidUrlSize(notDbNormCodes)
                        .forEach(function (normCodesChunk, index) {

                            shapeRequests["action_" + index] = _.bind(function (normCodesChunk) {
                                var self = this;
                                self.api.getShapes(normCodesChunk, function (err, apiShapes) {
                                    if (err) return cb(err);
                                    self.store.put(apiShapes, function () { });
                                });
                            }, self, normCodesChunk);

                        });

                    async.parallel(shapeRequests, function (err) {
                        if (err) return cb(err);

                        self.store.get(normCodes, function (err, dbShapes) {
                            if (err) return cb(err);
                            self._setShapesHierarchy(dbShapes, cb);
                        });

                    });
                });
            });
        },

        fetchContainer: function (normCodes, cb) {
            var self = this;

            var validNormCodes = this._filterValidNormCodes(normCodes);
            if (validNormCodes.length == 0) {
                return cb();
            }

            self.api.getContainer(normCodes, function (err, containerNormCode) {
                if (err) return cb(err);

                self.fetchShapes([containerNormCode], function (err, shapes) {
                    if (err) return cb(err);

                    var shape = shapes ? shapes[0] : undefined;
                    cb(null, shape);
                });
            });
        },

        _setShapesHierarchy: function (shapes, cb) {
            this._loadGranularityOrder(function (err, granularityOrderCollection) {
                if (err) return cb(err);

                _.each(shapes, function (shape) {
                    if (shape && shape.granularity) {
                        var granularityOrder = granularityOrderCollection.get(shape.granularity);
                        if (granularityOrder) {
                            shape.hierarchy = granularityOrder.get("order");
                        }
                    }
                });

                cb(null, shapes);
            });
        },

        _loadGranularityOrder: function (cb) {
            var self = this;
            if (!this.granularityOrderCollection) {
                self.api.getGranularityOrder(function (err, granularityOrder) {
                    if (err) return cb(err);
                    self.granularityOrderCollection = new GranularityOrderCollection(granularityOrder);
                    cb(null, self.granularityOrderCollection);
                });
            } else {
                cb(null, this.granularityOrderCollection);
            }
        },

        _normCodesFromShapes: function (shapes) {
            return _.chain(shapes).compact().pluck("normCode").value();
        },

        _filterValidNormCodes: function (normCodes) {
            var notNullNormCodes = _.compact(normCodes);
            return notNullNormCodes;
        },

        _validateCache: function (normCodes, cb) {
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

