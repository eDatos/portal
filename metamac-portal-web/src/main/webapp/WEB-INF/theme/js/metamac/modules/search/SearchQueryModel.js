(function () {
    "use strict";

    App.namespace("App.modules.search.SearchQueryModel");

    App.modules.search.SearchQueryModel = Backbone.Model.extend({

        defaults : {
            query : undefined,
            facets : {}
        },

        isFacetSelected : function (fieldName, code) {
            var facets = this.get('facets');
            var isSelected = false;
            var codes = facets[fieldName];
            if (codes) {
                isSelected = _.indexOf(codes, code) !== -1;
            }
            return isSelected;
        },

        selectFacet : function (fieldName, code) {
            if (!this.isFacetSelected(fieldName, code)) {
                var facets = this.get('facets');
                var codes = facets[fieldName];
                if (codes) {
                    facets[fieldName].push(code);
                } else {
                    facets[fieldName] = [code];
                }
                this.trigger('change', this);
                this.trigger('change:facets', this);
            }
        },

        deselectFacet : function (fieldName, code) {
            if (this.isFacetSelected(fieldName, code)) {
                var facets = this.get('facets');
                var codes = facets[fieldName];
                var codeIndex = _.indexOf(codes, code);
                codes.splice(codeIndex, 1);

                if (codes.length === 0) {
                    delete facets[fieldName];
                }

                this.trigger('change', this);
                this.trigger('change:facets', this);
            }
        },

        toggleFacet : function (options) {
            options || (options = {});
            var fieldName = options.fieldName;
            var code = options.code + ''; //int codes to string

            if (this.isFacetSelected(fieldName, code)) {
                this.deselectFacet(fieldName, code);
            } else {
                this.selectFacet(fieldName, code);
            }
        },

        toURLParameters : function () {
            var parameters = _.extend({}, this.get('facets'));
            var query = this.get('query');
            parameters.query = query || '';
            return parameters;
        }
    });

}());

