(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.VisualElement.line.DetailZoomView");

    STAT4YOU.VisualElement.line.DetailZoomView = Backbone.View.extend({

        className : 'detailZoomView',

        events : {
            "mousedown .bar-left" : "mouseDownLeft",
            "mousedown .bar-right" : "mouseDownRight",
            "mousedown .selection" : "mouseDownSelection",
            "click .arrowBar-left" : "clickArrowLeft",
            "click .arrowBar-right" : "clickArrowRight"
        },

        initialize : function (options) {
            this.$targetEl = options.$targetEl;
            this.$targetEl.append(this.$el);
            _.bindAll(this);
            $(document).bind('mousemove', this.mouseMove);
            $(document).bind('mouseup', this.mouseUp);

            this.model.on('change', this.update, this);

            this.barWidth = 10;
        },

        destroy: function () {
            $(document).unbind('mouseup');
            $(document).unbind('mousemove');
        },

        _setHorizontalPosition : function ($el, start, stop) {
            var width = stop - start;
            if (width < 0 ) width = 0;
            $el.css({left : start, width : width});
        },

        updateSize : function () {
            this.render();
        },

        render : function () {
            this.$el.empty();
            var offset = this.$targetEl.offset();
            var size = {
                width : this.$targetEl.width(),
                height : this.$targetEl.height()
            };
            this.$el.css({
                position : 'absolute',
                width : size.width,
                height : size.height,
                top : 0,
                left : 0
            });
            var css = { top : 0, height : size.height};

            this.$leftOverlay = $('<div class="overlay overlay-left">').css(css).appendTo(this.$el);
            this.$rightOverlay = $('<div class="overlay overlay-right">').css(css).appendTo(this.$el);
            this.$selection = $('<div class="selection">').css(css).appendTo(this.$el);
            this.$leftBar = $('<div class="bar bar-left">').css(css).appendTo(this.$el);
            this.$rightBar = $('<div class="bar bar-right">').css(css).appendTo(this.$el);
            this.$leftArrowBar = $('<div class="arrowBar arrowBar-left"><div class="arrow arrow-left"></div></div>').css(css).appendTo(this.$el);
            this.$rightArrowBar = $('<div class="arrowBar arrowBar-right"><div class="arrow arrow-right"></div></div>').css(css).appendTo(this.$el);

            $('<div class="line line-a"></div>').appendTo(this.$leftBar);
            $('<div class="line line-b"></div>').appendTo(this.$leftBar);

            $('<div class="line line-a"></div>').appendTo(this.$rightBar);
            $('<div class="line line-b"></div>').appendTo(this.$rightBar);

            this.$leftArrowBar.css({left : 0/*- this.barWidth*/, width: this.barWidth});
            this.$rightArrowBar.css({left : size.width - this.barWidth, width: this.barWidth});

            this.update();
        },

        update : function () {
            var size = {
                width : this.$targetEl.width(),
                height : this.$targetEl.height()
            };

            var a = 0;
            var b = Math.round(size.width * this.model.get('start'));
            var c = b + this.barWidth;
            var d = Math.round(size.width * this.model.get('stop')) - this.barWidth;
            var e = d + this.barWidth;
            var f = size.width - this.barWidth;

            this._setHorizontalPosition(this.$leftOverlay, a, c);
            this._setHorizontalPosition(this.$leftBar, b, c);
            this._setHorizontalPosition(this.$selection, c, d);
            this._setHorizontalPosition(this.$rightBar, d, e);
            this._setHorizontalPosition(this.$rightOverlay, e, f);
        },

        mouseDownLeft : function () {
            this.leftBarMoving = true;
            return false;
        },

        mouseDownRight : function (e) {
            this.rightBarMoving = true;
            return false;
        },

        mouseDownSelection : function (e) {
            this.selectionMoving = true;
            this.mousePosition = e.pageX;
            return false;
        },

        mouseUp : function () {
            this.leftBarMoving = false;
            this.rightBarMoving = false;
            this.selectionMoving = false;
            return false;
        },

        mouseMove : function (e) {
            var position;
            if (this.leftBarMoving || this.rightBarMoving) {
                position = (e.pageX - this.$el.offset().left) / this.$el.width();

                if (this.leftBarMoving) {
                    this.model.set('start', position, {validate : true});
                    return false;
                }

                if (this.rightBarMoving) {
                    this.model.set('stop', position, {validate : true});
                    return false;
                }
            }

            if (this.selectionMoving) {
                position = (e.pageX - this.mousePosition) / this.$el.width();
                this.model.set({
                    start : this.model.get('start') + position,
                    stop : this.model.get('stop') + position
                }, {validate : true});
                this.mousePosition = e.pageX;
            }
        },

//        mouseLeave : function(e) {
//            this.selectionMoving = false;
//            this.leftBarMoving = false;
//            this.rightBarMoving = false;
//        },

        clickArrowLeft : function () {
            this.model.moveStepLeft();
            return false;
        },

        clickArrowRight : function () {
            this.model.moveStepRight();
            return false;
        }

    });
}());
