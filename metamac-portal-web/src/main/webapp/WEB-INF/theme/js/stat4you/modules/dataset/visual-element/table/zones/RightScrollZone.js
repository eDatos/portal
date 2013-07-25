(function () {
    "use strict";

    var Cell = STAT4YOU.Table.Cell,
        Size = STAT4YOU.Table.Size,
        Point = STAT4YOU.Table.Point,
        Utils = STAT4YOU.Table.Utils,
        Rectangle = STAT4YOU.Table.Rectangle;

    STAT4YOU.namespace("STAT4YOU.Table.RightScrollZone");

    STAT4YOU.Table.RightScrollZone = function (options) {
        STAT4YOU.Table.Zone.prototype.initialize.apply(this, arguments);
        this.initialize(options);
    };

    STAT4YOU.Table.RightScrollZone.prototype = {
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
            var scrollPosition = this.bodyZone.origin.y
                / (this.bodyZone.size.height - this.viewPort.height)
                * (this.viewPort.height - scrollSize);

            return Math.floor(scrollPosition);
        },

        getScrollSize : function () {
            var scrollSize = this.viewPort.height * this.viewPort.height / this.bodyZone.size.height;

            if (scrollSize < this.minSize) {
                scrollSize = this.minSize;
            } else if (scrollSize > this.viewPort.height) {
                scrollSize = this.viewPort.height;
            }

            return scrollSize;
        },

        scrollRectangle : function () {
            var x, y, width, height;
            var paintInfo = this.paintInfo();

            x = this.viewPort.x;
            y = paintInfo.begin.y - this.lineWidth;
            width = this.viewPort.width;
            height = paintInfo.end.y - paintInfo.begin.y + 2 * this.lineWidth;

            return new Rectangle(x, y, width, height);
        },

        isVisible : function () {
            var scrollSize = this.getScrollSize();
            return (scrollSize !== this.viewPort.height);
        },

        paintInfo : function () {
            var scrollPosition = this.getScrollPosition();
            var scrollSize = this.getScrollSize();

            var begin = new Point(),
                end = new Point();

            var halfRound = Math.ceil(this.lineWidth / 2);

            begin.x = Math.floor(this.viewPort.x + this.viewPort.width / 2) + 0.5;
            begin.y = Math.floor(this.viewPort.y + scrollPosition) + halfRound;

            end.x = begin.x;
            end.y = begin.y + scrollSize - 2 * halfRound;

            return {
                begin : begin,
                end : end
            };
        },

        repaint : function () {
            if(this.isVisible()){
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
                    color = this.delegate.style.scroll.color("rightScrollZone", this.view);
                }else{
                    color = this.delegate.style.scroll.color;
                }


                this.ctx.strokeStyle = color;
                this.ctx.stroke();
                this.ctx.restore();
            }
        },

        move : function (distance) {
            if (distance.y) {
                STAT4YOU.Table.Zone.prototype.move.apply(this, arguments);
                this.needRepaint = true;
            }
        }
    };

    _.defaults(STAT4YOU.Table.RightScrollZone.prototype, STAT4YOU.Table.Zone.prototype);

}());
