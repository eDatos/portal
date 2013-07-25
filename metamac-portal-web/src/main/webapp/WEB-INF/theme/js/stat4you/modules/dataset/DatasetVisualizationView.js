(function () {
    "use strict";

    STAT4YOU.namespace("App.modules.dataset");

    App.modules.dataset.DatasetVisualizationView = Backbone.View.extend({

        template : App.templateManager.get("dataset/dataset-visualization"),

        initialize : function (options) {
            this.container = options.container;
            this.dataset = options.dataset;
            this.filterOptions = options.filterOptions;
            this.optionsModel = options.optionsModel;
            this.veElements = options.veElements;
        },

        _initializeVisualElements : function () {
            var options = {
                el : this.$(".dataset-visualization-visual-element"),
                dataset : this.dataset,
                filterOptions : this.filterOptions,
                animation : this.options.animation
            };
            this.ve = {
                //table : new STAT4YOU.VisualElement.Table(options),
                column : new STAT4YOU.VisualElement.ColumnChart(options),
                pie : new STAT4YOU.VisualElement.PieChart(options),
                line : new STAT4YOU.VisualElement.LineChart(options),
                canvasTable : new STAT4YOU.VisualElement.CanvasTable(options),
                map : new STAT4YOU.VisualElement.Map(options)
            };
            this.ve.map.on('didLoadVe', this._hideSpinner, this);
        },

        _initializeFullScreen : function () {
//            this.fullScreen = new STAT4YOU.FullScreen({container : this.$el});
//            this.fullScreen.on('willEnterFullScreen', this._willEnterFullScreen, this);
//            this.fullScreen.on('didEnterFullScreen', this._didEnterFullScreen, this);
//            this.fullScreen.on('willExitFullScreen', this._willExitFullScreen, this);
//            this.fullScreen.on('didExitFullScreen', this._didExitFullScreen, this);
        },

        _showSpinner : function () {
            var img = STAT4YOU.resourceContext + "images/loadingSpinner.gif";
            this.$dataSpinner = $("<div class='spinner'><img src='" + img + "'/></div>");

            var $container = this.$el;
            var top = $container.height() / 2 - this.$dataSpinner.height() / 2;
            var left = $container.width() / 2 - this.$dataSpinner.width() / 2;

            this.$dataSpinner.css({top : top, left : left});
            $container.prepend(this.$dataSpinner);
        },

        _hideSpinner : function () {
            if (this.$dataSpinner) {
                this.$dataSpinner.remove();
                this.$dataSpinner = null;
            }
        },

        loadVisualElement : function (element) {
            var oldElement = this.currentElement;
            this._removeCurrentElement();
            this.currentElement = element;

            this.ve[this.currentElement].updatingDimensionPositions(oldElement);
            this.ve[this.currentElement].load();
        },

        load : function () {
            this.loadVisualElement(this.currentElement);
        },

        _removeCurrentElement : function () {
            var currentVe = this._getCurrentVe();
            if (currentVe) {
                currentVe.destroy();
                this.$(".dataset-visualization-visual-element").empty();
            }
        },

        _getCurrentVe : function () {
            if (this.currentElement) {
                return this.ve[this.currentElement];
            }
        },

        enterFullScreen : function () {
            this.trigger("enterFullScreen");
            //this.fullScreen.enterFullScreen();
        },

        exitFullScreen : function () {
            this.trigger("exitFullScreen");
            //this.fullScreen.exitFullScreen();
        },

        _willEnterFullScreen : function () {
            //$(this._options.container.vecontainer).hide();
            this.trigger('willEnterFullScreen');
        },

        _didEnterFullScreen : function () {
            //$(this._options.container.vecontainer).show();

            var currentVe = this._getCurrentVe();
            currentVe.resizeFullScreen();
            this.trigger('didEnterFullScreen');
        },

        _willExitFullScreen : function () {
            //$(this._options.container.vecontainer).hide();
            this.trigger('willExitFullScreen');
        },

        _didExitFullScreen : function () {
            //$(this._options.container.vecontainer).show();
            var currentVe = this._getCurrentVe();
            currentVe.resizeFullScreen();
            this.trigger('didExitFullScreen');
        },

        render : function () {
            var context = {};
            this.$el.html(this.template(context));

            this._initializeVisualElements();
            this._initializeFullScreen();

            this.optionsView = new STAT4YOU.modules.dataset.OptionsView({
                optionsModel : this.optionsModel,
                el : this.$(".dataset-visualization-options-bar"),
                buttons : this.veElements
            });

            this.optionsView.render();
            this.optionsView.on("launchFullScreen", this.enterFullScreen, this);
            this.optionsView.on("exitFullScreen", this.exitFullScreen, this);
        }

    });

}());
