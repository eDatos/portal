(function () {
    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetView = Backbone.Marionette.Layout.extend({

        template : "dataset/dataset-page",

        regions : {
            content : ".dataset-sidebar-visualization-container"
        },

        initialize : function (options) {
            this.controller = options.controller;
            this.filterDimensions = options.filterDimensions;
            this.metadata = options.metadata;

            this.optionsModel = new App.modules.dataset.OptionsModel({ widget : App.config.widget});
            this.dataset = new App.dataset.Dataset({metadata : this.metadata, filterDimensions : this.filterDimensions});

            this._initializeVisualElements();
            this._initializeSidebarView();
            this._initializeFullScreen();
            this._initializeHighChartsLocale();
        },

        _initializeVisualElements : function () {
            var visualElements = ["canvasTable", "column", "line"];
            if (_.findWhere(this.metadata.getDimensions(), {type : 'GEOGRAPHIC_DIMENSION'})) {
                visualElements.push("map");
                visualElements.push("mapbubble");
            }
            this.visualElements = visualElements;
        },

        _initializeSidebarView : function () {
            // sidebar - infoview
            this.infoView = new App.modules.dataset.DatasetInfoView({
                dataset : this.dataset
            });

            // visualization
            this.visualizationView = new App.modules.dataset.DatasetVisualizationView({
                dataset : this.dataset,
                filterDimensions : this.filterDimensions,
                optionsModel : this.optionsModel,
                veElements : this.visualElements
            });

            // sidebarView
            var sideViews = [this.infoView];
            if (!this.optionsModel.get('widget')) {

                // sidebar - filter
                this.filterSidebarView = new App.widget.filter.sidebar.FilterSidebarView({
                    filterDimensions : this.filterDimensions,
                    optionsModel : this.optionsModel
                });

                this.orderSidebarView = new App.widget.filter.sidebar.OrderSidebarView({
                    filterDimensions : this.filterDimensions,
                    optionsModel : this.optionsModel
                });

                sideViews.push(this.filterSidebarView);
                sideViews.push(this.orderSidebarView);
            }

            this.sidebarView = new App.components.sidebar.SidebarView({sideViews : sideViews, contentView : this.visualizationView});
        },

        _initializeFullScreen : function () {
            this.fullScreen = new App.FullScreen();
        },

        _bindEvents : function () {
            // FullScreen
            this.listenTo(this.visualizationView, "enterFullScreen", _.bind(this.fullScreen.enterFullScreen, this.fullScreen));
            this.listenTo(this.visualizationView, "exitFullScreen", _.bind(this.fullScreen.exitFullScreen, this.fullScreen));
            this.listenTo(this.fullScreen, "didEnterFullScreen", this._onDidEnterFullScreen);
            this.listenTo(this.fullScreen, "didExitFullScreen", this._onDidExitFullScreen);
            this.listenTo(this.optionsModel, "change:type", this._onSelectChartType);
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        serializeData : function () {
            var context = {
                showHeader : this._showHeader(), // Depends if the server is already painting the title and description
                isWidget : this.optionsModel.get('widget'),
                metadata : this.metadata.toJSON()
            };
            return context;
        },

        _showHeader: function() {
            return App.config.showHeader && !this.optionsModel.get('widget');
        },

        onRender : function () {
            this.content.show(this.sidebarView);
            this.fullScreen.setContainer(this.content.$el);
            if (this.optionsModel.get('widget')) {
                this._initializeWidget();
            }
            this._unbindEvents();
            this._bindEvents();

            App.BrowsersCompatibility.forceFontsRepaint();         
        },

        onBeforeClose : function () {
            this.optionsModel.unset('type');
        },

        showChart : function (options) {
            if (options.fullScreen) {
                this.fullScreen.enterFullScreen();
            }

            this.optionsModel.set('type', options.visualizationType);
        },

        copyFilterDimensions : function (from, to) {
            to.importJSON(from.exportJSON());
        },

        _onSelectChartType : function () {
            var currentVe = this.visualizationView._getCurrentVe();
            if (currentVe) {
                currentVe._unbindEvents();
            }

            var type = this.optionsModel.get('type');
            if (type) {
                this.visualizationView.activeVisualElement(type);
                this.visualizationView.load();

                var controllerParams = this.metadata.identifier();
                controllerParams.visualizationType = type;
                this.controller.changeDatasetVisualization(controllerParams);
            }
        },

        _onDidEnterFullScreen : function () {
            this.visualizationView._didEnterFullScreen();
            this.optionsModel.set('fullScreen', true);

            if (this.optionsModel.get('widget')) {
                this._updateSidebarHeight('');
            }
        },

        _onDidExitFullScreen : function () {
            this.visualizationView._didExitFullScreen();
            this.optionsModel.set('fullScreen', false);

            if (this.optionsModel.get('widget')) {
                this._updateSidebarHeight($('html').height());
            }
        },
        
        _initializeHighChartsLocale : function() {            
        	Highcharts.setOptions({
        		lang: {
        			thousandsSep: I18n.t("number.format.delimiter"),
        			decimalPoint: I18n.t("number.format.separator")
        		}
        	});
        },

        _initializeWidget : function () {
            this.content.$el.addClass('dataset-widget');
            this._updateSidebarHeight($('html').height());
        },  
        _updateSidebarHeight : function (height) {
            this.content.$el.find('.sidebar-container').height(height);   
        },
        
        // Deprecated
        updatePageTitle : function() {
        	document.title = I18n.t("page.titlePreffix") + " " + this.filterDimensions.metadata.getTitle();
        },
        
        // Deprecated
        updatePageDescription : function() {
        	if ($('meta[name=description]').length) {
        		$('meta[name=description]').attr('description',  this.filterDimensions.metadata.getDescription());
        	} else {
        		$('head').append('<meta name="description" content="' + this.filterDimensions.metadata.getDescription() + '" />');
        	}
        }
        

    });

}());