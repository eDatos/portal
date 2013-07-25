(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.search.SearchView");

    STAT4YOU.modules.search.SearchView = Backbone.View.extend({

        initialize : function (options) {
            this._showingAll = {};
            this._showingNone = {};
        },

        events : {
            "click .facet-constraints" : "clickFacet",
            "click .facet-constraints-more" : "clickFacetMore",
            "click .facet-constraints-less" : "clickFacetLess",
            "click .facet-constraints-none" : "clickFacetNone"
        },

        renderPage : function () {
            var template = STAT4YOU.templateManager.get("search/search-page");
            this.$el.html(template());
            this.$queryInput = $('.search-form-query', this.$el);
            this.initializeInfiniteScroll($('.infiniteScroll', this.$el));
        },

        renderFacets : function (facets) {
            var template = STAT4YOU.templateManager.get("search/search-facets");
            var context = {
                facets : facets.visibleFacets(),
                selectedFacets : facets.selectedFacetsFromServer()
            };

            $(".facet-container", this.$el).html(template(context));
        },

        renderResults : function (results) {
            this.renderResultsInfo(results);

            $('#search-result-list').empty();
            results.each(function (result) {
                this.addResult(result);
            }, this);
        },

        renderResultsInfo : function (results) {
            var template = STAT4YOU.templateManager.get('search/search-results-info');
            var context = {
                total : results.total || 0
            };
            $('.search-results-info', this.$el).html(template(context));
        },

        addResult : function (result) {
            var template = STAT4YOU.templateManager.get("search/search-result");
            $('#search-result-list').append(template(result.toJSON()));
        },

        clickFacet : function (e) {
            var $target = $(e.currentTarget);

            var eventsParams = {};
            eventsParams.fieldName = $target.data('fieldname');
            eventsParams.code = $target.data('code');

            this.trigger('toggleFacet', eventsParams);

            return false;
        },

        clickFacetMore : function (e) {
            var $target = $(e.currentTarget);
            var fieldName = $target.data('fieldname');
            this.trigger('showMoreFacet', fieldName);
            return false;
        },

        clickFacetLess : function (e) {
            var $target = $(e.currentTarget);
            var fieldName = $target.data('fieldname');
            this.trigger('showLessFacet', fieldName);
            return false;
        },

        clickFacetNone : function (e) {
            var $target = $(e.currentTarget);
            var fieldName = $target.data('fieldname');
            this.trigger('showNoneFacet', fieldName);
            return false;
        }


    });

    _.extend(STAT4YOU.modules.search.SearchView.prototype, STAT4YOU.mixins.InfiniteScrollView);

}());

