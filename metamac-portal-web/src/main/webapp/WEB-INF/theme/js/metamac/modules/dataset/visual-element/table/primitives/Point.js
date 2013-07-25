(function(){
    "use strict";

    App.namespace("App.Table.Point");

    App.Table.Point = function (x, y) {
        this.x = x;
        this.y = y;
    };

    App.Table.Point.prototype.distance = function (from) {
        return new App.Table.Point(this.x - from.x, this.y - from.y);
    };

    App.Table.Point.prototype.plus = function (from) {
        return new App.Table.Point(this.x + from.x, this.y + from.y);
    };

    App.Table.Point.prototype.clone = function () {
        return _.clone(this);
    };

    App.Table.Point.prototype.negate = function () {
        return new App.Table.Point(-this.x, -this.y);
    };

    App.Table.Point.prototype.eq = function (point) {
        if(point){
            return this.x === point.x && this.y === point.y;
        }
        return false;
    };

}());





