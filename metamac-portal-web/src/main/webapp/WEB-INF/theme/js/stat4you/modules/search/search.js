/**
 *
 */

var FetchEventsForCollection = {
    fetch : function(options) {
        var self = this;
        options = options || {};

        options.data = options.data || {};
        var success = options.success;
        options.success = function(model, resp){
            self.trigger('fetch:end', self);
            if(success){
                success(model, resp);
            }
        };
        var error = options.error;
        options.error = function(originalModel, resp, options){
            self.trigger('fetch:end', self);
            if(error){
                error(originalModel, resp, options);
            }
        };
        self.trigger('fetch:start', self);
        Backbone.Collection.prototype.fetch.call(this, options);
    }
};

var InfiniteScrollView = {

    template : STAT4YOU.templateManager.get("search/search-infinitescroll"),

    initializeInfiniteScroll : function($container){
        var self = this;
        self.$infiniteScrollContainer = $container;
        self.hasMore = false;
        self.$infiniteScrollContainer.bind('click', function(){
            self.loadMore();
        });

        _.bindAll(this, "scroll", "isNearBottom");
        $(window).smartscroll(this.scroll);

        self.isDuringAjax = false;
    },

    render : function(state){
        this.$infiniteScrollContainer.html(this.template(state));
    },

    fetchStart : function(){
        this.isDuringAjax = true;
        this.render({loading : true});
    },

    fetchEnd : function(collection){
        this.isDuringAjax = false;
        this.hasMore = collection.hasMorePages();

        if(this.hasMore){
            this.render({loadMore : true});
        }else{
            this.render({noMore : true});
        }
    },

    loadMore : function(){
        if(this.hasMore){
            this.trigger('infiniteScroll:loadMore');
        }
    },

    scroll : function(){
        if(this.isDuringAjax){
            return;
        }

        if(this.isNearBottom()){
            this.loadMore();
        }
    },

    isNearBottom: function() {
        var $window = $(window);
        var windowScroll = $window.scrollTop();
        var windowHeight = $window.height();

        var button = this.$infiniteScrollContainer;
        var buttonPosition = button.offset().top + button.height() - 1 ;

        var pixelsFromWindowBottomToBottom = 0 + buttonPosition  - windowScroll - windowHeight;

        return pixelsFromWindowBottomToBottom < 0;
    }
};

STAT4YOU.namespace("STAT4YOU.modules.Search");

STAT4YOU.modules.Search.QueryModel = Backbone.Model.extend({

    defaults : {
        query : undefined,
        facets : {}
    },

    isFacetSelected : function(fieldName, code){
        var facets = this.get('facets');
        var isSelected = false;
        var codes = facets[fieldName];
        if(codes){
            isSelected = _.indexOf(codes, code) !== -1;
        }
        return isSelected;
    },

    selectFacet : function(fieldName, code){
        if(!this.isFacetSelected(fieldName, code)){
            var facets = this.get('facets');
            var codes = facets[fieldName];
            if(codes){
                facets[fieldName].push(code);
            }else{
                facets[fieldName] = [code];
            }
            this.trigger('change', this);
            this.trigger('change:facets', this);
        }
    },

    deselectFacet : function(fieldName, code){
        if(this.isFacetSelected(fieldName, code)){
            var facets = this.get('facets');
            var codes = facets[fieldName];
            var codeIndex = _.indexOf(codes, code);
            codes.splice(codeIndex, 1);

            if(codes.length === 0){
                delete facets[fieldName];
            }

            this.trigger('change', this);
            this.trigger('change:facets', this);
        }
    },

    toggleFacet : function(options){
        options || (options = {});
        var fieldName = options.fieldName;
        var code = options.code + ''; //int codes to string

        if(this.isFacetSelected(fieldName, code)){
            this.deselectFacet(fieldName, code);
        }else{
            this.selectFacet(fieldName, code);
        }
    },

    toURLParameters : function(){
        var parameters = _.extend({}, this.get('facets'));
        var query = this.get('query');
        parameters.q = query || '';
        return parameters;
    }
});

