(function () {
    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetView = Backbone.Marionette.Layout.extend({

        template : "dataset/dataset-page",

        regions : {
            content : ".dataset-sidebar-visualization-container",
            optionsBar: ".dataset-visualization-options-bar",
            dimensions: ".dataset-visualization-dimensions"
        },

        initialize : function (options) {
            this.controller = options.controller;
            this.filterDimensions = options.filterDimensions;
            this.metadata = options.metadata;

            this.optionsModel = new App.modules.dataset.OptionsModel({ 
                widget : App.config.widget, 
                menu: false
            });
            this.dataset = new App.dataset.Dataset({metadata : this.metadata, filterDimensions : this.filterDimensions});

            this._initializeVisualElements();
            this._initializeSidebarView();
            this._initializeFullScreen();
            this._initializeHighChartsLocale();
        },

        _initializeVisualElements : function () {
            var visualElements = ["info", "canvasTable", "column", "line"];
            if (_.findWhere(this.metadata.getDimensions(), {type : 'GEOGRAPHIC_DIMENSION'})) {
                visualElements.push("map");
                visualElements.push("mapbubble");
            }
            this.visualElements = visualElements;
        },

        _initializeSidebarView : function () {
            // Options bar
            this.optionsView = new App.modules.dataset.OptionsView({
                filterDimensions : this.filterDimensions,
                optionsModel : this.optionsModel,
                buttons : this.visualElements
            });

            this.dimensionsView = new App.modules.dataset.DimensionsView({
                filterDimensions : this.filterDimensions,
                optionsModel : this.optionsModel
            });

            // visualization
            this.visualizationView = new App.modules.dataset.DatasetVisualizationView({
                dataset : this.dataset,
                filterDimensions : this.filterDimensions,
                optionsModel : this.optionsModel,
                veElements : this.visualElements,
                optionsView: this.optionsView
            });

            // sidebarView
            var sideViews = [];
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

            this.sidebarView = new App.components.sidebar.SidebarView({
                sideViews : sideViews, 
                contentView : this.visualizationView,
                optionsModel : this.optionsModel
            });
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
            this.listenTo(this.optionsModel, "change:filter", this._updateDimensionsHeight);            
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        _updateDimensionsHeight : function() {
            this.content.$el.toggleClass('has-dimensions', this.optionsModel.get('filter'));
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
            this.optionsBar.show(this.optionsView);
            this.dimensions.show(this.dimensionsView);
            this.fullScreen.setContainer($('.metamac-container'));
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
                this.optionsModel.set('fullScreen', options.fullScreen);
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
                this.dimensionsView.render();

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
        }
    });

}());