(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.VisualElement.CanvasTable");

    STAT4YOU.VisualElement.CanvasTable = function (options) {
        this.el = options.el;
        this.dataset = options.dataset;
        this.filterOptions = options.filterOptions;

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

    STAT4YOU.VisualElement.CanvasTable.prototype = {

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
            this.listenTo(this.filterOptions, "change", this.update);

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
            this.filterOptions.setZoneLengthRestriction({left : -1, top : -1});
            this.filterOptions.setSelectedCategoriesRestriction({left : -1, top : -1});
        },

        render : function () {
            this.dataSource = new STAT4YOU.DataSourceDataset({dataset : this.dataset, filterOptions : this.filterOptions});
            this.delegate = new STAT4YOU.Table.Delegate();

            this.$el.empty();

            var title = this.getTitle();
            this.$title = $("<h3>" + title + "</h3>");
            this.$el.append(this.$title);

            var containerDimensions = this.containerDimensions();

            this.$canvas = $('<canvas width="' + containerDimensions.width + '" height="' + containerDimensions.height + '"></canvas>');


            this.$el.append(this.$canvas);

            this.view = new STAT4YOU.Table.View({
                canvas : this.$canvas[0],
                dataSource : this.dataSource,
                delegate : this.delegate
            });

            this.tableScrollManager = new STAT4YOU.Table.ScrollManager(this.view);
            this.keyboardManager = new STAT4YOU.Table.KeyboardManager({view : this.view });

            this.view.repaint();
        },

        hasNewData : function () {
            if (this.view) {
                this.view.forceRepaintBody();
            }
        },

        update : function () {
            this.filterOptions._initializeTableInfo();
            this.view.update();
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

    _.extend(STAT4YOU.VisualElement.CanvasTable.prototype, Backbone.Events);
    _.defaults(STAT4YOU.VisualElement.CanvasTable.prototype, new STAT4YOU.VisualElement.Base());

}());
