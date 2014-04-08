(function () {
    "use strict";

    var Size = App.Table.Size,
        Rectangle = App.Table.Rectangle,
        Utils = App.Table.Utils,
        Point = App.Table.Point;

    App.namespace("App.Table.LeftHeaderZone");

    App.Table.LeftHeaderZone = function (options) {
        App.Table.Zone.prototype.initialize.apply(this, arguments);
        this.initialize(options);
    };

    _.extend(App.Table.LeftHeaderZone.prototype, App.Table.Zone.prototype);

    App.Table.LeftHeaderZone.prototype.initialize = function (options) {
        if (!options) {
            options = {};
        }
        this.bodyZone = options.bodyZone;
        this.dataSource = options.dataSource;
        this.delegate = options.delegate;
        this.view = options.view;
        this.calculateIncrementalSize();
    };

    App.Table.LeftHeaderZone.prototype.calculateIncrementalSize = function () {
        if (this.dataSource && this.delegate) {
            var self = this;
            var columnsLen = this.dataSource.leftHeaderColumns();

            var columns = Utils.acumulate(columnsLen, function (column) {
                return self.delegate.leftHeaderColumnWidth(column, self.view);
            });

            this.incrementalCellSize = {
                rows : this.bodyZone.incrementalCellSize.rows,
                columns : columns
            };

            var widthTotal = columns[columns.length - 1];
            var heightTotal = this.bodyZone.size.height;


            this.setSize(new Size(widthTotal, heightTotal));
        }
    };

    App.Table.LeftHeaderZone.prototype.paintInfo = function () {
        var bodyPaintInfo = this.bodyZone.paintInfo();

        var columnsLen = this.dataSource.leftHeaderColumns();
        var columnsValues = this.dataSource.leftHeaderValues();
        var tooltipValues = this.dataSource.leftHeaderTooltipValues();

        var columnsValuesLength = _.map(columnsValues, function (columnValue) {
            return columnValue.length;
        });

        //TODO esto puede que no sea necesario hacerlo cada vez?
        var columnsValuesLengthAc = Utils.rightProductAcumulate(columnsValuesLength);

        var result = [];

        for (var i = 0; i < columnsLen; i++) {
            result[i] = [];
            var cellWidth = this.delegate.leftHeaderColumnWidth(i, this.view);
            var cellX = this.incrementalCellSize.columns[i];

            for (var j = 0; j < bodyPaintInfo.rows.length; j++) {
                var row = bodyPaintInfo.rows[j];

                var indexInValue = Math.floor(row.index / columnsValuesLengthAc[i]);
                var index = indexInValue * columnsValuesLengthAc[i];
                if (result[i].length === 0 || _.last(result[i]).index != index) {
                    var cellY = this.incrementalCellSize.rows[index] - this.bodyZone.origin.y + this.viewPort.y;

                    var indexEnd = index + columnsValuesLengthAc[i];
                    var cellHeight = this.incrementalCellSize.rows[indexEnd] - this.incrementalCellSize.rows[index];

                    var row = indexInValue % columnsValuesLength[i];
                    var content = columnsValues[i][row];

                    result[i].push({
                        index : index,
                        indexEnd : indexEnd,
                        height : cellHeight,
                        y : cellY,
                        x : cellX,
                        width : cellWidth,
                        content : content,
                        tooltip : tooltipValues[i][row]
                    });
                }
            }
        }

        this.lastPaintInfo = result;
        return result;
    };

    App.Table.LeftHeaderZone.prototype.cellAtPoint = function (absolutePoint) {
        // TODO Optimizable no buscando por todas las celdas, sino buscar por columnas
        return _.find(_.flatten(this.lastPaintInfo, true), function (headerCell) {
            var rect = new Rectangle(headerCell.x, headerCell.y, headerCell.width, headerCell.height);
            return rect.containsPoint(absolutePoint);
        });
    }

    App.Table.LeftHeaderZone.prototype.titleAtPoint = function (absolutePoint) {
        var headerCellAtPoint = this.cellAtPoint(absolutePoint);
        if(headerCellAtPoint) {
            return headerCellAtPoint.tooltip
        }
    };

    App.Table.LeftHeaderZone.prototype.rowsAtPoint = function (absolutePoint) {
        var headerCellAtPoint = this.cellAtPoint(absolutePoint);
        if(headerCellAtPoint) {
            return _.range(headerCellAtPoint.index, headerCellAtPoint.indexEnd);
        }
    };
    
    App.Table.LeftHeaderZone.prototype.rowsCellsAtPoint = function (absolutePoint) {
        var headerCellAtPoint = this.cellAtPoint(absolutePoint);
        if(headerCellAtPoint) {
            return _.range(headerCellAtPoint.index - this.dataSource.blankRowsOffset(headerCellAtPoint.index), 
            			   headerCellAtPoint.indexEnd - this.dataSource.blankRowsOffset(headerCellAtPoint.index));
        }
    };


    App.Table.LeftHeaderZone.prototype.repaint = function () {
        this.clear();

        this.paintShadow();
        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width + 0.5, this.viewPort.height);
        this.ctx.clip();

        var paintInfo = this.paintInfo();
        this.paintCells(paintInfo);
        this.paintBorders();

        this.ctx.restore();
        this.needRepaint = false;
    };

    App.Table.LeftHeaderZone.prototype.paintShadow = function () {
        if(this.delegate.style.headerCell.shadow.show && this.bodyZone.origin.x !== 0){
            this.ctx.save();

            this.ctx.beginPath();
            this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width + 0.5 + 30, this.viewPort.height);
            this.ctx.clip();

            this.ctx.beginPath();
            this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width, this.viewPort.height);
            this.ctx.shadowColor = this.delegate.style.headerCell.shadow.color;
            this.ctx.shadowBlur = this.delegate.style.headerCell.shadow.blur;
            this.ctx.shadowOffsetX = this.delegate.style.headerCell.shadow.offset;
            this.ctx.shadowOffsetY = 0;
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    App.Table.LeftHeaderZone.prototype.paintBorders = function () {
        var columnsLen = this.dataSource.leftHeaderColumns();
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.rect(this.viewPort.x + 0.5, this.viewPort.y + 0.5, this.viewPort.width, this.viewPort.height - 1);

        this.ctx.strokeStyle = this.delegate.style.headerCell.border.color;
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    };

    App.Table.LeftHeaderZone.prototype.paintCells = function (paintInfo) {
        this.ctx.save();

        this.ctx.lineWidth = this.delegate.style.headerCell.border.width;
        this.ctx.strokeStyle = this.delegate.style.headerCell.border.color;
        this.ctx.font = this.delegate.style.headerCell.font;
        this.ctx.textBaseline = "top";
        this.ctx.textAlign = "left";

        var margin = this.delegate.style.headerCell.margin.left;
        var bgColor;

        for (var i = 0; i < paintInfo.length; i++) {
            var row = paintInfo[i];

            for (var j = 0; j < row.length; j++) {
                var cell = row[j];

                this.ctx.save();

                this.ctx.beginPath();
                this.ctx.rect(cell.x, cell.y, cell.width + 0.5, cell.height + 0.5);
                this.ctx.clip();

                this.ctx.beginPath();
                this.ctx.rect(cell.x + 0.5, cell.y + 0.5, cell.width, cell.height);

                if (_.isFunction(this.delegate.style.headerCell.background)) {
                    var current = { rows : _.range(cell.index, cell.indexEnd) };
                    bgColor = this.delegate.style.headerCell.background(current, this.view);
                } else {
                    bgColor = this.delegate.style.headerCell.background;
                }

                this.ctx.fillStyle = bgColor;

                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.closePath();

                this.ctx.fillStyle = this.delegate.style.headerCell.color;
                this.ctx.fillText(cell.content || "", cell.x + margin, cell.y + margin);

                this.ctx.restore();
            }
        }
        this.ctx.restore();
    };

    App.Table.LeftHeaderZone.prototype.separatorIndexInRectangle = function (rectangle) {
        for (var i = 0; i < this.incrementalCellSize.columns.length; i++) {
            var incrementalColumnSize =  this.incrementalCellSize.columns[i];
            if (rectangle.containsPoint(new Point(incrementalColumnSize + this.viewPort.x, rectangle.y))) {
                return i;
            }
        }
    }

}());