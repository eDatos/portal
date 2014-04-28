(function () {
    "use strict";

    var Attributes = App.dataset.data.Attributes;

    App.namespace("App.dataset.data.ApiResponse");

    App.dataset.data.ApiResponse = function (response, metadata) {
        this.response = response;
        this.attributes = new Attributes({ response : response, metadata : metadata});

        // Mult Factor
        this._mult = null;

        // This functions are created dinamically
        // Receives as parameters the id to transform (["LL", "M"])
        // Returns the position ([1, 3])
        this._transformIdToPos = null;

        // This functions are created dinamically
        // Receives as parameters the pos to transform (["1", "1"])
        // Returns the array position (5)
        this._transformPosToPosArrays = null;
        this.observations = this.response.data.observations.split(" | ");

        this._createMult();
        this._setUpTransformIdToPos();
        this._setUpTransformPosToPosArray();
    };

    App.dataset.data.ApiResponse.prototype = {

        getDatasetAttributes : function() {
            return this.attributes.getDatasetAttributes();
        },


        getDimensionAttributesById : function(dimensionsIds) {
            return this.attributes.getDimensionAttributesById(dimensionsIds);
        },

        getDataById : function (ids) {
            var ds = this.response;
            var idArray;
            // Id Object
            if (_.isObject(ids)) {
                idArray = _.map(this.dimensionIds, function(dimension){
                    return ids[dimension];
                });
            } else {
                idArray = ids;
            }

            var dimensionPositions = this._transformIdToPos.apply(this, [idArray]);
            return this.getDataByPos(dimensionPositions);
        },    

        getDataByPos : function (dimensionPositions) {
            var self = this,
                ds = self.response,
                observationPosition = 0;

            observationPosition = self._transformPosToPosArrays.apply(self, [dimensionPositions]); // Use "apply" method to pass actual context
            return { "value" : this.observations[observationPosition] , "attributes"  : this.attributes.getCellAttributes(observationPosition, dimensionPositions) };
        },

        /*** OTHER METHODS ***/
        _createMult : function () {
            var m = [];
            var mult = 1;
            var n = _.map(this.response.data.dimensions.dimension, function (dimension) {
                return dimension.representations.total;
            });
            var dims = n.length;

            for (var i = 0; i < dims; i++) {
                if (i > 0) {
                    mult *= n[(dims - i)];
                } else {
                    mult *= 1;
                }
                m.push(mult);
            }
            this._mult = m;
        },

        _setUpTransformIdToPos : function () {
            var body = "";
            var ds = this.response;
            this.dimensionIds = _.map(this.response.data.dimensions.dimension, function (dimension) {
                return dimension.dimensionId;
            });
            this.representationIndex = _.reduce(this.response.data.dimensions.dimension, function (memo, dimension) {
                var representationIndex = _.reduce(dimension.representations.representation, function (memo, representation) {
                    memo[representation.code] = representation.index;
                    return memo;
                }, {});
                memo[dimension.dimensionId] = {
                    representationIndex : representationIndex
                };
                return memo;
            }, {});

            body += "var ds = this.response, pos = [];\n";
            for (var i = 0; i < this.dimensionIds.length; i++) {
                body += "pos.push(this.representationIndex[this.dimensionIds[" + i + "]].representationIndex[id[" + i + "]]);\n";
            }
            body += "return pos";

            // Creating the function
            this._transformIdToPos = new Function("id", body);
        },

        _setUpTransformPosToPosArray : function () {
            var self = this;
            var body = "";
            var ds = this.response;
            var mult = this._mult;
            var dims = this.dimensionIds.length;

            body += "var ds = this.response, res = 0;\n";
            body += "res = ";
            for (var i = 0; i < dims; i++) {
                body += mult[i] + "*pos[" + (dims - i - 1) + "]";
                if (i < dims - 1) {
                    body += " + ";
                }
            }
            body += ";\n";
            body += "return res;";

            // Creating the function
            self._transformPosToPosArrays = new Function("pos", body);
        }

    };

}());