STAT4YOU.modules.Search.FacetsCollection = Backbone.Collection.extend({

    initialize : function(){
        this._showingAll = {};
        this._showingNone = {};
        this._facetLimit = 10;
    },

    facetsWithLabels : function(){
        var facets = this.toJSON();
        _.each(facets, function(facet){
            facet.label = I18n.t('idxmanager.facet.' + facet.field);
        });
        return facets;
    },

    selectedFacetsFromServer : function(){
        var selectedFacets = this.facetsWithLabels();

        _.each(selectedFacets, function(facet){
            facet.constraints = _.filter(facet.constraints, function(constraint){ return constraint.selected;});
        });

        return selectedFacets;
    },

    visibleFacets : function(){
        var self = this;
        var facets = this.facetsWithLabels();

        _.each(facets, function(facet){
            facet.limited = facet.constraints.length > self._facetLimit;
            if(facet.limited){
                //not show all by default, but some
                facet.showingAll = self._showingAll[facet.fieldName];
                facet.showingNone = self._showingNone[facet.fieldName];

                if(!facet.showingAll){
                    if (facet.showingNone){
                        facet.constraints = _.first(facet.constraints, 0);
                    }else{
                        facet.constraints = _.first(facet.constraints, self._facetLimit);
                    }
                }
            }else{
                facet.showingAll = true;
                facet.showingNone = false;
            }
        });
        return facets;
    },

    showMoreFacet : function(fieldName){
        if(!this._showingAll[fieldName]){
            this._showingAll[fieldName] = true;
            this._showingNone[fieldName] = false;
            this.trigger('change', this);
        }
    },

    showLessFacet : function(fieldName){
        if(this._showingAll[fieldName]){
            this._showingAll[fieldName] = false;
            this.trigger('change', this);
        }
        else {
            this._showingNone[fieldName] = false;
            this.trigger('change', this);
        }
    },
    
    showNoneFacet : function(fieldName){
        if(!this._showingNone[fieldName]){
            this._showingAll[fieldName] = false;
            this._showingNone[fieldName] = true;
            this.trigger('change', this);
        }
    },

    setFacets : function(facets){
        this.reset(facets);
        this.triggerActiveProvider();
    },

    triggerActiveProvider : function(){
        var selectedFacets = this.selectedFacetsFromServer();
        var selectedProviders = _.find(selectedFacets, function(facet){ return facet.field === "FF_DS_PROV_ACRONYM";});
        if(selectedProviders){
            if(selectedProviders.constraints.length === 1){
                this.trigger('activeProvider', selectedProviders.constraints[0].code);
            }else{
                this.trigger('activeProvider', undefined);
            }
        }else{
            this.trigger('activeProvider', undefined);
        }
    }
});

STAT4YOU.modules.Search.ResultsCollection = Backbone.Collection.extend({

    initialize : function(models, options){
        this.numFound = 0;
        this.limit = 25;
        this.currentPage = 0;
    },

    fetchParams : function(){

        var data = _.extend({
                limit : this.limit,
                page  : this.currentPage
            }, this.fetchData);

        return {
            data : data,
            traditional : true,
            add : this.currentPage !== 0
        };
    },

    setQuery : function(queryModel){
        this.currentPage = 0;
        this.fetchData = queryModel.toURLParameters();
        this.fetch(this.fetchParams());
    },

    fetchNextPage : function(){
        this.currentPage = this.currentPage + 1;
        this.fetch(this.fetchParams());
    },

    hasMorePages : function(){
        var totalPages = Math.ceil(this.numFound / this.limit);
        return this.currentPage + 1 < totalPages;
    },

    url : function(){
        return STAT4YOU.apiContext + "search";
    },

    parse : function(response){
        this.numFound = response.numFound;

        if(response.faceted){
            this.trigger("change:facets", response.facets);
        }

        return response.results;
    }
});

_.extend(STAT4YOU.modules.Search.ResultsCollection.prototype, FetchEventsForCollection);

STAT4YOU.modules.Search.ActiveProvider = Backbone.Model.extend({

    setActiveProvider: function(activeProvider){
        this.activeProvider = activeProvider;
        if(activeProvider){
            this.fetch();
        }else{
            this.clear();
        }
    },

    url : function(){
        if(this.activeProvider){
            return STAT4YOU.apiContext + "providers/" + this.activeProvider;
        }
    }

});

