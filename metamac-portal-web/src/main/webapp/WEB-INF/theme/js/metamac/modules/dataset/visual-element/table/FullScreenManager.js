(function () {
    "use strict";

    App.namespace("App.Table.FullScreenManager");

    var FullScreenManager = App.Table.FullScreenManager = function (table) {
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
        var newSize = new App.Table.Size(window.innerWidth,  window.innerHeight);
        this.view.resize(newSize);
    };

}());




