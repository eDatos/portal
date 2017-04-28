(function () {

    App.namespace('App.dataset.StructuralResourcesApi');

    App.dataset.StructuralResourcesApi = function (options) {
        this.metadata = options.metadata;
    };

    App.dataset.StructuralResourcesApi.prototype = {

        getDimensions : function(callback) {
            var requestParams = {
                url : this.metadata.metadata.relatedDsd.selfLink.href + "?_type=json",
                method : "GET",
            	dataType : 'jsonp',
                jsonp : '_callback'
            };
            
            $.ajax(requestParams).
                done(function (response) {                    
                    var result = _.map(response.dataStructureComponents.dimensions.dimension, function (dimension) {
                        return dimension;
                    });
                    callback(null, result);
                })
                .fail(function () {
                    callback("Error fetching related dsd");
                });
        },

        getDimensionsConcepts : function (dimensions, callback) {
            var conceptItems = _.map(dimensions, function(dimension) {
                return dimension.conceptIdentity;
            });
            this.getConcepts(conceptItems, callback);
        },

        getMeasureConcepts : function(callback) {
            var measureCoverages = this.metadata.metadata.measureCoverages;
            if (measureCoverages) {
                this.getConcepts(measureCoverages.resource, callback);
            }
        },

        getConcepts : function(conceptItems, callback) {
            var results = [];
            var promises = [];
            _.each(conceptItems, function(conceptItem) {

                var requestParams = {
                    url : conceptItem.selfLink.href + "?_type=json",
                    method : "GET",
                    dataType : 'jsonp',
                    jsonp : '_callback'
                };
                
                promises.push(
                    $.ajax(requestParams)
                        .done(function (response) {                    
                            results.push(response);
                        })
                        .fail(function () {
                            callback("Error fetching concept");
                        })
                );
            });
            $.when
                .apply($, promises)
                .done(function() {
                    callback(null, results);
                });
        }
    };

}());