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

        fetchShapes : function (normCodes) {
            var self = this;

            var result = this.store.get(normCodes)
                .then(function (dbShapes) {
                    var result;
                    var dbNormCodes = _.chain(dbShapes).compact().pluck("normCode").value();
                    var notDbNormCodes =_.difference(_.compact(normCodes), dbNormCodes);
                    if (notDbNormCodes.length !== 0) {
                        result = new $.Deferred();
                        self.api.getShapes(notDbNormCodes)
                            .done(function (apiShapes) {
                                self.store.save(apiShapes);
                                result.resolveWith(null, [self._mixDbAndApiShapes(dbShapes, apiShapes)]);
                            }).fail(result.reject);
                    } else {
                        result = dbShapes;
                    }
                    return result;
                });
            return result;
        },

        fetchContainer : function (normCodes) {
            var self = this;

            var validNormCodes = _.compact(normCodes);
            if(validNormCodes.length == 0) {
                return new $.Deferred().resolveWith(null, [[]]).promise();
            }

            var result = this.api.getContainer(normCodes)
                .then(function (response) {
                    var containerNormCode = response.normCode;
                    return self.fetchShapes([containerNormCode]);
                }).then(function (shapes) {
                    if(shapes) {
                        return shapes[0];
                    }
                });
            return result;
        }

    };

    _.extend(App.Map.Shapes.prototype, Backbone.Events);

}());

