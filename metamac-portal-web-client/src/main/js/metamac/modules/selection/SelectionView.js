(function () {
    "use strict";

    App.namespace('App.modules.selection.SelectionView');

    App.modules.selection.SelectionView = Backbone.Marionette.CompositeView.extend({

        template : "selection/selection",
        itemView : App.widget.filter.sidebar.FilterSidebarDimensionView,
        itemViewContainer: ".selection-dimensions",

        events : {
            "click .selection-visualize-selection" : "onVisualizeSelection",
            "click .selection-visualize-all" : "onVisualizeAll"
        },

        initialize : function (options) {
            this.metadata = options.metadata;
            this.controller = options.controller;
            this.filterDimensions = this.controller.filterDimensions;            
            
            this.dataset = new App.dataset.Dataset({metadata : this.metadata, filterDimensions : this.filterDimensions});                        
            this._initializeSidebarView();

            this.optionsModel = new App.modules.dataset.OptionsModel({visualize: true});
            this._initializeOptionsView();
            this._initializeFullScreen();
        },

        serializeData : function () {
            var context = {
                selectAllUrl : App.context + this.metadata.urlIdentifierPart(),
                metadata : this.metadata.toJSON()
            };
            return context;
        },
        
       	_initializeOptionsView : function () {
            this.optionsView = new App.modules.dataset.OptionsView({
            	optionsModel : this.optionsModel,
                filterDimensions : this.filterDimensions,
                el : this.$(".selection-options-bar")
                //,buttons : this.veElements
            });
        },
        
        _initializeSidebarView : function () {            
            this.infoView = new App.modules.dataset.DatasetInfoView({
                dataset : this.dataset
            });
            
            this.helpView = new App.modules.dataset.DatasetHelpView({});
            
            var sideViews = [this.infoView, this.helpView];
            this.sidebarView = new App.components.sidebar.SidebarView({sideViews : sideViews});
        },

        buildItemView : function (item, ItemViewType, itemViewOptions) {
            var options = _.extend({filterDimension : item, collapsable : false}, itemViewOptions);
            return new ItemViewType(options);
        },

        onBeforeRender : function () {
            this.delegateEvents();

            this.collection.invoke('set', {open : true});
            this.collection.accordion = false;

            var zones = this.collection.zones;

            // Remove restrictions
            zones.get("left").set({fixedSize : undefined, selectedLimit : Infinity});
            zones.get("top").set({fixedSize : undefined, selectedLimit : Infinity});

            var fixedDimensions = _.clone(zones.get("fixed").get("dimensions").models);
            _.each(fixedDimensions, function (dimension) {
                zones.setDimensionZone("left", dimension);
            }, this);
        },
        
        onRender: function() {
        	// We render here the sidebar because marionette provides a built in method
            this.sidebarView.setElement(this.$('.sidebar-container')).render();          
            this.optionsView.setElement(this.$('.selection-options-bar')).render();
            
            this.fullScreen.setContainer(this.$('.selection-body'));
            this._unbindEvents();
            this._bindEvents();
            
            this.updatePageTitle();
            this.updatePageDescription();
        },
        
        _initializeFullScreen : function () {
            this.fullScreen = new App.FullScreen();
        },
        
        _bindEvents : function () {
            // FullScreen
            this.listenTo(this.optionsView, "enterFullScreen", _.bind(this.fullScreen.enterFullScreen, this.fullScreen));
            this.listenTo(this.optionsView, "exitFullScreen", _.bind(this.fullScreen.exitFullScreen, this.fullScreen));
            this.listenTo(this.fullScreen, "didEnterFullScreen", this._onDidEnterFullScreen);
            this.listenTo(this.fullScreen, "didExitFullScreen", this._onDidExitFullScreen);
        },
        
        _unbindEvents : function () {
            this.stopListening();
        },
        
        _onDidEnterFullScreen : function () {
        	this.sidebarView.updateSidebarHeight();
            this.optionsModel.set('fullScreen', true);
        },

        _onDidExitFullScreen : function () {
        	this.sidebarView.updateSidebarHeight();
            this.optionsModel.set('fullScreen', false);
        },
        
        onShow : function() {
        	this.sidebarView.updateSidebarHeight();
        },
       
        onBeforeClose : function () {
            var models = this.collection.models;
            _(models).first().set({open : true});
            _.chain(models).tail().invoke('set', {open : false});
            this.collection.accordion = true;
        },

        onVisualizeAll : function (e) {
            e.preventDefault();

            this.collection.each(function (filterDimension) {
                filterDimension.get('representations').selectAll();
            });
            this.gotoVisualization();
        },

        onVisualizeSelection : function (e) {
            e.preventDefault();
            // generate a permalink?
            this.gotoVisualization();
        },

        gotoVisualization : function () {
            var controllerParams = this.metadata.identifier();
            this.controller.showDatasetVisualization(controllerParams);
        },
        updatePageTitle : function() {
        	document.title = I18n.t("page.titlePreffix") + " " + this.filterDimensions.metadata.getTitle();
        },
        updatePageDescription : function() {
        	if ($('meta[name=description]').length) {
        		$('meta[name=description]').attr('description',  this.filterDimensions.metadata.getDescription());
        	} else {
        		$('head').append('<meta name="description" content="' + this.filterDimensions.metadata.getDescription() + '" />');
        	}
        }

    });

}());