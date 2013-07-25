(function () {
    "use strict";

    var Point = App.Table.Point,
        Rectangle = App.Table.Rectangle;

    App.namespace("App.Table.BottomScrollZone");

    App.Table.BottomScrollZone = function (options) {
        App.Table.Zone.prototype.initialize.apply(this, arguments);
        this.initialize(options);
    };

    App.Table.BottomScrollZone.prototype = {

        initialize : function (options) {
            if (options) {
                this.bodyZone = options.bodyZone;
                this.delegate = options.delegate;
                this.view = options.view;

                //defaults values
                this.lineWidth = 7;
                this.minSize = 10;
                if (this.delegate) {
                    this.lineWidth = this.delegate.style.scroll.lineWidth || this.lineWidth;
                    this.minSize = this.delegate.style.scroll.minSize || this.minSize;
                }
            }
        },

        getScrollPosition : function () {
            var scrollSize = this.getScrollSize();
            var scrollPosition = this.bodyZone.origin.x
                / (this.bodyZone.size.width - this.viewPort.width)
                * (this.viewPort.width - scrollSize);

            return Math.floor(scrollPosition);
        },

        getScrollSize : function () {
            var scrollSize = this.viewPort.width * this.viewPort.width / this.bodyZone.size.width;

            if (scrollSize < this.minSize) {
                scrollSize = this.minSize;
            } else if (scrollSize > this.viewPort.width) {
                scrollSize = this.viewPort.width;
            }

            return scrollSize;
        },

        scrollRectangle : function () {
            var x, y, width, height;
            var paintInfo = this.paintInfo();

            x = paintInfo.begin.x - this.lineWidth;
            y = this.viewPort.y;
            width = paintInfo.end.x - paintInfo.begin.x + 2 * this.lineWidth;
            height = this.viewPort.height;

            return new Rectangle(x, y, width, height);
        },

        isVisible : function () {
            var scrollSize = this.getScrollSize();
            return (scrollSize !== this.viewPort.width);
        },

        paintInfo : function () {
            var scrollPosition = this.getScrollPosition();
            var scrollSize = this.getScrollSize();

            var begin = new Point(),
                end = new Point();

            var halfRound = Math.ceil(this.lineWidth / 2);

            begin.x = Math.floor(this.viewPort.x + scrollPosition) + halfRound;
            begin.y = Math.floor(this.viewPort.y + this.viewPort.height / 2) + 0.5;

            end.x = begin.x + scrollSize - 2 * halfRound;
            end.y = begin.y;

            return {
                begin : begin,
                end : end
            };
        },

        repaint : function () {
            if (this.isVisible()) {
                var paintInfo = this.paintInfo();
                this.ctx.save();

                this.clear();
                this.ctx.beginPath();
                this.ctx.moveTo(paintInfo.begin.x, paintInfo.begin.y);
                this.ctx.lineTo(paintInfo.end.x, paintInfo.end.y);
                this.ctx.lineWidth = this.lineWidth;
                this.ctx.lineCap = "round";

                var color;
                if(_.isFunction(this.delegate.style.scroll.color)) {
                    color = this.delegate.style.scroll.color("bottomScrollZone", this.view);
                }else{
                    color = this.delegate.style.scroll.color;
                }

                this.ctx.strokeStyle = color;
                this.ctx.stroke();

                this.ctx.restore();
            }
            this.needRepaint = false;
        },

        move : function (distance) {
            if (distance.x) {
                App.Table.Zone.prototype.move.apply(this, arguments);
                this.needRepaint = true;
            }
        }

    };

    _.defaults(App.Table.BottomScrollZone.prototype, App.Table.Zone.prototype);

}());


