/*! stat4you-web 2013-07-25 */
(function(e,t){var n,i=t.event;i.special.smartscroll={setup:function(){t(this).bind("scroll",i.special.smartscroll.handler)},teardown:function(){t(this).unbind("scroll",i.special.smartscroll.handler)},handler:function(e,i){var r=this,a=arguments;e.type="smartscroll",n&&clearTimeout(n),n=setTimeout(function(){t.event.dispatch.apply(r,a)},"execAsap"===i?0:100)}},t.fn.smartscroll=function(e){return e?this.bind("smartscroll",e):this.trigger("smartscroll",["execAsap"])}})(window,$),function(){"use strict";STAT4YOU.namespace("STAT4YOU.mixins.FetchEventsForCollection"),STAT4YOU.mixins.FetchEventsForCollection={fetch:function(e){var t=this;e=e||{},e.data=e.data||{};var n=e.success;e.success=function(e,i){t.trigger("fetch:end",t),n&&n(e,i)};var i=e.error;e.error=function(e,n,r){t.trigger("fetch:end",t),i&&i(e,n,r)},t.trigger("fetch:start",t),Backbone.Collection.prototype.fetch.call(this,e)}}}(),function(){"use strict";STAT4YOU.namespace("STAT4YOU.mixins.InfiniteScrollView"),STAT4YOU.mixins.InfiniteScrollView={template:STAT4YOU.templateManager.get("search/search-infinitescroll"),initializeInfiniteScroll:function(e){var t=this;t.$infiniteScrollContainer=e,t.hasMore=!1,t.$infiniteScrollContainer.bind("click",function(){t.loadMore()}),_.bindAll(this,"scroll","isNearBottom"),$(window).smartscroll(this.scroll),t.isDuringAjax=!1},render:function(e){this.$infiniteScrollContainer&&this.$infiniteScrollContainer.html(this.template(e))},fetchStart:function(){this.isDuringAjax=!0,this.render({loading:!0})},fetchEnd:function(e){this.isDuringAjax=!1,this.hasMore=e.hasMorePages(),this.hasMore?this.render({loadMore:!0}):this.render({noMore:!0})},loadMore:function(){this.hasMore&&this.trigger("infiniteScroll:loadMore")},scroll:function(){this.isDuringAjax||this.isNearBottom()&&this.loadMore()},isNearBottom:function(){var e=$(window),t=e.scrollTop(),n=e.height(),i=this.$infiniteScrollContainer,r=i.offset().top+i.height()-1,a=0+r-t-n;return 0>a}}}(),function(){"use strict";STAT4YOU.namespace("STAT4YOU.modules.search.SearchActiveProvider"),STAT4YOU.modules.search.SearchActiveProvider=Backbone.Model.extend({setActiveProvider:function(e){this.activeProvider=e,e?this.fetch():this.clear()},url:function(){return this.activeProvider?STAT4YOU.apiContext+"/providers/"+this.activeProvider:void 0}})}(),function(){"use strict";STAT4YOU.namespace("STAT4YOU.modules.search.SearchFacetsCollection"),STAT4YOU.modules.search.SearchFacetsCollection=Backbone.Collection.extend({initialize:function(){this._showingAll={},this._showingNone={},this._facetLimit=10},facetsWithLabels:function(){var e=this.toJSON();return _.each(e,function(e){e.label=I18n.t("idxmanager.facet."+e.field)}),e=this._sortTemporalContraints(e)},_sortTemporalContraints:function(e){return _.map(e,function(e){return"FF_TEMPORAL_YEARS"===e.field&&(e.constraints=_.sortBy(e.constraints,function(e){return e.code}).reverse()),e}),e},selectedFacetsFromServer:function(){var e=this.facetsWithLabels();return _.each(e,function(e){e.constraints=_.filter(e.constraints,function(e){return e.selected})}),e},visibleFacets:function(){var e=this,t=this.facetsWithLabels();return _.each(t,function(t){if(t.limited=t.constraints.length>e._facetLimit,t.limited){if(t.showingAll=e._showingAll[t.fieldName],t.showingNone=e._showingNone[t.fieldName],!t.showingAll){var n=t.showingNone?0:e._facetLimit;t.constraints=_.first(t.constraints,n)}}else t.showingAll=!0,t.showingNone=!1}),t},showMoreFacet:function(e){this._showingAll[e]||(this._showingAll[e]=!0,this._showingNone[e]=!1,this.trigger("change",this))},showLessFacet:function(e){this._showingAll[e]?(this._showingAll[e]=!1,this.trigger("change",this)):(this._showingNone[e]=!1,this.trigger("change",this))},showNoneFacet:function(e){this._showingNone[e]||(this._showingAll[e]=!1,this._showingNone[e]=!0,this.trigger("change",this))},setFacets:function(e){this.reset(e),this.triggerActiveProvider()},triggerActiveProvider:function(){var e=this.selectedFacetsFromServer(),t=_.find(e,function(e){return"FF_DS_PROV_ACRONYM"===e.field});t?1===t.constraints.length?this.trigger("activeProvider",t.constraints[0].code):this.trigger("activeProvider",void 0):this.trigger("activeProvider",void 0)}})}(),function(){"use strict";STAT4YOU.namespace("STAT4YOU.modules.search.SearchQueryModel"),STAT4YOU.modules.search.SearchQueryModel=Backbone.Model.extend({defaults:{query:void 0,facets:{}},isFacetSelected:function(e,t){var n=this.get("facets"),i=!1,r=n[e];return r&&(i=-1!==_.indexOf(r,t)),i},selectFacet:function(e,t){if(!this.isFacetSelected(e,t)){var n=this.get("facets"),i=n[e];i?n[e].push(t):n[e]=[t],this.trigger("change",this),this.trigger("change:facets",this)}},deselectFacet:function(e,t){if(this.isFacetSelected(e,t)){var n=this.get("facets"),i=n[e],r=_.indexOf(i,t);i.splice(r,1),0===i.length&&delete n[e],this.trigger("change",this),this.trigger("change:facets",this)}},toggleFacet:function(e){e||(e={});var t=e.fieldName,n=e.code+"";this.isFacetSelected(t,n)?this.deselectFacet(t,n):this.selectFacet(t,n)},toURLParameters:function(){var e=_.extend({},this.get("facets")),t=this.get("query");return e.query=t||"",e}})}(),function(){"use strict";STAT4YOU.namespace("STAT4YOU.modules.search.SearchResultsCollection"),STAT4YOU.modules.search.SearchResultsCollection=Backbone.Collection.extend({initialize:function(){this.limit=25,this.offset=0,this.total=0},fetchParams:function(){var e=[];_.each(this.fetchData,function(t,n){_.isArray(t)?_.each(t,function(t){e.push(n+"='"+t+"'")}):e.push(n+"='"+t+"'")});var t=e.join("&"),n={query:t,limit:this.limit,offset:this.offset,faceted:!0};return{data:n,traditional:!0,remove:0===this.offset,reset:0===this.offset}},setQuery:function(e){this.offset=0,this.fetchData=e.toURLParameters(),this.fetch(this.fetchParams()),STAT4YOU.track({event:"search",query:e.get("query")})},fetchNextPage:function(){this.offset=this.offset+this.limit,this.fetch(this.fetchParams())},hasMorePages:function(){return this.offset+this.limit<this.total},url:function(){return STAT4YOU.apiContext+"/datasets"},parse:function(e){return this.total=e.total,e.faceted&&this.trigger("change:facets",e.facets),e.items}}),_.extend(STAT4YOU.modules.search.SearchResultsCollection.prototype,STAT4YOU.mixins.FetchEventsForCollection)}(),function(){"use strict";App.namespace("App.modules.search.SearchHeaderView"),App.modules.search.SearchHeaderView=Backbone.View.extend({headerTemplate:STAT4YOU.templateManager.get("search/search-header"),activeProviderTemplate:STAT4YOU.templateManager.get("search/search-active-provider"),events:{"submit .search-form":"submitSearchForm","keyup .search-form-query":"keyupQuery"},initialize:function(e){this.queryModel=e.queryModel,this.activeProviderModel=e.activeProviderModel,this.listenTo(this.queryModel,"change:query",this.modelChangeQuery),this.listenTo(this.activeProviderModel,"change",this.renderActiveProvider),this.debouncedSearchForm=_.debounce(this.submitSearchForm,App.modules.search.SearchHeaderView.KEYUP_DELAY)},render:function(){this.$el.html(this.headerTemplate()),this.renderActiveProvider(),this.$queryInput=this.$(".search-form-query"),this.$queryForm=this.$(".search-form")},renderActiveProvider:function(){var e={visible:void 0!==this.activeProviderModel.activeProvider,activeProvider:this.activeProviderModel.toJSON()};this.$(".search-active-provider").html(this.activeProviderTemplate(e))},modelChangeQuery:function(){var e=this.$queryInput.val(),t=this.queryModel.get("query");e!==t&&this.$queryInput.val(t)},submitSearchForm:function(){var e=this.$queryInput.val();return this.queryModel.set("query",e),!1},keyupQuery:function(){return this.debouncedSearchForm(),!1}}),App.modules.search.SearchHeaderView.KEYUP_DELAY=300}(),function(){"use strict";STAT4YOU.namespace("STAT4YOU.modules.search.SearchView"),STAT4YOU.modules.search.SearchView=Backbone.View.extend({initialize:function(){this._showingAll={},this._showingNone={}},events:{"click .facet-constraints":"clickFacet","click .facet-constraints-more":"clickFacetMore","click .facet-constraints-less":"clickFacetLess","click .facet-constraints-none":"clickFacetNone"},renderPage:function(){var e=STAT4YOU.templateManager.get("search/search-page");this.$el.html(e()),this.$queryInput=$(".search-form-query",this.$el),this.initializeInfiniteScroll($(".infiniteScroll",this.$el))},renderFacets:function(e){var t=STAT4YOU.templateManager.get("search/search-facets"),n={facets:e.visibleFacets(),selectedFacets:e.selectedFacetsFromServer()};$(".facet-container",this.$el).html(t(n))},renderResults:function(e){this.renderResultsInfo(e),$("#search-result-list").empty(),e.each(function(e){this.addResult(e)},this)},renderResultsInfo:function(e){var t=STAT4YOU.templateManager.get("search/search-results-info"),n={total:e.total||0};$(".search-results-info",this.$el).html(t(n))},addResult:function(e){var t=STAT4YOU.templateManager.get("search/search-result");$("#search-result-list").append(t(e.toJSON()))},clickFacet:function(e){var t=$(e.currentTarget),n={};return n.fieldName=t.data("fieldname"),n.code=t.data("code"),this.trigger("toggleFacet",n),!1},clickFacetMore:function(e){var t=$(e.currentTarget),n=t.data("fieldname");return this.trigger("showMoreFacet",n),!1},clickFacetLess:function(e){var t=$(e.currentTarget),n=t.data("fieldname");return this.trigger("showLessFacet",n),!1},clickFacetNone:function(e){var t=$(e.currentTarget),n=t.data("fieldname");return this.trigger("showNoneFacet",n),!1}}),_.extend(STAT4YOU.modules.search.SearchView.prototype,STAT4YOU.mixins.InfiniteScrollView)}(),function(){"use strict";App.namespace("App.modules.search.SearchMain"),App.modules.search.SearchMain=function(e){this.initialize(e)},App.modules.search.SearchMain.prototype={initialize:function(e){var t=this;t.queryModel=e.queryModel,t.activeProviderModel=e.activeProviderModel,t.view=new App.modules.search.SearchView({el:e.el}),t.resultsCollection=new App.modules.search.SearchResultsCollection,t.facetsCollection=new App.modules.search.SearchFacetsCollection,t.view.on("toggleFacet",t.queryModel.toggleFacet,t.queryModel),t.queryModel.on("change",t.resultsCollection.setQuery,t.resultsCollection),t.resultsCollection.on("change:facets",t.facetsCollection.setFacets,t.facetsCollection),t.resultsCollection.on("reset",t.view.renderResults,t.view),t.resultsCollection.on("add",t.view.addResult,t.view),t.resultsCollection.on("fetch:start",t.view.fetchStart,t.view),t.resultsCollection.on("fetch:end",t.view.fetchEnd,t.view),t.view.on("infiniteScroll:loadMore",t.resultsCollection.fetchNextPage,t.resultsCollection),t.facetsCollection.on("reset",t.view.renderFacets,t.view),t.facetsCollection.on("change",t.view.renderFacets,t.view),t.view.on("showMoreFacet",t.facetsCollection.showMoreFacet,t.facetsCollection),t.view.on("showLessFacet",t.facetsCollection.showLessFacet,t.facetsCollection),t.view.on("showNoneFacet",t.facetsCollection.showNoneFacet,t.facetsCollection),t.facetsCollection.on("activeProvider",t.activeProviderModel.setActiveProvider,t.activeProviderModel)},render:function(){this.view.renderPage()}}}();