(function () {
    "use strict";

    App.namespace("App.dataset.data.Attributes");

    App.dataset.data.Attributes = function (options) {
        this.initialize(options);
    };

    App.dataset.data.Attributes.prototype = {

          initialize : function ( options ) {
            this.response = options.response;
            this.metadata = options.metadata;

            this.initializeLocalesIndex();
            this.attributesValues = !_.isUndefined(this.response.data.attributes) ? this.response.data.attributes.attribute : {};
            this.attributesMetadata = !_.isUndefined(this.metadata) ? this.metadata.getAttributes() : {};
            
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

        getPrimaryMeasureAttributesByPos : function (pos) {
            return this.primaryMeasureAttributes ? this.primaryMeasureAttributes[pos] : "";
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


        getDimensionAttributesById : function(dimensionsIds) {
            if (this.hasAttributes()) {
                var dimensionAttributesMetadata =_(this.attributes).where({attachmentLevel: "DIMENSION"});
                var dimensionAttributesIds =  _.pluck(dimensionAttributesMetadata, "id");              
                var dimensionAttributesRawValues = this._filterListByPropertyValues(this.attributes, "id", dimensionAttributesIds);

                var dimensionAttributesRawValuesForHeader = this._filterDimensionAttributesForHeader(dimensionAttributesRawValues, dimensionsIds);

                var dimensionAttributesParsedValues = _(dimensionAttributesRawValuesForHeader).map(this._parseDimensionValue, this);

                return this._combineDimensionAttributesValues(dimensionAttributesParsedValues);             
            }
        },

        _filterDimensionAttributesForHeader : function (attributes, dimensionIds) {            
            return _.map(dimensionIds, function (dimensionId) {             
                return _.filter( attributes, function (item) { 
                    return item.dimensions.total == 1 && dimensionId == item.dimensions.dimension.dimensionId;
                });
            });
        },

        _filterListByPropertyValues : function (list, property, values) {
            return _.filter(list, function (item) { return _.contains(values, item[property]); });
        },

        hasAttributes : function () {
            return !_.isEmpty(this.attributesValues) && !_.isEmpty(this.attributesMetadata);
        },

        _parseDimensionValue : function (attributesArray) {
            var self = this;
            return _.map(attributesArray, function (attribute) {
                var attributeValues = self._splitList(attribute.value);

                var attributeEnumerates = attribute.attributeValues;
                if (attributeEnumerates) { // enumerated resource
                    attributeEnumerates = _(attributeEnumerates.value).indexBy("id");
                    attributeValues = _.map(attributeValues, function (attributeRawValue) {                    
                        return self._getValueForEnumerate(attributeRawValue, attributeEnumerates);
                    });
                }
                
                return attributeValues;
            });
        },


        _parsePrimaryMeasureValue : function (attribute) {
            var attributeValues = this._splitList(attribute.value);

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

        _splitList : function (list) {
            if (list) {
                var splittedList = list.replace("\\ | \\"," \\| ");
                // The scaped backslash will be processed on levels above for efficiency
                return splittedList = splittedList.split(" | ");
            } 
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

            if (!attribute.value.name) {
                attribute.value = { name : attribute.value, href : "" };
            }

            return attribute;
        },

        _combinePrimaryMeasureAttributesValues : function (primaryMeasureAttributesParsedValues) {
            return _.zip.apply(_, primaryMeasureAttributesParsedValues);
        },

        _combineDatasetAttributesValues : function (datasetAttributesParsedValues) {
            return datasetAttributesParsedValues;
        },

        _combineDimensionAttributesValues : function (dimensionAttributesParsedValues) {
            return dimensionAttributesParsedValues;
            //return _.map(dimensionAttributesParsedValues, function (dim) { return _.zip.apply(_, dim); })
        }
    };

}());
