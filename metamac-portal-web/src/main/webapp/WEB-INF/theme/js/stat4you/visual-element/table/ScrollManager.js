(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.Table.ScrollManager");

    var Point = STAT4YOU.Table.Point;

    var ScrollManager = STAT4YOU.Table.ScrollManager = function (view) {
        this.view = view;
        this.canvas = view.canvas;
        this.$canvas = $(this.canvas);
        this.lastPoint = undefined;
        this.$body = $('body');
        this.$document = $(document);

        this.eventNamespace = ".scrollManager";

        _.bindAll(this, "mousemove", "mousedown", "mouseup", "mousewheel", "dblclick");

        this.bindEvents();
    };

    ScrollManager.prototype.destroy = function () {
        this.unbindEvents();
    };

    ScrollManager.prototype.pointFromEvent = function (e) {
        var point;
        var touchPoint = this.pointFromTouchEvent(e);
        if (touchPoint) {
            point = touchPoint;
        } else {
            point = this.pointFromMouseEvent(e);
        }
        return point;
    };

    ScrollManager.prototype.pointFromMouseEvent = function (e) {
        var offset = this.$canvas.offset();
        var x = e.pageX - offset.left,
            y = e.pageY - offset.top;
        return new Point(x, y);
    };

    ScrollManager.prototype.pointFromTouchEvent = function (e) {
        if (e.targetTouches && e.targetTouches.length === 1) {
            var touch = e.targetTouches[0];
            return new Point(touch.pageX, touch.pageY);
        }
    };

    ScrollManager.prototype.bindEvents = function () {
        // mouse movements
        this.$document.on("mousemove" + this.eventNamespace, this.mousemove);
        this.$canvas.on("mousedown" + this.eventNamespace, this.mousedown);
        this.$document.on("mouseup" + this.eventNamespace, this.mouseup);
        this.$canvas.on("dblclick" + this.eventNamespace, this.dblclick);

        // mouse wheel
        this.$canvas.on('mousewheel', this.mousewheel);

        this.bindTouchEvents();
    };

    ScrollManager.prototype.unbindEvents = function () {
        this.$document.off(this.eventNamespace);
    };

    ScrollManager.prototype.bindTouchEvents = function () {
        var self = this;

        document.body.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false);
        this.canvas.addEventListener('touchmove', function (e) {
            self.onmousemove(e);
        }, false);
        this.canvas.addEventListener('touchstart', function (e) {
            self.onmousedown(e);
        }, false);
        this.canvas.addEventListener('touchend', function (e) {
            self.onmouseup(e);
        }, false);

        document.touchmove = function (e) {
            self.onmousemove(e);
        };
        this.canvas.touchstart = function (e) {
            self.onmousedown(e);
        };
        document.touchend = function (e) {
            self.onmouseup(e);
        };
    };

    ScrollManager.prototype.mousemove = _.throttle(function (e) {

        var current = this.pointFromEvent(e);
        this.changeCursor(current);

        if (this.lastPoint) {
            var distance = current.distance(this.lastPoint);

            if (this.lastZone === "rightScrollZone-scrollBar") {
                distance = distance.negate();
                distance.x = 0;
                this.view.scrollDistance(distance);
            } else if (this.lastZone === "bottomScrollZone-scrollBar") {
                distance = distance.negate();
                distance.y = 0;
                this.view.scrollDistance(distance);
            } else if (this.lastZone === "leftHeaderZone") {
                distance.x = 0;
                this.view.move(distance);
            } else if (this.lastZone === "topHeaderZone") {
                distance.y = 0;
                this.view.move(distance);
            } else if (this.lastZone === "bodyZone") {
                this.view.move(distance);
            }

            this.lastPoint = current;
        }

        this.view.setMousePosition(current, e);

        return false;
    }, 1000 / 60); //60fps

    ScrollManager.prototype.mousedown = function (e) {
        var point = this.pointFromEvent(e);
        var zone = this.view.zoneFromPoint(point);

        this.lastPoint = point;
        this.lastZone = zone;
        this.view.setLastClickZone(zone);

        var self = this;
        if (zone === "rightScrollZone") {
            self.repeatUntil(
                function () {
                    self.view.stepScroll(new Point(0, point.y));
                },
                function () {
                    return zone === self.view.zoneFromPoint(point) && point.eq(self.lastPoint);
                },
                100
            );

        } else if (zone === "bottomScrollZone") {
            self.repeatUntil(
                function () {
                    self.view.stepScroll(new Point(point.x, 0));
                },
                function () {
                    return zone === self.view.zoneFromPoint(point) && point.eq(self.lastPoint);
                },
                100
            );
        }

        return false;
    };

    ScrollManager.prototype.mouseup = function (e) {
        this.lastPoint = undefined;
        this.lastZone = undefined;
        this.view.setLastClickZone(this.lastZone);
        return false;
    };

    ScrollManager.prototype.repeatUntil = function (fn, condition, ms) {
        var cfn = function () {
            if (condition()) {
                fn();
                setTimeout(cfn, ms);
            }
        };
        cfn();
    };

    ScrollManager.prototype.mousewheel = function (event, delta, deltaX, deltaY) {
        this.view.move(new STAT4YOU.Table.Point(deltaX * 60, deltaY * 60));
        return false;
    };

    ScrollManager.prototype.changeCursor = function (currentPoint) {
        if (!this.lastPoint) {
            var cursorClass;
            var zone = this.view.zoneFromPoint(currentPoint);

            if (zone === "bodyZone") {
                cursorClass = "move";
            } else if(zone === "leftHeaderZone") {
                cursorClass = "move-updown";
            } else if (zone === "topHeaderZone") {
                cursorClass = "move-leftright";
            }

            if(cursorClass){
                this.$body.addClass(cursorClass);
            }

            var toRemove = _.without(["move", "move-updown", "move-leftright"], cursorClass).join(" ");
            this.$body.removeClass(toRemove);
        }
    };

    ScrollManager.prototype.dblclick = function (e) {
        var point = this.pointFromEvent(e);
        this.view.setActiveCell(point);
    };

}());