STAT4YOU.modules.Search.View = Backbone.View.extend({

    initialize : function(options){
        this.debouncedSearchForm = _.debounce(this.submitSearchForm, 300);
        this._showingAll = {};
        this._showingNone = {};
    },

    events : {
        "submit .search-form" : "submitSearchForm",
        "keyup .search-form-query" : "keyupQuery",
        "click .facet-constraints" : "clickFacet",
        "click .facet-constraints-more" : "clickFacetMore",
        "click .facet-constraints-less" : "clickFacetLess",
        "click .facet-constraints-none" : "clickFacetNone"
    },

    renderPage : function(){
        var template = STAT4YOU.templateManager.get("search/search-page");
        this.$el.html(template());
        this.$query = $('.search-form-query', this.$el);
        this.renderActiveProvider(null);
        this.initializeInfiniteScroll($('.infiniteScroll', this.$el));
    },

    updateQueryString : function(queryModel){
        var currentVal = this.$query.val();
        var newVal = queryModel.get('query');
        if(currentVal !== newVal){
            this.$query.val(newVal);
        }
    },

    renderFacets : function(facets){
        var template = STAT4YOU.templateManager.get("search/search-facets");
        var context = {
            facets : facets.visibleFacets(),
            selectedFacets : facets.selectedFacetsFromServer()
        };
        $(".facet-container", this.$el).html(template(context));
    },

    renderResults : function(results){
        this.renderResultsInfo(results);

        $('#search-result-list').empty();
        results.each(function(result){
            this.addResult(result);
        }, this);
    },

    renderResultsInfo : function(results){
        var template = STAT4YOU.templateManager.get('search/search-results-info');
        var context = {
            numFound : results.numFound || 0
        };
        $('.search-results-info', this.$el).html(template(context));
    },

    renderActiveProvider : function(activeProviderModel){
        var template = STAT4YOU.templateManager.get('search/search-active-provider');
        var visible, activeProvider;
        // activeProvider will be null the first time
        if (!activeProviderModel) {
            visible = false;
            activeProvider = null;
        } else {
            visible = activeProviderModel.activeProvider !== undefined;
            activeProvider = activeProviderModel.toJSON();
        }
        
        var context = {
            visible : visible,
            activeProvider : activeProvider
        };
        $('.search-active-provider', this.$el).html(template(context));
    },

    addResult : function(result){
        var template = STAT4YOU.templateManager.get("search/search-result");
        $('#search-result-list').append(template(result.toJSON()));
    },

    submitSearchForm : function(){
        var value = this.$query.val();
        this.trigger('change:query', value);
        return false;
    },

    clickFacet : function(e){
        var $target = $(e.currentTarget);

        var eventsParams = {};
        eventsParams.fieldName = $target.data('fieldname');
        eventsParams.code = $target.data('code');

        this.trigger('toggleFacet', eventsParams);

        return false;
    },

    clickFacetMore : function(e){
        var $target = $(e.currentTarget);
        var fieldName = $target.data('fieldname');
        this.trigger('showMoreFacet', fieldName);
        return false;
    },

    clickFacetLess : function(e){
        var $target = $(e.currentTarget);
        var fieldName = $target.data('fieldname');
        this.trigger('showLessFacet', fieldName);
        return false;
    },

    clickFacetNone : function(e){
        var $target = $(e.currentTarget);
        var fieldName = $target.data('fieldname');
        this.trigger('showNoneFacet', fieldName);
        return false;
    },
    
    isSpaceKey : function(e){
        return e.which === 32; // <space>
    },

    keyupQuery : function(e){
        this.debouncedSearchForm();
        return false;
    }
});

_.extend(STAT4YOU.modules.Search.View.prototype, InfiniteScrollView);

STAT4YOU.modules.Search.Router = Backbone.Router.extend({
    routes : {
        "!/?*query" : "search",
        "*params" : "defaultRoute"
    },

    updateUrl : function(queryModel){
        var parametersString = $.param(queryModel.toURLParameters(), true);
        this.navigate("!/?" + parametersString);
    },

    parseUrlParams : function(url) {
        var params,
            query = '',
            facets = {},
            i;

        url = url.replace(/\+/g, ' ');
        params = url.split("&");

        for (i = 0; i < params.length; i++) {
            var val = params[i].split("=");
            if(val.length === 2){
                var key =  decodeURIComponent(val[0]);
                var value = decodeURIComponent(val[1]);

                if(key === 'q'){
                    query = value;
                }else{
                    if(!facets[key]){
                        facets[key] = [];
                    }
                    facets[key].push(value);
                }
            }
        }

        return {query : query, facets : facets};
    },

    defaultRoute : function(){
        this.trigger("newRoute", {query : '', facets : []});
    },

    search : function(urlParams){
        var params = this.parseUrlParams(urlParams);
        this.trigger("newRoute", params);
    }
});

STAT4YOU.modules.Search.Main = function(options){
    options || (options = {});
    var self = this;

    self.router = new STAT4YOU.modules.Search.Router();
    self.queryModel = new STAT4YOU.modules.Search.QueryModel();
    self.view = new STAT4YOU.modules.Search.View({el : options.el});
    self.resultsCollection = new STAT4YOU.modules.Search.ResultsCollection();
    self.facetsCollection = new STAT4YOU.modules.Search.FacetsCollection();
    self.activeProviderModel = new STAT4YOU.modules.Search.ActiveProvider();

    //Init
    self.view.renderPage();


    // Router <-> QueryModel
    self.queryModel.on("change", self.router.updateUrl, self.router);
    self.router.on("newRoute", self.queryModel.set, self.queryModel);

    // QueryModel <-> View
    self.queryModel.on("change:query", self.view.updateQueryString, self.view);
    self.view.on("change:query", function(query){
        self.queryModel.set('query', query);
    });
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

    //ActiveProviderModel <-> View
    self.activeProviderModel.on("change", self.view.renderActiveProvider, self.view);

    return this;
};