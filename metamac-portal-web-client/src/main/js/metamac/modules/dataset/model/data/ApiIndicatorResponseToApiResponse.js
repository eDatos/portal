(function () {
    "use strict";

    var Attributes = App.dataset.data.Attributes;

    App.namespace("App.dataset.data.ApiIndicatorResponseToApiResponse");

    App.dataset.data.ApiIndicatorResponseToApiResponse = {

        indicatorResponseToResponse: function (response) {
            var parsedResponse = {
                data: {
                    observations: response.observation,
                    attributes: response.attribute,
                    dimensions: {
                        dimension: this.indicatorDimensionsToDimensions(response.dimension)
                    }
                }
            }
            return parsedResponse;
        },

        indicatorDimensionsToDimensions: function (dimensions) {
            var self = this;
            var parsedDimensions = _.map(dimensions, function (dimension, index) {
                return {
                    dimensionId: index,
                    representations: {
                        representation: self.indicatorRepresentationsToRepresentations(dimension.representation.index),
                        total: dimension.representation.size
                    }
                }
            });
            return parsedDimensions;
        },

        indicatorRepresentationsToRepresentations: function (representations) {
            // Probably inefficient because later we are going to use representationsIndex with this format so we are converting to and back
            return _.map(representations, function (value, index) {
                return {
                    code: index,
                    index: value
                }
            });
        },

        indicatorResponseToObservations: function (response) {
            return response.data.observations;
        }

    };

}());