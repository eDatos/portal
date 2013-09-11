(function () {
    "use strict";

    App.namespace("App.modules.search.SearchMain");

    App.modules.search.SearchMain = function (options) {
        this.initialize(options);
    };

    App.modules.search.SearchMain.prototype = {

        initialize : function (options) {
            var self = this;

            self.queryModel = options.queryModel;
            self.activeProviderModel = options.activeProviderModel;

            self.view = new App.modules.search.SearchView({el : options.el});
            self.resultsCollection = new App.modules.search.SearchResultsCollection();
            self.facetsCollection = new App.modules.search.SearchFacetsCollection();

            // QueryModel <-> View
            self.view.on("toggleFacet", self.queryModel.toggleFacet, self.queryModel);

            // ResultsCollecton <-> QueryModel
            self.queryModel.on("change", self.resultsCollection.setQuery, self.resultsCollection);

            // ResultsCollection <-> FacetsCollection
            self.resultsCollection.on("change:facets", self.facetsCollection.setFacets, self.facetsCollection);

            // ResultsCollection <-> View
            self.resultsCollection.on("reset", self.view.renderResults, self.view);
            self.resultsCollection.on("add", self.view.addResult, self.view);
            self.resultsCollection.on("fetch:start", self.view.fetchStart, self.view);
            self.resultsCollection.on("fetch:end", self.view.fetchEnd, self.view);
            self.view.on("infiniteScroll:loadMore", self.resultsCollection.fetchNextPage, self.resultsCollection);

            // FacetsCollection <-> View
            self.facetsCollection.on("reset", self.view.renderFacets, self.view);
            self.facetsCollection.on("change", self.view.renderFacets, self.view);
            self.view.on("showMoreFacet", self.facetsCollection.showMoreFacet, self.facetsCollection);
            self.view.on("showLessFacet", self.facetsCollection.showLessFacet, self.facetsCollection);
            self.view.on("showNoneFacet", self.facetsCollection.showNoneFacet, self.facetsCollection);

            //FacetsCollecton <-> ActiveProviderModel
            self.facetsCollection.on("activeProvider", self.activeProviderModel.setActiveProvider, self.activeProviderModel);
        },

        render : function () {
            this.view.renderPage();
        }

    };
}());