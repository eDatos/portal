(function () {
    "use strict";

    App.namespace("App.Table.Delegate");

    App.Table.Delegate = function () {
        this.size = new App.Table.Size(150, 25);
        this.minSize = new App.Table.Size(50, 25);
        
        this.scrollSize = 10;
        this.spinnerSize = new App.Table.Size(70, 30);

        this.style = {
            bodyCell : {
                font : "12px Helvetica,Arial,sans-serif",
                color : "#191919",
                background : function (cell, view) {

                    var isRowSelected = view.isSelectionActive({rowsCells : [cell.y]});
                    var isColumnSelected = view.isSelectionActive({columns : [cell.x]});

                    if (isRowSelected && isColumnSelected) {
                        return "#E8F1FF";
                    } else if (isRowSelected || isColumnSelected) {
                        return "#F5F9FF";
                    }
                    return "#fff";
                },
                border : {
                    color : "#DDD",
                    width : "1px",
                    horizontal : true,
                    vertical : false
                },
                margin : {
                    right : 5
                }
            },
            headerCell : {
                font : "12px Helvetica, Arial, sans-serif",
                color : "#191919",
                background : function (current, view) {
                    if (view.isSelectionActive(current)) {
                        return "#C8C8C8";
                    } else {
                        return "#E6E6E6";
                    }
                },
                border : {
                    color : "#C0C0C0",
                    width : "1px"
                },
                shadow : {
                    show : false,
                    color : "rgba(0, 0, 0, 0.2)",
                    blur : "10",
                    offset : 1
                },
                margin : {
                    right : 5,
                    left : 5
                }
            },
            attributeCellMark : {
                background : "#0f5b95",
                margin : 2,
                size : 5
            },
            scroll : {
                color : function (scroll, view) {
                    if (view.mouseZone && view.mouseZone.indexOf(scroll) !== -1) {
                        return "#DD7735";
                    } else if (view.lastClickZone && view.lastClickZone.indexOf(scroll) !== -1) {
                        return "#DD7735";
                    } else {
                        return "#CCCCCC";
                    }
                },
                minSize : 30,
                lineWidth : 7
            }
        };

        this.columnWidthOffsets = [];
        this.leftHeaderColumnWidthOffsets = [];
    };

    App.Table.Delegate.prototype = {

        rowHeight : function (row) {
            //return row % 2 === 0 ? 60 : 100;
            return this.size.height;
        },

        columnWidth : function (column) {
            var offset = this.columnWidthOffsets[column];
            var columnWidth = _.isUndefined(offset) ? this.size.width : this.size.width + offset;
            var validColumnWidth = columnWidth < this.minSize.width ? this.minSize.width : columnWidth;
            return validColumnWidth;
        },

        leftHeaderColumnWidth : function (leftHeaderColumn, view) {
            //var size = view.getSize();
            //var defaultWidth = size.width > 800 ? 200 : 100; //responsive
            var defaultWidth = 100;
            var offset = this.leftHeaderColumnWidthOffsets[leftHeaderColumn];
            var leftHeaderColumnWidth = _.isUndefined(offset) ? defaultWidth : defaultWidth + offset;
            return leftHeaderColumnWidth < this.minSize.width ? this.minSize.width : leftHeaderColumnWidth;
        },

        topHeaderRowHeight : function (topHeaderRow, view) {
            return 25;
        },

        _isNumber : function (string) {
            var floatValue = parseFloat(string);
            return !_.isNaN(floatValue);
        },

        format : function (value) {
            return value;
        },

        formatAttributes : function (attributes) {
            var formattedAttributes = _(attributes).map(function(attribute) { 
                if (attribute.href) {
                    return '<a href="' + attribute.href + '">' + attribute.name + '</a>';
                } else {
                    return attribute;
                }
            });
            return formattedAttributes.join("<br>");
        },

        resizableColumns : function () {
            return true;
        },

        resizeColumnWidth : function (separatorIndex, offset) {
            var columnIndex = separatorIndex - 1;
            if (_.isUndefined(this.columnWidthOffsets[columnIndex])) {
                this.columnWidthOffsets[columnIndex] = offset;
            } else {
                this.columnWidthOffsets[columnIndex] = this.columnWidthOffsets[columnIndex] + offset;
            }
        },

        resizeLeftHeaderColumnWidth : function (leftHeaderColumn, offset) {
            var columnIndex = leftHeaderColumn - 1;
            if (_.isUndefined(this.leftHeaderColumnWidthOffsets[columnIndex])) {
                this.leftHeaderColumnWidthOffsets[columnIndex] = offset;
            } else {
                this.leftHeaderColumnWidthOffsets[columnIndex] += offset;
            }
        }

    };

}());





