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
        },

        // ********* Metadata requests ************

        indicatorMetadataRepresentationsToMetadataRepresentations: function (dimension) {
            var self = this;
            return _.map(dimension.representation, function (representation) {
                var parsedRepresentation = representation;
                parsedRepresentation.id = representation.code;
                parsedRepresentation.name = {
                    text: self.indicatorInternationalTextToInternationalText(representation.title)
                };
                self.setGranularityType(parsedRepresentation, representation, dimension.code)
                return parsedRepresentation;
            });
        },

        setGranularityType: function (parsedRepresentation, representation, dimensionType) {
            switch (dimensionType) {
                case "TIME":
                    parsedRepresentation.temporalGranularity = representation.granularityCode;
                    break;
                case "GEOGRAPHICAL":
                    parsedRepresentation.geographicGranularity = {
                        id: representation.granularityCode
                    };
                    break;
                case "MEASURE":
                    break;
                default:
                    throw Error("Unsupported granularity type" + dimensionType)
            }
        },

        indicatorInternationalTextToInternationalText: function (text) {
            return _.map(text, function (value, key) {
                return {
                    value: value,
                    lang: key
                }
            });
        },

        indicatorMetadataDimensionsToMetadataDimensions: function (dimensions) {
            var self = this;
            var parsedDimensions = _.map(dimensions, function (dimension, index) {
                return {
                    id: index,
                    name: self._buildLocalizedSpanishText(I18n.t("indicator.dimension.name." + index)),
                    type: self.indicatorDimensionTypeToDimensionType(dimension.code),
                    dimensionValues: {
                        value: self.indicatorMetadataRepresentationsToMetadataRepresentations(dimension),
                        total: dimension.representation.length
                    }
                }
            });
            return parsedDimensions;
        },

        indicatorDimensionTypeToDimensionType: function (dimensionType) {
            switch (dimensionType) {
                case "GEOGRAPHICAL":
                    return "GEOGRAPHIC_DIMENSION";
                case "MEASURE":
                    return "MEASURE_DIMENSION";
                case "TIME":
                    return "TIME_DIMENSION";
                default:
                    console.warn("Unsupported type for indicator dimension");
                    return dimensionType;
            }
        },

        indicatorMetadataResponseToMetadataResponse: function (response) {
            response.selectedLanguages = { // FIXME revisar si esta property es necesaria
                language: [],
                total: 0
            };
            response.metadata = {
                name: this._buildLocalizedSpanishText(response.title.es),
                description: this._buildLocalizedSpanishText(response.conceptDescription.es),
                version: response.version,
                relatedDsd: {
                    heading: {
                        dimensionId: ["TIME", "MEASURE"] // Always this ones
                    },
                    stub: {
                        dimensionId: ["GEOGRAPHICAL"] // Always this ones
                    },
                    selfLink: {}
                },
                dimensions: {
                    dimension: this.indicatorMetadataDimensionsToMetadataDimensions(response.dimension),
                    total: 3 // Always 3 for indicators
                }
                // We can´t simply translate them, we need a well formed resource
                // ,subjectAreas: {
                //     resource: [{
                //         name: self._buildLocalizedSpanishText(I18n.t("indicator.subjectAreas.name." + response.subjectCode, { defaultValue: response.subjectCode }))
                //     }]
                // }
            }
            return response;
        },

        _buildLocalizedSpanishText: function (value) {
            return {
                text: [{
                    value: value,
                    lang: "es"
                }]
            };
        }

    };

}());