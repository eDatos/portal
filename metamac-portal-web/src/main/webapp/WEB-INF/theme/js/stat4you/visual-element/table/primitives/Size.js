(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.Table.Size");

    STAT4YOU.Table.Size = function (width, height) {
        this.width = width;
        this.height = height;
    };


    STAT4YOU.Table.isZero = function () {
        return this.width === 0 && this.height === 0;
    }

}());
