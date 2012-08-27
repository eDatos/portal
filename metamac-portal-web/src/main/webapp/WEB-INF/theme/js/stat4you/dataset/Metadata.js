(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.dataset.Metadata");

    STAT4YOU.dataset.Metadata = function (options) {
        this.initialize(options);
    };

    STAT4YOU.dataset.Metadata.prototype = {

        initialize : function (options) {
            this.selectedLanguages = options.selectedLanguages;
            this.metadata = options.metadata;
            this.citation = options.citation;
            this.initializeLocalesIndex();
        },

        initializeLocalesIndex : function () {
            var selectedLanguages = this.selectedLanguages;
            this.localesIndex = {
                primary : selectedLanguages.indexOf(I18n.locale),
                secondary : selectedLanguages.indexOf(I18n.defaultLocale)
            };

            if (this.localesIndex.primary === -1) {
                this.localesIndex.primary = undefined;
            }

            if (this.localesIndex.secondary === -1) {
                this.localesIndex.secondary = undefined;
            }
        },

        localizeLabel : function (labels) {
            if (labels) {
                var label;
                if (this.localesIndex.primary) {
                    label = labels[this.localesIndex.primary];
                }

                if (!label && this.localesIndex.secondary) {
                    label = labels[this.localesIndex.secondary];
                }

                if (!label) {
                    label = _.first(_.compact(labels));
                }
                return label;
            }
        },

        getIdentifier : function () {
            return this.metadata.identifier;
        },

        getLanguages : function () {
            return this.getIdsAndLocalizedLabels(this.metadata.language);
        },

        getProvider : function () {
            return this.metadata.creatorAcronym;
        },

        getTitle : function () {
            return this.localizeLabel(this.metadata.title);
        },

        getDescription : function () {
            return this.localizeLabel(this.metadata.description);
        },

        getLicense : function () {
            return this.localizeLabel(this.metadata.license);
        },

        getLicenseUrl : function () {
            return this.metadata.licenseUrl;
        },

        getPublisher : function () {
            return this.metadata.publisher;
        },

        getIdsAndLocalizedLabels : function (from) {
            var self = this;
            var result = [];
            _.each(from.id, function (id) {
                result.push({
                    id : id,
                    label : self.localizeLabel(from.label[id])
                });
            });
            return result;
        },

        getDimensions : function () {
            return this.getIdsAndLocalizedLabels(this.metadata.dimension);
        },

        getRepresentations : function (dimensionId) {
            var representations = this.metadata.dimension.representation;
            var self = this;
            var result = [];
            _.each(representations.id[dimensionId], function (id) {
                result.push({
                    id : id,
                    label : self.localizeLabel(representations.label[dimensionId][id])
                });
            });

            return result;
        },

        getDimensionsAndRepresentations : function () {
            var self = this;
            var dimensions = this.getDimensions();
            _.each(dimensions, function (dimension) {
                dimension.representations = self.getRepresentations(dimension.id);
            });
            return dimensions;
        },

        getCategories : function () {
            return this.getIdsAndLocalizedLabels(this.metadata.category);
        },

        getDates : function () {
            return {
                release : this.metadata.releaseDate,
                modification : this.metadata.modificationDate,
                providerRelease : this.metadata.providerReleaseDate,
                providerModification : this.metadata.providerModificationDate,
                frecuency : this.metadata.frecuency
            };
        },

        getMeasureDimension : function () {
            if (this.metadata.measureDimension) {
                var result = {};
                result.id = this.metadata.measureDimension;
                if (result.id) {
                    result.label = this.localizeLabel(this.metadata.dimension.label[result.id]);
                    result.representation = this.getRepresentations(result.id);
                }
                return result;
            }
        },

        getTotalObservations : function () {
            var dimensions = this.getDimensionsAndRepresentations();
            var size = _.chain(dimensions)
                .map(function (dimension) {
                    return dimension.representations.length;
                })
                .reduce(function (mem, value) {
                    return mem * value;
                }, 1)
                .value();
            return size;
        },

        toJSON : function () {
            return {
                citation : this.citation,
                provider : this.getProvider(),
                title : this.getTitle(),
                description : this.getDescription(),
                categories : this.getCategories(),
                languages : this.getLanguages(),
                license : this.getLicense(),
                licenseUrl : this.getLicenseUrl(),
                dates : this.getDates(),
                measureDimension : this.getMeasureDimension(),
                dimensions : this.getDimensions()
            };
        }

    };

}());
