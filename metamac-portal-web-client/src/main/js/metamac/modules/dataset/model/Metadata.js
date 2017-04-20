(function () {
    "use strict";

    App.namespace("App.dataset.Metadata");

    var DECIMALS = 2;

    App.dataset.Metadata = function (options) {
        this.initialize(options);
    };

    App.dataset.Metadata.prototype = {

        initialize : function (options) {
            this.options = options || {};
        },

        urlIdentifierPart : function () {
           return this.buildUrlIdentifierPart(this.identifier());
        },

        buildUrlIdentifierPart : function(identifier) {
            if (identifier.type === "dataset") {
                return '/datasets/' + identifier.agency + '/' + identifier.identifier + '/' + identifier.version;
            } else if (identifier.type === "query") {
                return '/queries/' + identifier.agency + '/' + identifier.identifier;
            }
        },

        buildQueryString : function(identifier) {
            var version = identifier.type === "dataset" ? [ "version", identifier.version].join('=') : '';
            return [
                ['agencyId', identifier.agency].join('='),
                ['resourceId', identifier.identifier].join('='),
                version,
                ['resourceType', identifier.type].join('=')
            ].join('&');
        },

        idAttributes : ["type", "agency", "identifier", "version"],

        equals : function (metadata) {
            if (_.isUndefined(metadata)) return false;

            var self = this;
            return _.every(this.idAttributes, function (idAttribute) {
                return self.options[idAttribute] === metadata.options[idAttribute];
            });
        },

        identifier : function () {
            return _.pick(this.options, this.idAttributes);
        },

        url : function () {
            return this.getApiUrl().href + '.json?_type=json&fields=-data';
        },

        getApiUrl : function () {
            var apiUrl = App.endpoints["statistical-resources"] + this.urlIdentifierPart();
            return { href : apiUrl, name : apiUrl };
        },

        getApiDocumentationUrl : function() {
            var apiDocumentationUrl = App.endpoints["statistical-resources"];
            return { href : apiDocumentationUrl, name : apiDocumentationUrl };
        },

        fetch : function () {
            var self = this;
            var result = $.Deferred();            
            var req = $.ajax({
                url : this.url(),
                dataType : 'jsonp',
                jsonp : "_callback"
            });
            req.success(function (response) {
                self.parse(response);
                result.resolveWith(null, [this]);
            });
            return result.promise();
        },

        parse : function (response) {
            _.extend(this.options, response);
            this.selectedLanguages = this.options.selectedLanguages.language;
            this.metadata = this.options.metadata;
            this.initializeLocalesIndex();
            this.initializeCache();
        },

        initializeCache : function () {
            var measureDimension = this.getMeasureDimension().id;
            this.decimalsForSelection = _.memoize(this.decimalsForSelection, function (selection) {
                return selection[measureDimension];
            });
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

        getLocalizedLabel : function (label) {
            if (label) {
                return this.localizeLabel(label.text);
            }            
        },

        _htmlDecode : function (value) {
        	  return $('<div/>').html(value).text();
        },

        getIdentifier : function () {
            return this.options.id;
        },

        getLanguages : function () {
            if (this.metadata.languages) {
                var self = this;
                var languages = this.metadata.languages.resource;
                var id = _.pluck(languages, 'id');
                var label = _.reduce(languages, function (memo, language) {
                    memo[language.id] = self.localizeLabel(language.name.text);
                    return memo;
                }, {});
                return {id : id, label : label};
            }
        },


        getIdsAndLocalizedLabels : function (from) {
            var result = _.map(from.id, function (id) {
                return { id : id, label : this.localizeLabel(from.label[id]) };
            }, this);
            return result;
        },

        _dimensionHasHierarchy : function (dimension) {
            return _.any(dimension.dimensionValues.value, function (dimensionValue) {
                return _.has(dimensionValue, 'visualisationParent');
            });
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

        _sortHierarchyRepresentations : function (representations) {
            //group by parents
            var representationsByParent = _.groupBy(representations, function (representation) {
                return representation.parent;
            });


            // recursive depth tree traversal
            var rootRepresentations = representationsByParent["undefined"]; 
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
                var isMeasureDimension = dimension.type === "MEASURE_DIMENSION";
                var isGeographic = dimension.type === "GEOGRAPHIC_DIMENSION";

                var variableId;
                if(isGeographic && dimension.variable) {
                    variableId = dimension.variable.id;
                }

                representations = _.map(dimension.dimensionValues.value, function (dimensionValue) {
                    var representation = _.pick(dimensionValue, 'id', 'open');
                    representation.label = self.localizeLabel(dimensionValue.name.text);

                    if (dimensionValue.visualisationParent) {
                        var parent = _.findWhere(dimension.dimensionValues.value, {urn : dimensionValue.visualisationParent});
                        if (parent) representation.parent = parent.id;
                    }

                    if (variableId && dimensionValue.variableElement) {
                        representation.normCode = variableId + "." + dimensionValue.variableElement.id;
                    }

                    if (isMeasureDimension) {
                        representation.decimals = _.has(dimensionValue, 'showDecimalsPrecision') ? dimensionValue.showDecimalsPrecision : defaultDecimals;
                    }
                    return representation;
                });

                //sort
                var hasHierarchy = this._dimensionHasHierarchy(dimension);
                representations = hasHierarchy ? this._sortHierarchyRepresentations(representations) : representations;
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

        toJSON : function () {
            return {
            	statisticalOperation: this.getStatisticalOperation(),
            	
                title : this.getTitle(),
                subtitle : this.getSubtitle(),
                abstract: this.getAbstract(),
                description : this.getDescription(),
                dates : this.getDates(),
                version : this.getVersion(),
                versionRationale : this.getVersionRationale(),
                replacesVersion : this.getReplacesVersion(),
                isReplacedByVersion : this.getIsReplacedByVersion(),
                publishers : this.getPublishers(),
                contributors: this.getContributors(),
                mediators: this.getMediators(),
                replaces: this.getReplaces(),
                isReplacedBy: this.getIsReplacedBy(),
                rightsHolder: this.getRightsHolder(),
                copyrightDate : this.getCopyrightDate(),
                license : this.getLicense(),
                accessRights: this.getAccessRights(),
                subjectAreas : this.getSubjectAreas(),
                formatExtentObservations: this.getFormatExtentObservations(),
                
                nextVersion: this.getNextVersion(),
                lastUpdate: this.getLastUpdate(),
                dateNextUpdate: this.getDateNextUpdate(),
                updateFrequency: this.getUpdateFrequency(),
                statisticOfficiality: this.getStatisticOfficiality(),
                bibliographicCitation: this.getBibliographicCitation(),
                
                languages : this.getLanguages(),                
                measureDimension : this.getMeasureDimension(),
                dimensions : this.getDimensions(),

                apiUrl : this.getApiUrl(),
                apiDocumentationUrl: this.getApiDocumentationUrl()
            };
        },

        getAttributes : function () {
            if (this.metadata.attributes)
                return this.metadata.attributes.attribute;
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
        },

        getAutoOpen : function () {
            return this.metadata.relatedDsd.autoOpen || false;
        },
        
        getMantainer : function () {
            return this.getLocalizedLabel(this.metadata.maintainer);
        },
        
        getStatisticalOperation : function () {
        	if (this.metadata.statisticalOperation) {
        		return this._getResourceLink(this.metadata.statisticalOperation);
        	}
        },

        getUri : function () {
            return this.options.urn;
        },
        
        getTitle : function () {
            return this.getLocalizedLabel(this.options.name);
        },
        
        getSubtitle : function () {
            return this.getLocalizedLabel(this.metadata.subtitle);
        },

        getAbstract: function() {
            return this.getLocalizedLabel(this.metadata.abstract);
        },

        getDescription : function () {
            return this.getLocalizedLabel(this.options.description);
        },

        getDates : function () {
        	return { 
                validFrom: this.metadata.validFrom, 
                validTo : this.metadata.validTo,
                dateStart : this.metadata.dateStart,
                dateEnd : this.metadata.dateEnd
             };
        },

        getVersion: function() {
            return this.metadata.version;
        },

        getVersionRationale : function() {
            return this.getLocalizedLabel(this.metadata.versionRationale);
        },
        
        getReplacesVersion : function () {
        	if (this.metadata.replacesVersion) {
        		return this.buildVisualizerUrl(this.metadata.replacesVersion);
        	}
        },

        getIsReplacedByVersion : function() {
        	if (this.metadata.isReplacedByVersion) {
        		return this.buildVisualizerUrl(this.metadata.isReplacedByVersion);
        	}
        },

        getReplaces : function () {
        	if (this.metadata.replaces) {
        		return this.buildVisualizerUrl(this.metadata.replaces);
        	}
        },
        
        getIsReplacedBy : function () {
        	if (this.metadata.isReplacedBy) {
        		return this.buildVisualizerUrl(this.metadata.isReplacedBy);
        	}
        },

        buildVisualizerUrl: function(resource) {
            if (resource.urn) {
                var identifier = this.getIdentifierFromUrn(resource.urn);
                return { 
                    href : [
                        location.protocol, 
                        '//', 
                        location.host, 
                        location.pathname,
                        '?', this.buildQueryString(identifier),
                        '#', this.buildUrlIdentifierPart(identifier).substr(1), '/visualization/info'
                    ].join('') ,
                    name : this.localizeLabel(resource.name.text)
                }
            }
        },            

        getIdentifierFromUrn: function(urn) {
            var splittedUrn = urn.split("=");
            var resourcePrefix = splittedUrn[0];
            var statisticalResource = splittedUrn[1];

            var statisticalResourceRegex = /(\w+):([a-z_0-9]+)\(([0-9\.]+)\)/i;
            var statisticalResourceMatchs = statisticalResourceRegex.exec(statisticalResource);                

            return {
                type : _.last(resourcePrefix.split(".")).toLowerCase(),
                agency : statisticalResourceMatchs[1],
                identifier : statisticalResourceMatchs[2],
                version : statisticalResourceMatchs[3]
            } 
        },

        getNextVersion : function() {
            return I18n.t("entity.dataset.nextVersion." + this.metadata.nextVersion);
        },
        
        getPublishers : function () {
        	var self = this;
        	if (this.metadata.publishers) {
        		return _.map(this.metadata.publishers.resource, function (resource) { return self.localizeLabel(resource.name.text); });
        	}
        },
        
        getContributors : function () {
        	var self = this;
        	if (this.metadata.contributors) {
        		return _.map(this.metadata.contributors.resource, function (resource) { return self.localizeLabel(resource.name.text); });
        	}
        },
        
        getMediators : function () {
        	var self = this;
        	if (this.metadata.mediators) {
        		return _.map(this.metadata.mediators.resource, function (resource) { return self.localizeLabel(resource.name.text); });
        	}
        },
        
        getRightsHolder : function () {
        	if (this.metadata.rightsHolder) {
        		return this._getResourceLink(this.metadata.rightsHolder);
        	}
        },
        
        getCopyrightDate : function () {
        	return this.metadata.copyrightDate;
        },
        
        getLicense : function () {
            return this.getLocalizedLabel(this.metadata.license);
        },
        
        getAccessRights : function () {
            return this.getLocalizedLabel(this.metadata.accessRights);
        },
        
        getSubjectAreas : function () {
        	var self = this;
        	if (this.metadata.subjectAreas) {
        		return _.map(this.metadata.subjectAreas.resource, function (resource) { return self.localizeLabel(resource.name.text); });
        	}
        },
        
        getFormatExtentObservations : function () {
        	return this.metadata.formatExtentObservations;
        },
        getLastUpdate : function() {
            return this.metadata.lastUpdate;
        },
        
        getDateNextUpdate : function () {
        	return this.metadata.dateNextUpdate;
        },
        
        getUpdateFrequency : function () {
        	if (this.metadata.updateFrequency) {
        		return this._getResourceLink(this.metadata.updateFrequency);
        	}
        },
        
        getStatisticOfficiality : function () {
            return this.getLocalizedLabel(this.metadata.statisticOfficiality.name);
        },
        
        getBibliographicCitation : function () {
            return this.getLocalizedLabel(this.metadata.bibliographicCitation);
        },
        
        _getResourceLink : function (resource) {
        	if (resource) {
        		return { href : resource.selfLink.href , name : this.localizeLabel(resource.name.text) };
        	}
        }
    };

}());
