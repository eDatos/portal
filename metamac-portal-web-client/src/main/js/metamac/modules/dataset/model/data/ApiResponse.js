(function () {
    "use strict";

    App.namespace("App.dataset.data.ApiResponse");

    App.dataset.data.ApiResponse = function (response, metadata) {
        this.response = response;
        this.attributesValues = !_.isUndefined(response.data.attributes) ? response.data.attributes.attribute : false;
        this.attributesMetadata = !_.isUndefined(metadata) ? metadata.getAttributes() : false;
        this.attributes = this.getPrimaryMeasureAttributesValues();

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
    		
//            "attributes" : {
//            	"total" : 1,
//            	"attribute" [{
//            		"id" : "OBS_CONF",
//            		"value" : " | bar |  |  |  | <br>Br! | <div style='color: red'/>¿Soy rojo?</div> |  |  |  | \escape |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | "
//    	        },
//    	        {
//    	        	"id" : "TITLE",
//    	        	"value": "Supervalue"
//    	        }
//    	        ]
//            }  	
    	// Example with attributes http://estadisticas.arte-consultores.com/statistical-resources-internal/apis/statistical-resources-internal/v1.0/datasets/ISTAC/C00031A_000002/001.006.json
    	getPrimaryMeasureAttributesValues : function () {                 
    		if (this.attributesValues && this.attributesMetadata) {
                var primaryMeasureAttributes =_(this.attributesMetadata).where({attachmentLevel: "PRIMARY_MEASURE"});
                var primaryMeasureAttributesIds =  _.pluck(primaryMeasureAttributes, "id")                
                var primaryMeasureAttributesRawValues = _.filter(this.attributesValues, function (item) { return _.contains(primaryMeasureAttributesIds, item["id"]); });

                var primaryMeasureAttributesParsedValues = _(primaryMeasureAttributesRawValues).map(this._parsePrimaryMeasureValue, this);

                return this._combinePrimaryMeasureAttributesValues(primaryMeasureAttributesParsedValues);                
            }

    	},

        _parsePrimaryMeasureValue : function (attributeValue) {
            var attributeMetadata = this._getAttributeMetadata(attributeValue);
            attributeValue = attributeValue.value.split(" | ");
            if (attributeMetadata.attributesValues) { // enumerated resource
                // TODO Parse enumerate
            }
            return attributeValue;
        },

        _getAttributeMetadata : function (attributeValue) {
            return _.findWhere(this.attributesMetadata, { id : attributeValue["id"]});
        },

        _combinePrimaryMeasureAttributesValues : function (primaryMeasureAttributesParsedValues) {
            return _.zip.apply(_, primaryMeasureAttributesParsedValues);
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

            var pos = this._transformIdToPos.apply(this, [idArray]);
            return this.getDataByPos(pos);
        },

        getDataByPos : function (pos) {
            var self = this,
                ds = self.response,
                posArray = 0;

            posArray = self._transformPosToPosArrays.apply(self, [pos]); // Use "apply" method to pass actual context
            return { "value" : this.observations[posArray] , "attributes"  : this.getAttributesByPos(posArray) };
        },

        getAttributesByPos : function (pos) {
            if (this.attributes) {
                 return this.attributes[pos];
            } else {
                return "";
            }            
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