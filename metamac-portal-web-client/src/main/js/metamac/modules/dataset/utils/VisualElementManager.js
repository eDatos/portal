(function () {
    "use strict";

    App.namespace("App.VisualElementManager");

    App.VisualElementManager = function (options) {
        this._initialize(options);
    };

    App.VisualElementManager.prototype = {

        _initialize : function (options) {
            this._options = options;
            this.container = options.container;
            this.dataset = options.dataset;
            this.filterOptions = options.filterOptions;

            this._initializeVisualElements();
            this._initializeFullScreen();
        },

        _initializeVisualElements : function () {
            var options = {
                el : this._options.container.vecontainer,
                dataset : this.dataset,
                filterOptions : this.filterOptions,
                animation : this._options.animation,
                optionsModel : this.optionsModel
            };
            this.ve = {
                info : new App.VisualElement.Info(options),
                column : new App.VisualElement.ColumnChart(options),
                pie : new App.VisualElement.PieChart(options),
                line : new App.VisualElement.LineChart(options),
                table : new App.VisualElement.Table(options),
                map : new App.VisualElement.Map(options)
            };
            this.ve.map.on('didLoadVe', this._hideSpinner, this);
        },

        _initializeFullScreen : function () {
            this.fullScreen = new App.FullScreen({container : this.container.external});
            this.fullScreen.on('willEnterFullScreen', this._willEnterFullScreen, this);
            this.fullScreen.on('didEnterFullScreen', this._didEnterFullScreen, this);
            this.fullScreen.on('willExitFullScreen', this._willExitFullScreen, this);
            this.fullScreen.on('didExitFullScreen', this._didExitFullScreen, this);
        },

        _showSpinner : function () {
            var img = App.resourceContext + "images/loadingSpinner.gif";
            this.$dataSpinner = $("<div class='spinner'><img src='" + img + "'/></div>");

            var $container = $(this._options.container.vecontainer);
            var top = $container.height() / 2 - this.$dataSpinner.height() / 2;
            var left = $container.width() / 2 - this.$dataSpinner.width() / 2;

            this.$dataSpinner.css({top : top, left : left});
            $container.append(this.$dataSpinner);
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
            this._showSpinner();
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
                $(this.container.vecontainer).empty();
            }
        },

        _getCurrentVe : function () {
            if (this.currentElement) {
                return this.ve[this.currentElement];
            }
        },

        enterFullScreen : function () {
            this.fullScreen.enterFullScreen();
        },

        exitFullScreen : function () {
            this.fullScreen.exitFullScreen();
        },

        _willEnterFullScreen : function () {
            $(this._options.container.vecontainer).hide();
            this.trigger('willEnterFullScreen');
        },

        _didEnterFullScreen : function () {
            $(this._options.container.vecontainer).show();

            var currentVe = this._getCurrentVe();
            currentVe.resizeFullScreen();
            this.trigger('didEnterFullScreen');
        },

        _willExitFullScreen : function () {
            $(this._options.container.vecontainer).hide();
            this.trigger('willExitFullScreen');
        },

        _didExitFullScreen : function () {
            $(this._options.container.vecontainer).show();
            var currentVe = this._getCurrentVe();
            currentVe.resizeFullScreen();
            this.trigger('didExitFullScreen');
        }
    };

    _.extend(App.VisualElementManager.prototype, Backbone.Events);

}());
