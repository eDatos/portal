(function () {
    "use strict";

    App.namespace("App.VisualElement.CanvasTable");

    App.VisualElement.CanvasTable = function (options) {
        this.el = options.el;
        this.dataset = options.dataset;

        //this.filterOptions = options.filterOptions; //deprecated

        this.filterDimensions = options.filterDimensions;

        this._chartOptions = {
            title : {

            },
            columnTop : {
                dimensions : []
            },
            columnLeft : {
                dimensions : []
            },
            fixedDimensions : {}
        };

        this._type = 'canvasTable';
    };

    App.VisualElement.CanvasTable.prototype = {

        load : function () {
            this.$el = $(this.el);
            this.render();
            this._bindEvents();
        },

        destroy : function () {
            this.tableScrollManager.destroy();
            this.keyboardManager.destroy();

            this.tableScrollManager = null;
            this.keyboardManager = null;

            this.dataSource = null;
            this.delegate = null;

            this.view = null;

            this._unbindEvents();
        },

        _bindEvents : function () {
            this.listenTo(this.dataset.data, "hasNewData", this.hasNewData);
            var debouncedUpdate = _.debounce(_.bind(this.update, this), 20);
            this.listenTo(this.filterDimensions, "change:selected change:zone", debouncedUpdate);

            var resize = _.debounce(_.bind(this._updateSize, this), 200);
            this.$el.on("resize", function (e) {
                e.stopPropagation();
                resize();
            });
        },

        _unbindEvents : function () {
            this.stopListening();
            this.$el.off("resize");
        },

        updatingDimensionPositions : function () {
            this.filterDimensions.zones.get('left').unset('fixedSize');
            this.filterDimensions.zones.get('top').unset('fixedSize');


            // TODO
            //this.filterOptions.setZoneLengthRestriction({left : -1, top : -1});
            //this.filterOptions.setSelectedCategoriesRestriction({left : -1, top : -1});
        },

        updateTitle : function () {
            if(this.$title) {
                this.$title.remove();
            }
            var title = this.getTitle();

            this.$title = $("<h3>" + title + "</h3>");
            this.$el.prepend(this.$title);
        },

        render : function () {
            this.dataSource = new App.DataSourceDataset({dataset : this.dataset, filterDimensions : this.filterDimensions});
            this.delegate = new App.Table.Delegate();

            this.$el.empty();
            this.updateTitle();

            var containerDimensions = this.containerDimensions();

            this.$canvas = $('<canvas width="' + containerDimensions.width + '" height="' + containerDimensions.height + '"></canvas>');

            this.$el.append(this.$canvas);

            this.view = new App.Table.View({
                canvas : this.$canvas[0],
                dataSource : this.dataSource,
                delegate : this.delegate
            });

            this.tableScrollManager = new App.Table.ScrollManager(this.view);
            this.keyboardManager = new App.Table.KeyboardManager({view : this.view });

            this.view.repaint();
        },

        hasNewData : function () {
            if (this.view) {
                this.view.forceRepaintBody();
            }
        },

        update : function () {
            this.updateTitle();
            this.view.update();
            this._updateSize();
        },

        containerDimensions : function () {
            var titleHeight = this.$title.height();
            return {
                width : this.$el.width(),
                height : this.$el.height() - titleHeight
            };
        },

        resizeFullScreen : function () {
            this._updateSize();
        },

        _updateSize : function () {
            var containerDimensions = this.containerDimensions();
            this.view.resize(containerDimensions);
        }

    };

    _.extend(App.VisualElement.CanvasTable.prototype, Backbone.Events);
    _.defaults(App.VisualElement.CanvasTable.prototype, new App.VisualElement.Base());

}());
