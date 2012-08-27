(function () {
    "use strict";

    var Point = STAT4YOU.Table.Point;

    STAT4YOU.namespace("STAT4YOU.Table.SpinnerZone");

    STAT4YOU.Table.SpinnerZone = function (options) {
        STAT4YOU.Table.Zone.prototype.initialize.apply(this, arguments);
        this.initialize(options);
    };

    _.extend(STAT4YOU.Table.SpinnerZone.prototype, STAT4YOU.Table.Zone.prototype);

    STAT4YOU.Table.SpinnerZone.prototype.initialize = function (options) {
        this.speed = options.speed || 0.005;
        this.spinnerSize = options.spinnerSize || 4;

        this.onAjax = false;
        _.bindAll(this, 'ajaxStart', 'ajaxStop', 'loop');

        $(document).bind('ajaxStart.spinnerZone', this.ajaxStart);
        $(document).bind('ajaxStop.spinnerZone', this.ajaxStop);
    };

    STAT4YOU.Table.SpinnerZone.prototype.destroy = function () {
        $(document).unbind('.spinnerZone');
    };

    STAT4YOU.Table.SpinnerZone.prototype.ajaxStart = function () {
        if (!this.onAjax) {
            this.onAjax = true;
            this.loop();
        }
    };

    STAT4YOU.Table.SpinnerZone.prototype.ajaxStop = function () {
        this.onAjax = false;
        this.clear();
    };

    STAT4YOU.Table.SpinnerZone.prototype.loop = function () {
        if (this.onAjax) {
            this.repaint();
            window.requestAnimationFrame(this.loop);
        }
    };

    STAT4YOU.Table.SpinnerZone.prototype.repaint = function () {
        this.ctx.save();

        var time = new Date().getTime();
        this.clear();

        for (var i = 0; i < this.spinnerSize; i++) {
            var t = (time * this.speed - i * Math.PI / this.spinnerSize) % Math.PI;
            var alpha = Math.sin(t);

            this.ctx.fillStyle = "rgba(120, 190, 241, " + alpha + ")";
            var point = this.absolutePoint2RelativePoint(new Point(20 * i, 10));
            this.ctx.fillRect(point.x, point.y, 10, 10);
        }
        this.ctx.restore();
    };

}());
