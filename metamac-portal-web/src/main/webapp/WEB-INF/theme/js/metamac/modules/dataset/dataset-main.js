(function () {
    App.namespace("App.modules.dataset");

    App.modules.dataset.Main = function (options) {
        this.initialize(options);
    };

    App.modules.dataset.Main.prototype = {

        _defaultOptions : {
            showPage : true,
            showOptions : true,
            showExport : true,
            animation : true
        },

        _initializeVisualElements : function () {
            var visualElements = ["canvasTable", "column", "line"];
            if (_.findWhere(this.metadata.getDimensions(), {type : 'GEOGRAPHIC_DIMENSION'})) {
                visualElements.push("map");
            }
            this.visualElements = visualElements;
        },

        _initializeFilterDimensionsByType : function () {
            var metadata = this.metadata;
            this.filterDimensionsByType = _.reduce(this.visualElements, function (memo, visualElement) {
                memo[visualElement] = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
                return memo;
            }, {});
            this._initializeFilterRestrictions();
        },

        _initializeFilterRestrictions : function () {
            // TODO
            //this.filterDimensionsByType.line.setZoneLengthRestriction({left : {value : 1, preferedType : "TIME_DIMENSION"}, top : 1});
            //this.filterDimensionsByType.column.setSelectedCategoriesRestriction({horizontal : 5, columns : 10});
        },

        _initializePageView : function (options) {
            this.pageView = new App.modules.dataset.PageView({
                el : options.el,
                metadata : this.metadata,
                attributes : this.attributes
            });
            this.pageView.render();
        },

        _initializeWidgetPageView : function (options) {
            this.pageView = new App.modules.dataset.DatasetWidgetPageView({
                el : options.el,
                metadata : this.metadata,
                attributes : this.attributes,
                showOptions : options.showOptions,
                showExport : options.showExport
            });
            this.pageView.render();
        },

        _initializeSidebarView : function ($el) {
            // sidebar - infoview
            this.infoView = new App.modules.dataset.DatasetInfoView({
                dataset : this.dataset,
                datasetAttributes : this.attributes
            });

            // sidebar - filter
            this.filterSidebarView = new App.widget.filter.sidebar.FilterSidebarView({
                filterDimensions : this.filterDimensions,
                optionsModel : this.optionsModel
            });

            this.orderSidebarView = new App.widget.filter.sidebar.OrderSidebarView({
                filterDimensions : this.filterDimensions,
                optionsModel : this.optionsModel
            });

            // visualization
            this.visualizationView = new App.modules.dataset.DatasetVisualizationView({
                dataset : this.dataset,
                filterDimensions : this.filterDimensions,
                optionsModel : this.optionsModel,
                veElements : this.visualElements
            });

            // sidebarView
            var sideViews = [this.infoView, this.filterSidebarView, this.orderSidebarView];
            this.sidebarView = new App.components.sidebar.SidebarView({el : $el, sideViews : sideViews, contentView : this.visualizationView});
            this.sidebarView.render();
        },

        _initializeFullScreen : function ($el) {
            this.fullScreen = new App.FullScreen({container : $el});
        },

        initialize : function (options) {
            options = _.defaults(options, this._defaultOptions);

            this.attributes = options.attributes;
            this.metadata = options.metadata;

            this.optionsModel = new App.modules.dataset.OptionsModel();

            this.exporter = new App.svg.Exporter();

            this._initializeVisualElements();
            this._initializeFilterDimensionsByType();
            this.filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(this.metadata);
            this.dataset = new App.dataset.Dataset({metadata : this.metadata, filterDimensions : this.filterDimensions});

            if (options.showPage) {
                this._initializePageView(options);
            } else {
                this._initializeWidgetPageView(options);
            }

            var $sidebarContainer = this.pageView.$el.find(".dataset-sidebar-visualization-container");
            this._initializeSidebarView($sidebarContainer);
            this._initializeFullScreen($sidebarContainer);

            this.router = new App.modules.dataset.Router({ defaultType : 'canvasTable' });

            this._bindEvents();

            $(function () {
                Backbone.history.start();
            });
        },

        _bindEvents : function () {
            // FullScreen
            this.visualizationView.on("enterFullScreen", this.fullScreen.enterFullScreen, this.fullScreen);
            this.visualizationView.on("exitFullScreen", this.fullScreen.exitFullScreen, this.fullScreen);
            this.fullScreen.on('didEnterFullScreen', this._onDidEnterFullScreen, this);
            this.fullScreen.on('didExitFullScreen', this._onDidExitFullScreen, this);
            this.router.on('changeChart', this._onRouterChangeChart, this);
            this.optionsModel.on('change:type', this._onSelectChartType, this);
        },

        _onDidEnterFullScreen : function () {
            this.visualizationView._didEnterFullScreen();
            this.optionsModel.set('fullScreen', true);
        },

        _onDidExitFullScreen : function () {
            this.visualizationView._didExitFullScreen();
            this.optionsModel.set('fullScreen', false);
        },

        _onRouterChangeChart : function (options) {
            if (options.selection) {
                var permalink = new App.modules.dataset.DatasetPermalink({identifier : options.selection});
                var request = permalink.fetch();

                //TODO permalink
//                request.success(function () {
//                    var content = JSON.parse(permalink.get('content'));
//                    self.filterDimensionsByType[options.type].importSelection(content);
//                    self.optionsModel.set('type', options.type);
//                });

            } else {
                this.optionsModel.set('type', options.type);
            }
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
            this.router.navigate("type/" + type);
            var oldType = this.optionsModel.previousAttributes().type;

            if (oldType) {
                this.copyFilterDimensions(this.filterDimensions, this.filterDimensionsByType[oldType]);
            }
            this.visualizationView.activeVisualElement(type);
            this.copyFilterDimensions(this.filterDimensionsByType[type], this.filterDimensions);
            this.visualizationView.load();
        }

    };


//    self.exportView.on('export', function (params) {
//        var svg = self.pageView.$el.find("svg").get(0);
//        self.exporter.processSvgElement(svg, params.type);
//    });
//            var exportViewEl = self.pageView.$el.find('.dataset-export');
//            self.exportView = new App.modules.dataset.ExportView({el : exportViewEl, model : self.optionsModel});
//            self.exportView.render();
//
//            self.permalinkBuilder = new App.modules.dataset.PermalinkBuilder({
//                filterOptions : self.filterOptions,
//                optionsModel : self.optionsModel
//            });

//            var actions$el = self.pageView.$el.find(".dataset-header-actions");
//            self.datasetActionsView = new App.modules.dataset.DatasetActionsView({
//                el : actions$el,
//                filterOptions : self.filterOptions,
//                permalinkBuilder : self.permalinkBuilder
//            });
//            self.datasetActionsView.render();

}());