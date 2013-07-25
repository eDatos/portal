(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.Table.FullScreenManager");

    var FullScreenManager = STAT4YOU.Table.FullScreenManager = function (table) {
        var self = this;
        this.view = table;
        this.$body = $('body');
        _.bindAll(this, "resize");
        this.attachEvents();
        this.resize();
    };

    FullScreenManager.prototype.attachEvents = function () {
        $(window).on("load resize", this.resize);
    };

    FullScreenManager.prototype.resize = function () {
        var newSize = new STAT4YOU.Table.Size(window.innerWidth,  window.innerHeight);
        this.view.resize(newSize);
    };

}());




