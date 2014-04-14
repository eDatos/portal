(function () {
    "use strict";

    App.namespace("App.dataset.data.ApiResponse");

    App.dataset.data.ApiResponse = function (response, metadata) {
        this.response = response;

        this.initializeLocalesIndex();
        this.initializeAttributes(response, metadata);


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

        initializeAttributes : function ( response, metadata ) {
            this.attributesValues = !_.isUndefined(response.data.attributes) ? response.data.attributes.attribute : {};
            this.attributesMetadata = !_.isUndefined(metadata) ? metadata.getAttributes() : {};
            
            var self = this;                       
            this.attributes = _(this.attributesValues).map(function(attributeValue) {
                return _.extend({},_.findWhere(self.attributesMetadata, { id : attributeValue["id"]}), attributeValue);
            });

            this.primaryMeasureAttributes = this.getPrimaryMeasureAttributesValues();
            this.datasetAttributes = this.getDatasetAttributes();
        },
    		
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
    		if (this.hasAttributes()) {
                var primaryMeasureAttributes =_(this.attributes).where({attachmentLevel: "PRIMARY_MEASURE"});
                var primaryMeasureAttributesIds =  _.pluck(primaryMeasureAttributes, "id")                
                var primaryMeasureAttributesRawValues = this._filterListByPropertyValues(this.attributes, "id", primaryMeasureAttributesIds);
                var primaryMeasureAttributesParsedValues = _(primaryMeasureAttributesRawValues).map(this._parsePrimaryMeasureValue, this);

                return this._combinePrimaryMeasureAttributesValues(primaryMeasureAttributesParsedValues);                
            }

    	},


        getDatasetAttributes : function () {
            if (this.hasAttributes()) {
                var datasetAttributesMetadata =_(this.attributes).where({attachmentLevel: "DATASET"});
                var datasetAttributesIds =  _.pluck(datasetAttributesMetadata, "id")                
                var datasetAttributesRawValues = this._filterListByPropertyValues(this.attributes, "id", datasetAttributesIds);
                var datasetAttributesParsedValues = _(datasetAttributesRawValues).map(this._parseDatasetValue, this);

                return this._combineDatasetAttributesValues(datasetAttributesParsedValues);             
            }
        },

        _filterListByPropertyValues : function (list, property, values) {
            return _.filter(list, function (item) { return _.contains(values, item[property]); });
        },

        hasAttributes : function () {
            return !_.isEmpty(this.attributesValues) && !_.isEmpty(this.attributesMetadata);
        },

        _parsePrimaryMeasureValue : function (attribute) {
            var attributeValues = attribute.value.split(" | ");
            var attributeEnumerates = attribute.attributeValues;
            if (attributeEnumerates) { // enumerated resource
                attributeEnumerates = _(attributeEnumerates.value).indexBy("id");
                var self = this;
                attributeValues = _.map(attributeValues, function (attributeRawValue) {                    
                    return self._getValueForEnumerate(attributeRawValue, attributeEnumerates);
                });
            }
            return attributeValues;
        },

        _getValueForEnumerate : function (attributeRawValue, attributeEnumerates) {
            if (attributeRawValue != "") {
                if (!_.isUndefined(attributeEnumerates[attributeRawValue])) {
                    return this._getResourceLink(attributeEnumerates[attributeRawValue]);
                } else {
                    return attributeRawValue;
                }
            } else {
                return "";
            }
        },

        initializeLocalesIndex : function () {
            this.localesIndex = {                   
                primary : I18n.locale,
                secondary : I18n.defaultLocale
            };
        },

        localizeLabel : function (labels) {
            if (labels) {
                var self = this;
                var label;
                if (this.localesIndex.primary) {
                    label = _.find(labels, function(label){ 
                        return label.lang == self.localesIndex.primary;
                    });
                    if (label) label = label.value;
                }
                if (!label && this.localesIndex.secondary) {
                    label = _.find(labels, function(label){ 
                        return label.lang == self.localesIndex.secondary;
                    });
                    if (label) label = label.value;
                }
                if (!label) {
                    label = _.first(labels).value
                }

                return label;
            }
        },

        _getResourceLink : function (resource) {
            if (resource) {
                return { href : resource.selfLink.href , name : this.localizeLabel(resource.name.text) };
            }
        },             

        _parseDatasetValue : function (attribute) {
            if (attribute.name.text) {
                attribute.name = this.localizeLabel(attribute.name.text);
            }
                        
            var attributeEnumerates = attribute.attributeValues;
            if (attributeEnumerates) { // enumerated resource
                attributeEnumerates = _(attributeEnumerates.value).indexBy("id");
                attribute.value = this._getValueForEnumerate(attribute.value, attributeEnumerates);                
            }            

            return attribute;
        },

        _getAttributeMetadata : function (attributeValue) {
            return _.findWhere(this.attributesMetadata, { id : attributeValue["id"]});
        },

        _combinePrimaryMeasureAttributesValues : function (primaryMeasureAttributesParsedValues) {
            return _.zip.apply(_, primaryMeasureAttributesParsedValues);
        },

        _combineDatasetAttributesValues : function (datasetAttributesParsedValues) {
            return datasetAttributesParsedValues;
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
                 return this.primaryMeasureAttributes ? this.primaryMeasureAttributes[pos] : "";
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