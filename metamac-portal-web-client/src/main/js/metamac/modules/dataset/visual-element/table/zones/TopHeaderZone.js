(function () {
    "use strict";

    var Size = App.Table.Size,
        Rectangle = App.Table.Rectangle,
        Utils = App.Table.Utils,
        Point = App.Table.Point;

    App.namespace("App.Table.TopHeaderZone");

    App.Table.TopHeaderZone = function (options) {
        App.Table.Zone.prototype.initialize.apply(this, arguments);
        this.initialize(options);
    };

    _.extend(App.Table.TopHeaderZone.prototype, App.Table.Zone.prototype);

    App.Table.TopHeaderZone.prototype.initialize = function (options) {
        if (!options) {
            options = {};
        }
        this.bodyZone = options.bodyZone;
        this.dataSource = options.dataSource;
        this.delegate = options.delegate;
        this.view = options.view;
        this.calculateIncrementalSize();
    };

    App.Table.TopHeaderZone.prototype.calculateIncrementalSize = function () {
        if (this.dataSource && this.delegate) {
            var self = this;
            var rowsLen = this.dataSource.topHeaderRows();

            var rows = Utils.acumulate(rowsLen, function (row) {
                return self.delegate.topHeaderRowHeight(row, self.view);
            });

            this.incrementalCellSize = {
                rows : rows,
                columns : this.bodyZone.incrementalCellSize.columns
            };

            var heightTotal = rows[rows.length - 1];
            var widthTotal = this.bodyZone.size.width;

            this.setSize(new Size(widthTotal, heightTotal));
        }
    };

    App.Table.TopHeaderZone.prototype.paintInfo = function () {
        var bodyPaintInfo = this.bodyZone.paintInfo();

        var rowsLen = this.dataSource.topHeaderRows();
        var rowsValues = this.dataSource.topHeaderValues();
        var tooltipValues = this.dataSource.topHeaderTooltipValues();

        var rowsValuesLength = _.map(rowsValues, function (rowValue) {
            return rowValue.length;
        });

        var rowsValuesLengthAc = Utils.rightProductAcumulate(rowsValuesLength);

        var result = [];

        for (var i = 0; i < rowsLen; i++) {
            result[i] = [];
            var cellHeight = this.delegate.topHeaderRowHeight(i, this.view);
            var cellY = this.incrementalCellSize.rows[i];

            for (var j = 0; j < bodyPaintInfo.columns.length; j++) {
                var column = bodyPaintInfo.columns[j];

                var indexInValue = Math.floor(column.index / rowsValuesLengthAc[i]);
                var index = indexInValue * rowsValuesLengthAc[i];
                if (result[i].length === 0 || _.last(result[i]).index != index) {
                    var cellX = this.incrementalCellSize.columns[index] - this.bodyZone.origin.x + this.viewPort.x;

                    var indexEnd = index + rowsValuesLengthAc[i];
                    var cellWidth = this.incrementalCellSize.columns[indexEnd] - this.incrementalCellSize.columns[index];

                    var column = indexInValue % rowsValuesLength[i];
                    var content = rowsValues[i][column];

                    var cellAttributes =  tooltipValues[i][column] ? !_.isEmpty(tooltipValues[i][column].attributes) ? tooltipValues[i][column].attributes : [] : [];
                    var cellTitle = tooltipValues[i][column] ? tooltipValues[i][column].title : "";


                    result[i].push({
                        index : index,
                        indexEnd : indexEnd,
                        height : cellHeight,
                        y : cellY,
                        x : cellX,
                        width : cellWidth,
                        content : content,
                        tooltip : cellTitle,
                        attributes : cellAttributes
                    });
                }
            }
        }
        this.lastPaintInfo = result;
        return result;
    };

    App.Table.TopHeaderZone.prototype.cellAtPoint = function (absolutePoint) {
        // Optimizable no buscando por todas las celdas, sino buscar por columnas
        return _.find(_.flatten(this.lastPaintInfo, true), function (headerCell) {
            var rect = new Rectangle(headerCell.x, headerCell.y, headerCell.width, headerCell.height);
            return rect.containsPoint(absolutePoint);
        });
    }

    App.Table.TopHeaderZone.prototype.titleAtPoint = function (absolutePoint) {
        var headerCellAtPoint = this.cellAtPoint(absolutePoint);
        if (headerCellAtPoint) {
            return this.delegate.formatHeaderInfo({ 
                title : headerCellAtPoint.tooltip, 
                attributes : headerCellAtPoint.attributes
            });
        }
    };

    App.Table.TopHeaderZone.prototype.columnsAtPoint = function (absolutePoint) {
        var headerCellAtPoint = this.cellAtPoint(absolutePoint);
        if (headerCellAtPoint) {
            return _.range(headerCellAtPoint.index, headerCellAtPoint.indexEnd);
        }
    };

    App.Table.TopHeaderZone.prototype.repaint = function () {
        this.clear();
        this.paintShadow();

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width, this.viewPort.height);
        this.ctx.clip();

        var paintInfo = this.paintInfo();
        this.paintCells(paintInfo);
        this.paintGrid();
        this.ctx.restore();

        this.needRepaint = false;
    };

    App.Table.TopHeaderZone.prototype.paintShadow = function () {
        if (this.delegate.style.headerCell.shadow.show && this.bodyZone.origin.y !== 0) {
            this.ctx.save();

            this.ctx.beginPath();
            this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width + 0.5, this.viewPort.height + 30);
            this.ctx.clip();

            this.ctx.beginPath();
            this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width, this.viewPort.height + 0.5);
            this.ctx.shadowColor = this.delegate.style.headerCell.shadow.color;
            this.ctx.shadowBlur = this.delegate.style.headerCell.shadow.blur;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = this.delegate.style.headerCell.shadow.offset;
            this.ctx.fill();

            this.ctx.restore();
        }
    };

    App.Table.TopHeaderZone.prototype.paintGrid = function () {
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.rect(this.viewPort.x + 0.5, this.viewPort.y + 0.5, this.viewPort.width - 1, this.viewPort.height + 0.5);

        this.ctx.strokeStyle = this.delegate.style.headerCell.border.color;
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    };

    App.Table.TopHeaderZone.prototype.paintCells = function (paintInfo) {
        this.ctx.save();

        this.ctx.lineWidth = this.delegate.style.headerCell.border.width;
        this.ctx.strokeStyle = this.delegate.style.headerCell.border.color;
        this.ctx.font = this.delegate.style.headerCell.font;
        this.ctx.textBaseline = "middle";
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
                    var current = { columns : _.range(cell.index, cell.indexEnd) };
                    bgColor = this.delegate.style.headerCell.background(current, this.view);
                } else {
                    bgColor = this.delegate.style.headerCell.background;
                }

                this.ctx.fillStyle = bgColor;
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.fillStyle = this.delegate.style.headerCell.color;
                this.ctx.fillText(cell.content || "", cell.x + margin, Math.ceil(cell.y + cell.height / 2));

                if (cell.attributes != "") {
                    this.ctx.beginPath();                  
                    var marginMark = this.delegate.style.attributeCellMark.margin;
                    var sizeMark = this.delegate.style.attributeCellMark.size;              
                    this.ctx.moveTo(cell.x + cell.width - marginMark, cell.y + cell.height - marginMark);
                    this.ctx.lineTo(cell.x + cell.width - marginMark - sizeMark, cell.y + cell.height - marginMark);
                    this.ctx.lineTo(cell.x + cell.width - marginMark, cell.y + cell.height - marginMark - sizeMark);
                    this.ctx.fillStyle = this.delegate.style.attributeCellMark.background;
                    this.ctx.fill();
                    this.ctx.closePath();
                }   

                this.ctx.restore();
            }
        }
        this.ctx.restore();
    };

    App.Table.TopHeaderZone.prototype.separatorIndexInRectangle = function (rectangle) {
        if (!this.lastPaintInfo) {
            this.paintInfo();
        }
        var lastRowPaintInfo = _.last(this.lastPaintInfo);

        for (var i = 0; i < lastRowPaintInfo.length; i++) {
            var cellPaintInfo =  lastRowPaintInfo[i];
            if (rectangle.containsPoint(new Point(cellPaintInfo.x, rectangle.y))) {
                return cellPaintInfo.index;
            } else if (rectangle.containsPoint(new Point(cellPaintInfo.x + cellPaintInfo.width, rectangle.y))) {
                return cellPaintInfo.indexEnd;
            }
        }
    }

}());