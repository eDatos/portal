(function () {
    "use strict";

    App.namespace("App.Table.Size");

    App.Table.Size = function (width, height) {
        this.width = width;
        this.height = height;
    };


    App.Table.isZero = function () {
        return this.width === 0 && this.height === 0;
    }

}());
