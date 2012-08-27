(function(){
    "use strict";

    STAT4YOU.namespace("STAT4YOU.Table.Point");

    STAT4YOU.Table.Point = function (x, y) {
        this.x = x;
        this.y = y;
    };

    STAT4YOU.Table.Point.prototype.distance = function (from) {
        return new STAT4YOU.Table.Point(this.x - from.x, this.y - from.y);
    };

    STAT4YOU.Table.Point.prototype.plus = function (from) {
        return new STAT4YOU.Table.Point(this.x + from.x, this.y + from.y);
    };

    STAT4YOU.Table.Point.prototype.clone = function () {
        return _.clone(this);
    };

    STAT4YOU.Table.Point.prototype.negate = function () {
        return new STAT4YOU.Table.Point(-this.x, -this.y);
    };

    STAT4YOU.Table.Point.prototype.eq = function (point) {
        if(point){
            return this.x === point.x && this.y === point.y;
        }
        return false;
    };

}());





