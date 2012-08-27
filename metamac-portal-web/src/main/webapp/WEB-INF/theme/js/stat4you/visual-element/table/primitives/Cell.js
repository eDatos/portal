(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.Table.Cell");

    STAT4YOU.Table.Cell = function (x, y) {
        this.x = x;
        this.y = y;
    };

    STAT4YOU.Table.Cell.prototype.clone = function () {
        return new STAT4YOU.Table.Cell(this.x, this.y);
    };

    STAT4YOU.Table.Cell.prototype.eq = function (point) {
        return this.x === point.x && this.y === point.y;
    };

}());



