(function () {
    "use strict";

    App.namespace("App.Table.Cell");

    App.Table.Cell = function (x, y) {
        this.x = x;
        this.y = y;
    };

    App.Table.Cell.prototype.clone = function () {
        return new App.Table.Cell(this.x, this.y);
    };

    App.Table.Cell.prototype.eq = function (point) {
        return this.x === point.x && this.y === point.y;
    };

}());



