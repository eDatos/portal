(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.search.SearchFacetsCollection");

    STAT4YOU.modules.search.SearchFacetsCollection = Backbone.Collection.extend({

        initialize : function () {
            this._showingAll = {};
            this._showingNone = {};
            this._facetLimit = 10;
        },

        facetsWithLabels : function () {
            var facets = this.toJSON();
            _.each(facets, function (facet) {
                facet.label = I18n.t('idxmanager.facet.' + facet.field);
            });

            facets = this._sortTemporalContraints(facets);

            return facets;
        },

        _sortTemporalContraints : function (facets) {
            _.map(facets, function (facet) {
                if (facet.field === "FF_TEMPORAL_YEARS") {
                    facet.constraints = _.sortBy(facet.constraints, function (constraint) {
                        return constraint.code;
                    }).reverse();
                }
                return facet;
            });

            return facets;
        },

        selectedFacetsFromServer : function () {
            var selectedFacets = this.facetsWithLabels();

            _.each(selectedFacets, function (facet) {
                facet.constraints = _.filter(facet.constraints, function (constraint) {
                    return constraint.selected;
                });
            });

            return selectedFacets;
        },

        visibleFacets : function () {
            var self = this;
            var facets = this.facetsWithLabels();

            _.each(facets, function (facet) {
                facet.limited = facet.constraints.length > self._facetLimit;
                if (facet.limited) {
                    //not show all by default, but some
                    facet.showingAll = self._showingAll[facet.fieldName];
                    facet.showingNone = self._showingNone[facet.fieldName];

                    if (!facet.showingAll) {
                        var limit = facet.showingNone ? 0 : self._facetLimit;
                        facet.constraints = _.first(facet.constraints, limit);
                    }
                } else {
                    facet.showingAll = true;
                    facet.showingNone = false;
                }
            });
            return facets;
        },

        showMoreFacet : function (fieldName) {
            if (!this._showingAll[fieldName]) {
                this._showingAll[fieldName] = true;
                this._showingNone[fieldName] = false;
                this.trigger('change', this);
            }
        },

        showLessFacet : function (fieldName) {
            if (this._showingAll[fieldName]) {
                this._showingAll[fieldName] = false;
                this.trigger('change', this);
            } else {
                this._showingNone[fieldName] = false;
                this.trigger('change', this);
            }
        },

        showNoneFacet : function (fieldName) {
            if (!this._showingNone[fieldName]) {
                this._showingAll[fieldName] = false;
                this._showingNone[fieldName] = true;
                this.trigger('change', this);
            }
        },

        setFacets : function (facets) {
            this.reset(facets);
            this.triggerActiveProvider();
        },

        triggerActiveProvider : function () {
            var selectedFacets = this.selectedFacetsFromServer();
            var selectedProviders = _.find(selectedFacets, function (facet) {
                return facet.field === "FF_DS_PROV_ACRONYM";
            });
            if (selectedProviders) {
                if (selectedProviders.constraints.length === 1) {
                    this.trigger('activeProvider', selectedProviders.constraints[0].code);
                } else {
                    this.trigger('activeProvider', undefined);
                }
            } else {
                this.trigger('activeProvider', undefined);
            }
        }
    });

}());