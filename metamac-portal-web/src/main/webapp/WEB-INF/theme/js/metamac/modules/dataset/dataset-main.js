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

        initialize : function (options) {
            var self = this;

            options = _.defaults(options, this._defaultOptions);

            self.attributes = options.attributes;


            //TODO mock hierarhcy!!
//            options.dataset.metadata.dimension.representation.hierarchy = {
//                "CATEGORIA" : {
//                    "008" : "007",
//                    "009" : "007",
//                    "00A" : "008"
//                }
//            };

            self.metadata = new App.dataset.Metadata(options.dataset);
            self.filterOptions = new App.widget.FilterOptions({metadata : self.metadata});

            //var veElementTable = Modernizr.canvas ? "canvasTable" : "table";
            var veElementTable = "canvasTable";
            var veElements = [veElementTable, "column", "line"];
            if (self.metadata.metadata.geographicalCoverage) {
                veElements.push("map");
            }

            self.filterOptionsByType = _.chain(veElements)
                .map(function (veElement) {
                    var veElementFilterOptions = new App.widget.FilterOptions({metadata : self.metadata});
                    return [veElement, veElementFilterOptions];
                })
                .object()
                .value();
            this._setInitialFilterRestrictions();

            self.dataset = new App.dataset.Dataset({metadata : self.metadata, filterOptions : this.filterOptions});


            if (options.showPage) {
                self.pageView = new App.modules.dataset.PageView({
                    el : options.el,
                    metadata : self.metadata,
                    attributes : self.attributes
                });
            } else {
                self.pageView = new App.modules.dataset.DatasetWidgetPageView({
                    el : options.el,
                    metadata : self.metadata,
                    attributes : self.attributes,
                    showOptions : options.showOptions,
                    showExport : options.showExport
                });
            }

            self.pageView.render();

            self.optionsModel = new App.modules.dataset.OptionsModel();

            var exportViewEl = self.pageView.$el.find('.dataset-export');
            self.exportView = new App.modules.dataset.ExportView({el : exportViewEl, model : self.optionsModel});
            self.exportView.render();

            self.permalinkBuilder = new App.modules.dataset.PermalinkBuilder({
                filterOptions : self.filterOptions,
                optionsModel : self.optionsModel
            });

            var actions$el = self.pageView.$el.find(".dataset-header-actions");
            self.datasetActionsView = new App.modules.dataset.DatasetActionsView({
                el : actions$el,
                filterOptions : self.filterOptions,
                permalinkBuilder : self.permalinkBuilder
            });
            self.datasetActionsView.render();

            self.router = new App.modules.dataset.Router({ defaultType : veElementTable });

            self.exporter = new App.svg.Exporter();

            // sidebar - infoview
            self.infoView = new App.modules.dataset.DatasetInfoView({
                dataset : self.dataset,
                datasetAttributes : self.attributes
            });

            // sidebar - filter
            self.filterSidebarView = new App.widget.filter.sidebar.FilterSidebarView({
                filterOptions : self.filterOptions,
                optionsModel : self.optionsModel
            });

            self.orderSidebarView = new App.widget.filter.sidebar.OrderSidebarView({
                filterOptions : self.filterOptions,
                optionsModel : self.optionsModel
            });

            // visualization
            self.visualizationView = new App.modules.dataset.DatasetVisualizationView({
                dataset : self.dataset,
                filterOptions : self.filterOptions,
                optionsModel : self.optionsModel,
                veElements : veElements
            });

            // sideview
            var sideViews = [self.infoView, self.filterSidebarView, self.orderSidebarView];
            var $sidebarContainer = self.pageView.$el.find(".dataset-sidebar-visualization-container");
            this.sidebarView = new App.components.sidebar.SidebarView({el : $sidebarContainer, sideViews : sideViews, contentView : self.visualizationView});
            this.sidebarView.render();
            this.sidebarView.state.toggleSideView("filterSidebar");

            // FullScreen
            self.fullScreen = new App.FullScreen({container : $sidebarContainer});

            self.visualizationView.on("enterFullScreen", function () {
                self.fullScreen.enterFullScreen();
            });

            self.visualizationView.on("exitFullScreen", function () {
                self.fullScreen.exitFullScreen();
            });

            self.fullScreen.on('didEnterFullScreen', function () {
                self.visualizationView._didEnterFullScreen();
                self.optionsModel.set('fullScreen', true);
                App.track({event : 'dataset.fullScreen.open', datasetUri : self.metadata.getUri() });
            });

            self.fullScreen.on('didExitFullScreen', function () {
                self.visualizationView._didExitFullScreen();
                self.optionsModel.set('fullScreen', false);
                App.track({event : 'dataset.fullScreen.close', datasetUri : self.metadata.getUri() });
            });


            /*-------------------------------------------------
             * Events
             * --------------------------------------------- */
            self.filterOptions.on('change reset', function () {
                self.datasetActionsView.render();
            });

            self.optionsModel.on('change:type', function (model, type) {
                self.datasetActionsView.render();
                App.track({event : 'dataset.view', veType : type, datasetUri : self.metadata.getUri() });
            });

            self.router.on('changeChart', function (options) {
                if (options.selection) {
                    var permalink = new App.modules.dataset.DatasetPermalink({identifier : options.selection});
                    var request = permalink.fetch();

                    request.success(function () {
                        var content = JSON.parse(permalink.get('content'));
                        self.filterOptionsByType[options.type].importSelection(content);
                        self.optionsModel.set('type', options.type);
                    });
                } else {
                    self.optionsModel.set('type', options.type);
                }
            });

            self.optionsModel.on('change', function () {
                self.exportView.render();
            });

            self.optionsModel.on('change:type', function (model, type) {
                self.router.navigate("type/" + type);
                var oldType = model.previousAttributes().type;
                if (oldType) {
                    self.filterOptionsByType[oldType].reset(self.filterOptions, true);
                }
                self.filterOptions.reset(self.filterOptionsByType[type], false);
                self.dataset.data.updateFilterOptions();
                self.visualizationView.loadVisualElement(type);
            });

            self.exportView.on('export', function (params) {
                var svg = self.pageView.$el.find("svg").get(0);
                self.exporter.processSvgElement(svg, params.type);
            });

            App.modules.signin.SigninView.prototype.redirectUrl = function () {
                return self.permalinkBuilder.createPermalink({relative : true});
            };

            $(function () {
                Backbone.history.start();
            });

        },

        _setInitialFilterRestrictions : function () {
            this.filterOptionsByType.line.setZoneLengthRestriction({left : {value : 1, preferedType : "TIME_DIMENSION"}, top : 1});
            this.filterOptionsByType.column.setSelectedCategoriesRestriction({horizontal : 5, columns : 10});
        }

    };


}());