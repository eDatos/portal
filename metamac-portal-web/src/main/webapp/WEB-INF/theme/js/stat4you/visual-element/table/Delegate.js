(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.Table.Delegate");

    STAT4YOU.Table.Delegate = function () {
        this.size = new STAT4YOU.Table.Size(150, 25);

        this.style = {
            bodyCell : {
                font : "12px Helvetica,Arial,sans-serif",
                color : "#191919",
                background : function (cell, view) {

                    var isRowSelected = view.isSelectionActive({rows : [cell.y]});
                    var isColumnSelected = view.isSelectionActive({columns : [cell.x]});

                    if (isRowSelected && isColumnSelected) {
                        return "#E8F1FF";
                    }else if(isRowSelected || isColumnSelected) {
                        return "#F5F9FF";
                    }
                    return "#fff";
                },
                border : {
                    color : "#DDD",
                    width : "1px",
                    horizontal : true,
                    vertical : true
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
                        return "#389FEB";
                    } else {
                        return "#78BEF1";
                    }
                },
                border : {
                    color : "#FFFFFF",
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
            scroll : {
                color : function (scroll, view) {
                    if(view.mouseZone && view.mouseZone.indexOf(scroll) !== -1){
                        return "#1373B9";
                    }else if(view.lastClickZone && view.lastClickZone.indexOf(scroll) !== -1) {
                        return "#1373B9";
                    }else{
                        return "#CCCCCC";
                    }
                },
                minSize : 30,
                lineWidth : 7
            }
        };

    };

    STAT4YOU.Table.Delegate.prototype = {
        rowHeight : function (row) {
            //return row % 2 === 0 ? 60 : 100;
            return this.size.height;
        },

        columnWidth : function (column) {
            //return column % 2 === 0 ? 60 : 100;
            return this.size.width;
        },

        leftHeaderColumnWidth : function (leftHeaderColumn, view) {
            var size = view.getSize();
            return size.width > 800 ? 200 : 100;
        },

        topHeaderRowHeight : function (topHeaderRow, view) {
            return 25;
        },

        format : function (value) {
            if (value) {
                return value;
                /*
                 value = value.replace(",", ".");
                 var floatValue = parseFloat(value);
                 if (_.isNaN(floatValue)) {
                 return value;
                 } else {
                 return I18n.toNumber(floatValue);
                 }*/
            }
        }


    };

}());





