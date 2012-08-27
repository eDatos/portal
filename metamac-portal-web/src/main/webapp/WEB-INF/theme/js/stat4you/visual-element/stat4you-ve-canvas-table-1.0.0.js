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

        // Filter
//        this._filter = new STAT4YOU.Filters.TableFilter();

        this._type = 'canvasTable';

        //Title aux var
        this.fixedIndexesForTitle = [];
    };

    STAT4YOU.VisualElement.CanvasTable.prototype = {

        load : function () {
            this.$el = $(this.el);
            this.initCanvas();

            this.dataset.data.on("hasNewData", this.hasNewData, this);
        },

        destroy : function () {
            this.tableScrollManager.destroy();
            this.keyboardManager.destroy();

            this.tableScrollManager = null;
            this.keyboardManager = null;

            this.dataSource = null;
            this.delegate = null;

            this.view = null;

            this.dataset.data.off("hasNewData", this.hasNewData, this);
        },

        updatingDimensionPositions : function () {
            this.filterOptions.setSelectedCategoriesRestriction({left : -1, top : -1});
        },

        initCanvas : function () {
            this.dataSource = new STAT4YOU.DataSourceDataset({dataset : this.dataset, filterOptions : this.filterOptions});
            this.delegate = new STAT4YOU.Table.Delegate();

            var containerDimensions = this.containerDimensions();

            var title = this.getTitle();
            this.$title = $("<h3>" + title + "</h3>");
            this.$canvas = $('<canvas width="' + containerDimensions.width + '" height="' + containerDimensions.height + '"></canvas>');

            this.$el.empty();
            this.$el.append(this.$title);
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
            if(this.view){
                this.view.forceRepaintBody();
            }
        },

        update : function () {
            this.destroy();
            this.load();
        },

        containerDimensions : function () {
            var titleHeight = 27;
            var titleMargin = 10;
            return {
                width : this.$el.width(),
                height : this.$el.height() - titleHeight - titleMargin
            };
        },

        resizeFullScreen : function () {
            var containerDimensions = this.containerDimensions();
            this.view.resize(containerDimensions);
        }

    };

    _.defaults(STAT4YOU.VisualElement.CanvasTable.prototype, new STAT4YOU.VisualElement.Base());

}());
