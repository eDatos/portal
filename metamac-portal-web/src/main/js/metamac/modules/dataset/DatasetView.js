(function () {
    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetView = Backbone.Marionette.Layout.extend({

        template : "dataset/dataset-page",

        regions : {
            content : ".dataset-sidebar-visualization-container"
        },

        initialize : function (options) {
            this.filterDimensions = options.filterDimensions;
            this.metadata = options.metadata;

            this.optionsModel = new App.modules.dataset.OptionsModel();
            this.dataset = new App.dataset.Dataset({metadata : this.metadata, filterDimensions : this.filterDimensions});

            this._initializeVisualElements();
            this._initializeFilterDimensionsByType();
            this._initializeSidebarView();
            this._initializeFullScreen();
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
        },

        _initializeSidebarView : function () {
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

        serializeData : function () {
            var context = {
                metadata : this.metadata.toJSON()
            };
            return context;
        },

        onRender : function () {
            this.content.show(this.sidebarView);
            this.fullScreen.setContainer(this.content.$el);
            this._bindEvents();
        },

        onBeforeClose : function () {
            this.optionsModel.unset('type');
        },

        delegateEvents : function () {

        },

        showChart : function (options) {
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
                //var type = this.optionsModel.get('type');
                //this.visualizationView.activeVisualElement(type);
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

            var oldType = this.optionsModel.previousAttributes().type;

            if (oldType) {
                this.copyFilterDimensions(this.filterDimensions, this.filterDimensionsByType[oldType]);
            }

            if (type) {
                this.visualizationView.activeVisualElement(type);
                this.copyFilterDimensions(this.filterDimensionsByType[type], this.filterDimensions);
                this.visualizationView.load();

                Backbone.history.navigate("visualization/" + type, {replace : true});
            }
        },

        _onDidEnterFullScreen : function () {
            this.visualizationView._didEnterFullScreen();
            this.optionsModel.set('fullScreen', true);
        },

        _onDidExitFullScreen : function () {
            this.visualizationView._didExitFullScreen();
            this.optionsModel.set('fullScreen', false);
        }

    });


    /*
     App.modules.dataset.Main.prototype = {

     _defaultOptions : {
     showPage : true,
     showOptions : true,
     showExport : true,
     animation : true
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

     this._bindEvents();
     },

     open : function () {
     console.log('open');
     },

     close : function () {
     console.log('close');
     },

     render : function () {
     console.log("render!!");
     },

     _bindEvents : function () {
     // FullScreen
     this.visualizationView.on("enterFullScreen", this.fullScreen.enterFullScreen, this.fullScreen);
     this.visualizationView.on("exitFullScreen", this.fullScreen.exitFullScreen, this.fullScreen);
     this.fullScreen.on('didEnterFullScreen', this._onDidEnterFullScreen, this);
     this.fullScreen.on('didExitFullScreen', this._onDidExitFullScreen, this);

     //this.router.on('changeChart', this._onRouterChangeChart, this);

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

     */
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