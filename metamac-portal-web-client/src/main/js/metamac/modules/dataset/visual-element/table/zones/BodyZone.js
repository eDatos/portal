(function () {
    "use strict";

    var Cell = App.Table.Cell,
        Size = App.Table.Size,
        Point = App.Table.Point,
        Utils = App.Table.Utils,
        Rectangle = App.Table.Rectangle;

    App.namespace("App.Table.BodyZone");

    App.Table.BodyZone = function (options) {
        App.Table.Zone.prototype.initialize.apply(this, arguments);
        this.initialize(options);
    };

    App.Table.BodyZone.prototype = {
        initialize: function (options) {
            if (!options) {
                options = {};
            }
            this.dataSource = options.dataSource;
            this.delegate = options.delegate;
            this.view = options.view;
            this.ignoredValues = [];
            this.ignoredValuesHandlers = {
                'NULO': function(value) {
                    return (value == '' || value ==null) 
                },
                'CERO': function(value) {
                    return (typeof value == 'string') && parseFloat(value.replace(',','.')) == 0;
                }
            }
            this.calculateIncrementalSize();
        },

        // Calcula en que posición empieza cada una de las filas y columnas
        // y el tamaño total
        calculateIncrementalSize: function () {
            if (this.dataSource && this.delegate) {
                var self = this;
                var rowsLen = this.dataSource.rows(),
                    columnsLen = this.dataSource.columns();

                var rows = Utils.acumulate(rowsLen, function (row) {
                    return self.delegate.rowHeight(row);
                });
                var columns = Utils.acumulate(columnsLen, function (column) {
                    return self.delegate.columnWidth(column);
                });

                this.incrementalCellSize = {
                    rows: rows,
                    columns: columns
                };
            }
        },

        calculateDimensionsAndIgnoredCells: function() {
            var widthTotal = 0;
            var heightTotal = 0;
            this.ignoredCells = null;
            this.filteredRows = null;

            if (this.shouldIgnoreCells()) {
                var nColumns = this.dataSource.columns();
                var ignoredCells = {
                    columns: {},
                    rows: {}
                }
                var visibleRows = [];

                for (var c = 0; c < nColumns; c++) {
                    if (this.shouldIgnoreColumn(c)) {
                        ignoredCells.columns[c] = true;
                    }
                    else {
                        widthTotal += this.incrementalCellSize.columns[c + 1] - this.incrementalCellSize.columns[c]
                    }
                }

                var leftHeadersLengths = this.dataSource.leftHeaderDimensionsLengths();
                var rowsWithvalue = leftHeadersLengths.reduce(function(dimensionsRows, dimensionRows ){ return dimensionsRows * dimensionRows }, 1);
                for (var r = 0; r < rowsWithvalue; r++) {
                    if (this.shouldIgnoreRow(r)) {
                        ignoredCells.rows[r] = true;
                    }
                    else {
                        visibleRows.push(r);
                    }
                }
                this.ignoredCells = ignoredCells;
                
                var leftHeadersAc = Utils.rightProductAcumulate(leftHeadersLengths)
                var rowsTree = this.createRowsTree(visibleRows, leftHeadersLengths, leftHeadersAc);
                this.filteredRows = this.parseFilteredRows(rowsTree, leftHeadersLengths.length);
                heightTotal = this.incrementalCellSize.rows[this.filteredRows.length];
            }
            else {
                var columns = this.incrementalCellSize.columns;
                var rows = this.incrementalCellSize.rows;

                widthTotal = columns[columns.length - 1];
                heightTotal = rows[rows.length - 1];
            }
            this.setSize(new Size(widthTotal, heightTotal));
        },

        createRowsTree: function(finalLevelIndices, levelsLengths, levelsLengthsAc) {
            var rowsTree = {};
            for (var i = 0; i < finalLevelIndices.length; i++) {
                var finalLevelIndex = finalLevelIndices[i];
                var branch = rowsTree;
                for (var j = 0; j < levelsLengths.length - 1; j++) {
                    var levelIndex = Math.floor(finalLevelIndex / levelsLengthsAc[j]) % levelsLengths[j];
                    if (!branch.hasOwnProperty(levelIndex)) {
                        branch[levelIndex] = {}
                    }
                    branch = branch[levelIndex];
                }
                branch[finalLevelIndex % levelsLengths[ levelsLengths.length - 1]] = finalLevelIndex;
            }
            return rowsTree;
        },


        parseFilteredRows: function(rowsTree, numberLevels, rows, relativeIndex, rowLevel, absoluteIndexParent) {
            relativeIndex = relativeIndex || {value: 0};
            rowLevel = rowLevel || 0;
            rows = rows || [];
            absoluteIndexParent = absoluteIndexParent || 0;
            var self = this;

            Object.keys(rowsTree).forEach(function(rowKey) {
                rowKey = Number(rowKey);
                if (typeof rowsTree[rowKey] === 'object') {
                    var absoluteIndex = absoluteIndexParent + self.dataSource.leftHeaderDimensionsElements(rowLevel + 1) * rowKey + (rowLevel? 1 : 0)
                    rows.push({
                        relativeIndex: relativeIndex.value,
                        absoluteIndex: absoluteIndex,
                        indexCell: _.range(numberLevels - rowLevel).reduce(function(indexCell) {
                            return (typeof indexCell == 'object')? indexCell[Object.keys(indexCell)[0]] : indexCell;
                        }, rowsTree[rowKey]),
                        blank: true,
                        rowLevel: rowLevel
                    });
                    relativeIndex.value ++;
                    self.parseFilteredRows(rowsTree[rowKey], numberLevels, rows, relativeIndex, rowLevel + 1, absoluteIndex);

                }
                else {
                    rows.push({
                        relativeIndex: relativeIndex.value,
                        absoluteIndex: absoluteIndexParent + rowKey + 1,
                        indexCell: rowsTree[rowKey],
                        blank: false,
                        rowLevel: rowLevel
                    });
                    relativeIndex.value ++;
                }
            });

            return rows;
        },

        shouldIgnoreCells: function() {
            return this.ignoredValues && this.ignoredValues.length > 0;
        },

        // Calcula la primera celda visible (en la esquina superior izquierda)
        firstCell: function () {
            var x = Utils.floorIndex(this.incrementalCellSize.columns, this.origin.x),
                y = Utils.floorIndex(this.incrementalCellSize.rows, this.origin.y);
            return new Cell(x, y);
        },

        cell2AbsolutePoint: function (cell) {
            var x = this.incrementalCellSize.columns[cell.x],
                y = this.incrementalCellSize.rows[cell.y];
            return new Point(x, y);
        },

        cellAtPoint: function (point) {
            var iX = Utils.floorIndex(this.currentPaintInfo.columns.map(function(c) { return c.x}), point.x);
            var iY = Utils.floorIndex(this.currentPaintInfo.rows.map(function(r){return r.y}), point.y);

            var x = this.currentPaintInfo.columns[iX].index;
            var y = this.currentPaintInfo.rows[iY].indexCell;
            return new Cell(x, y);
        },

        cellSize: function (cell) {
            var width = this.delegate.columnWidth(cell.x);
            var height = this.delegate.rowHeight(cell.y);
            return new Size(width, height);
        },

        isCellVisible: function (cell) {
            if (!this.dataSource.cellExists(cell)) {
                return false;
            }
            var size = this.cellSize(cell);
            var topLeft = this.absolutePoint2RelativePoint(this.cell2AbsolutePoint(cell));

            var cellRectangle = new Rectangle(topLeft, size);
            return this.isRelativeRectangleVisible(cellRectangle);
        },

        visibleRowsAndColumns: function () {
            var xVisible = true,
                yVisible = true;
            var firstCell = this.firstCell();

            var xCell = firstCell.clone();
            while (xVisible) {
                xCell.x = xCell.x + 1;
                xVisible = this.isCellVisible(xCell);
            }

            var yCell = firstCell.clone();
            while (yVisible) {
                yCell.y = yCell.y + 1;
                yVisible = this.isCellVisible(yCell);
            }
            return {
                rows: {
                    begin: firstCell.y,
                    end: yCell.y
                },
                columns: {
                    begin: firstCell.x,
                    end: xCell.x
                }
            };
        },

        paintInfo: function () {
            var xVisible = true,
                yVisible = true;

            var totalRows = this.dataSource.rows();
            var totalColumns = this.dataSource.columns();

            var firstCell = this.firstCell();
            var firstCellPoint = this.absolutePoint2RelativePoint(this.cell2AbsolutePoint(firstCell));
            var firstCellSize = this.cellSize(firstCell);

            var columns = [], rows = [];

            var j = firstCell.x;
            var x = firstCellPoint.x;
            var size;

            while (xVisible && j < totalColumns) {
                if (this.ignoredCells && this.ignoredCells.columns.hasOwnProperty(j)) {
                    j++;
                    continue;
                }

                size = this.delegate.columnWidth(j);

                columns.push({
                    x: x,
                    index: j,
                    width: size
                });

                j = j + 1;
                x = x + size;

                xVisible = this.isRelativeRectangleVisible(new Rectangle(x, firstCellPoint.y, size, firstCellSize.height));
            }

            var i = firstCell.y;
            var y = firstCellPoint.y;
            if (this.filteredRows && this.filteredRows.length > 0) {
                i = this.filteredRows[i]? this.filteredRows[i].absoluteIndex: this.filteredRows[this.filteredRows.length - 1].absoluteIndex;
            }
            // IndexCell to account for the difference that blank rows add
            var indexCell = i - this.dataSource.blankRowsOffset(firstCell.y);
            while (yVisible && i < totalRows) {
                if (this.filteredRows && this.filteredRows.length > 0) {
                    var filteredRow = _.find(this.filteredRows, function(filteredRow) {
                        return filteredRow.absoluteIndex == i
                    });

                    if (!filteredRow) {
                        i++;
                        continue;
                    }
                    else {
                        indexCell = filteredRow.indexCell
                    }

                }

                size = this.delegate.rowHeight(i);

                rows.push({
                    y: y,
                    index: i,
                    indexCell: indexCell,
                    height: size,
                    blank: this.dataSource.isBlankRow(i)
                });

                if (!this.dataSource.isBlankRow(i)) {
                    indexCell++;
                }

                i = i + 1;
                y = y + size;

                yVisible = this.isRelativeRectangleVisible(new Rectangle(firstCellPoint.x, y, firstCellSize.width, size));
            }

            return {
                rows: rows,
                columns: columns
            };
        },

        shouldIgnoreRow: function(iRow) {
            var totalColumns = this.dataSource.columns();
            var firstCell = this.firstCell();
            var firstCellPoint = this.absolutePoint2RelativePoint(this.cell2AbsolutePoint(firstCell));
            var firstCellSize = this.cellSize(firstCell);


            var xVisible = true;
            var shouldIgnore = true;
            var x = firstCellPoint.x;
            for (var i = firstCell.x; xVisible && i < totalColumns; i++) {
                var size = this.delegate.columnWidth(i);
                var cell = new Cell(i, iRow);
                var value = this.dataSource.cellAtIndex(cell);
                if (!this.shouldIgnore(value)) {
                    shouldIgnore = false;
                    break;
                }

                x += size;
                xVisible = this.isRelativeRectangleVisible(new Rectangle(x, firstCellPoint.y, size, firstCellSize.height));
            }

            return shouldIgnore;
        },

        shouldIgnore: function(value) {
            var ignored = false;
            for (var i = 0; i<this.ignoredValues.length; i++) {
                if (this.ignoredValuesHandlers[this.ignoredValues[i]] && this.ignoredValuesHandlers[this.ignoredValues[i]](value)) {
                    ignored = true;
                    break;
                }
            }
            return ignored;
        },

        shouldIgnoreColumn: function(iColumn) {
            var firstCell = this.firstCell();
            var firstCellPoint = this.absolutePoint2RelativePoint(this.cell2AbsolutePoint(firstCell));
            var firstCellSize = this.cellSize(firstCell);
            var totalRows = this.dataSource.rows();


            var shouldIgnore = true;
            var visible = true;
            var y = firstCellPoint.y;
            for (var iRow = firstCell.y - this.dataSource.blankRowsOffset(firstCell.y); visible && iRow<(totalRows - this.dataSource.blankRowsOffset(firstCell.y)); iRow++) {
                var rowHeight = this.delegate.rowHeight(iRow);
                var cell = new Cell(iColumn, iRow);
                var value = this.dataSource.cellAtIndex(cell);

                if (!this.shouldIgnore(value)) {
                    shouldIgnore = false;
                    break;
                }
                y += rowHeight;
                visible = this.isRelativeRectangleVisible(new Rectangle(firstCellPoint.x, y, firstCellSize.width, rowHeight));
            }

            return shouldIgnore;
        },

        ignoreValues: function(ignoredValues, repaint) {
            repaint = repaint != null ? repaint : false;
            this.ignoredValues = ignoredValues;
            repaint && this.repaint();
        },

        repaint: function () {
            this.clear();
            this.ctx.save();

            this.ctx.beginPath();
            this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width, this.viewPort.height);
            this.ctx.clip();

            this.calculateDimensionsAndIgnoredCells();
            var paintInfo = this.paintInfo();
            this.currentPaintInfo = paintInfo;

            this.paintCells(paintInfo);

            this.ctx.restore();
            this.needRepaint = false;
        },

        getPaintInfoRowCell: function (y) {
            var nonBlankRows = _(this.paintInfo().rows)
                .filter(function (row) {
                    return !row.blank;
                });
            return nonBlankRows[y];
        },

        paintCells: function (paintInfo) {
            var x, y, bgColor, i, j;

            this.ctx.textAlign = "right";
            this.ctx.font = this.delegate.style.bodyCell.font;
            this.ctx.textBaseline = "middle";
            this.ctx.strokeStyle = this.delegate.style.bodyCell.border.color;

            var marginRight = this.delegate.style.bodyCell.margin.right;

            for (j = 0; j < paintInfo.columns.length; j++) {
                var column = paintInfo.columns[j];
                for (i = 0; i < paintInfo.rows.length; i++) {
                    var row = paintInfo.rows[i];
                    var cell = new Cell(column.index, row.indexCell);
                    var point = new Point(column.x, row.y);
                    var size = new Size(column.width, row.height);

                    this.ctx.beginPath();
                    this.ctx.rect(point.x, point.y, size.width, size.height);
                    if (_.isFunction(this.delegate.style.bodyCell.background)) {
                        bgColor = this.delegate.style.bodyCell.background(cell, this.view);
                    } else {
                        bgColor = this.delegate.style.bodyCell.background;
                    }
                    this.ctx.fillStyle = bgColor;
                    this.ctx.fill();
                    this.ctx.closePath();

                    var isLastRow = i == (paintInfo.rows.length - 1);
                    if (isLastRow) {
                        this.ctx.beginPath();
                        this.ctx.lineWidth = this.delegate.style.bodyCell.border.width;
                        this.ctx.moveTo(point.x - 1, point.y + size.height);
                        this.ctx.lineTo(point.x + size.width, point.y + size.height);
                        this.ctx.stroke();
                    }

                    var value = "";
                    if (!row.blank) {
                        value = this.dataSource.cellAtIndex(cell);

                        if (_.isFunction(this.delegate.format)) {
                            value = this.delegate.format(value);
                        }

                        if (this.dataSource.cellHasPrimaryAttributes(cell)) {
                            this.ctx.beginPath();
                            var marginMark = this.delegate.style.attributeCellMark.margin;
                            var sizeMark = this.delegate.style.attributeCellMark.size;
                            this.ctx.moveTo(point.x + size.width - marginMark, point.y + size.height - marginMark);
                            this.ctx.lineTo(point.x + size.width - marginMark - sizeMark, point.y + size.height - marginMark);
                            this.ctx.lineTo(point.x + size.width - marginMark, point.y + size.height - marginMark - sizeMark);
                            this.ctx.fillStyle = this.delegate.style.attributeCellMark.background;
                            this.ctx.fill();
                            this.ctx.closePath();
                        }
                    }

                    if (value !== undefined) {
                        this.ctx.fillStyle = this.delegate.style.bodyCell.color;
                        this.ctx.fillText(value, point.x + size.width - marginRight, point.y + size.height / 2);
                    }
                }
            }
        },

        cellInfoAtPoint: function (absolutePoint) {
            var bodyCellAtPoint = this.cellAtPoint(absolutePoint);
            if (bodyCellAtPoint) {
                return this.delegate.formatCellInfo(this.dataSource.cellInfoAtIndex(bodyCellAtPoint));
            }
        },

        cellTimeSerieAtPoint: function (absolutePoint) {
            var bodyCellAtPoint = this.cellAtPoint(absolutePoint);
            if (bodyCellAtPoint) {
                return this.dataSource.getCellTimeSerieAtIndex(bodyCellAtPoint);
            }
        }

    }

    _.defaults(App.Table.BodyZone.prototype, App.Table.Zone.prototype);
}());

