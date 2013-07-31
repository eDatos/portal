(function () {
    "use strict";

    App.namespace("App.dataset.Metadata");

    var DECIMALS = 2;

    App.dataset.Metadata = function (options) {
        this.initialize(options);
    };

    App.dataset.Metadata.fetch = function (options) {
        //TODO pass parameters, externalize url, no data parameter
        var result = $.Deferred();
        $.getJSON(App.apiContext + '/datasets/' + options.agency + '/' + options.identifier + '/' + options.version + '?_type=json&fields=-data', function (response) {
            var metadata = new App.dataset.Metadata(response);
            result.resolveWith(null, [metadata]);
        });
        return result.promise();
    };

    App.dataset.Metadata.prototype = {

        initialize : function (options) {
            this.options = options;
            this.selectedLanguages = this.options.selectedLanguages.language;
            this.metadata = this.options.metadata;
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
                    label = labels[this.localesIndex.primary].value;
                }
                if (!label && this.localesIndex.secondary) {
                    label = labels[this.localesIndex.secondary].value;
                }
                if (!label) {
                    label = _.first(labels).value
                }
                return label;
            }
        },

        getIdentifier : function () {
            return this.options.id;
        },

        getLanguages : function () {
            var self = this;
            var languages = this.metadata.languages.resource;
            var id = _.pluck(languages, 'id');
            var label = _.reduce(languages, function (memo, language) {
                memo[language.id] = self.localizeLabel(language.name.text);
                return memo;
            }, {});
            return {id : id, label : label};
        },

        getProvider : function () {
            return this.localizeLabel(this.metadata.maintainer.name.text);
        },

        getTitle : function () {
            return this.localizeLabel(this.options.name.text);
        },

        getDescription : function () {
            return this.localizeLabel(this.options.description.text);
        },

        getLicense : function () {
            //return this.localizeLabel(this.metadata.license.text);
        },

        getLicenseUrl : function () {
        },

        getPublisher : function () {
            //TODO multiple publishers??
            return this.localizeLabel(this.metadata.publisher.resource[0].name.text);
        },

        getUri : function () {
            return this.options.urn;
        },

        getIdsAndLocalizedLabels : function (from) {
            var result = _.map(from.id, function (id) {
                return { id : id, label : this.localizeLabel(from.label[id]) };
            }, this);
            return result;
        },

        _dimensionHasHierarchy : function (dimension) {
            var hierarchyDimensionValue = _.find(dimension.dimensionValues.value, function (dimensionValue) {
                return _.has(dimensionValue, 'parent');
            });
            return !_.isUndefined(hierarchyDimensionValue);
        },

        getDimensions : function () {
            var dimensions = this.metadata.dimensions.dimension;
            var result = _.map(dimensions, function (dimension) {
                return {
                    id : dimension.id,
                    label : this.localizeLabel(dimension.name.text),
                    type : dimension.type,
                    hierarchy : this._dimensionHasHierarchy(dimension)
                };
            }, this);
            return result;
        },

        _sortFlatRepresentations : function (representations) {
            return _.sortBy(representations, function (representation) {
                return representation.order;
            });
        },

        _sortHierarchyRepresentations : function (representations) {
            //group by parents
            var representationsByParent = _.groupBy(representations, function (representation) {
                return representation.parent;
            });

            //sort by levels
            for (var parent in representationsByParent) {
                representationsByParent[parent] = this._sortFlatRepresentations(representationsByParent[parent]);
            }

            // recursive depth tree traversal
            var rootRepresentations = representationsByParent["undefined"]; //TODO this is risky
            var sortedRepresentations = [];
            var depthTreeTraversal = function (node) {
                sortedRepresentations.push(node);
                _.each(representationsByParent[node.id], depthTreeTraversal);
            };
            _.each(rootRepresentations, depthTreeTraversal);
            return sortedRepresentations;
        },

        getRepresentations : function (dimensionId) {
            var self = this;
            var dimensions = this.metadata.dimensions.dimension;
            var dimension = _.findWhere(dimensions, {id : dimensionId});
            var representations = [];
            var defaultDecimals = _.has(this.metadata.relatedDsd, 'showDecimals') ? this.metadata.relatedDsd.showDecimals : DECIMALS;

            if (dimension && dimension.dimensionValues) {
                //TODO normCode
                var isMeasureDimension = dimension.type === "MEASURE_DIMENSION";
                representations = _.map(dimension.dimensionValues.value, function (dimensionValue) {
                    var representation = _.pick(dimensionValue, 'id', 'parent', 'order');
                    representation.label = self.localizeLabel(dimensionValue.name.text);
                    if (isMeasureDimension) {
                        representation.decimals = _.has(dimensionValue, 'showDecimalsPrecision') ? dimensionValue.showDecimalsPrecision : defaultDecimals;
                    }
                    return representation;
                });

                //sort
                var hasHierarchy = this._dimensionHasHierarchy(dimension);
                representations = hasHierarchy? this._sortHierarchyRepresentations(representations) : this._sortFlatRepresentations(representations);
            }
            return representations;
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
            //TODO
        },

        getDates : function () {
            //TODO
        },

        getMeasureDimension : function () {
            var dimensions = this.getDimensionsAndRepresentations();
            return _.findWhere(dimensions, {type : 'MEASURE_DIMENSION'});
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

        getProviderCitation : function () {
            //TODO
        },

        toJSON : function () {
            return {
                citation : this.getProviderCitation(),
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
        },

        getCategoryByNormCode : function (dimensionId, normCode) {
            var representations = this.getRepresentations(dimensionId);
            var selectedCategory = _.find(representations, function (category) {
                return category.normCode === normCode;
            });
            return selectedCategory;
        },

        getTimeDimensions : function () {
            var dimensions = this.getDimensions();
            return  _.where(dimensions, {type : 'TIME_DIMENSION'});
        },

        decimalsForSelection : function (selection) {
            var measureDim = this.getMeasureDimension();
            var selectedDimValueId = selection[measureDim.id];
            if (selectedDimValueId) {
                var selectedDimValue = _.findWhere(measureDim.representations, {id : selectedDimValueId});
                if (selectedDimValue) {
                    return selectedDimValue.decimals;
                }
            }
            return DECIMALS;
        },

        getDimensionsPosition : function () {
            var top = this.metadata.relatedDsd.heading.dimensionId;
            var left = this.metadata.relatedDsd.stub.dimensionId;
            return {top : top, left : left};
        }

    };

}());
