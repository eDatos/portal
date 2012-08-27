(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.Table.Tooltip");

    STAT4YOU.Table.Tooltip = function (options) {
        this.initialize(options);
    };


    STAT4YOU.Table.Tooltip.prototype = {

        initialize : function (options) {
            this.view = options.view;

            this.$innerTooltip = $('<div class="tooltip-inner"></div>');
            this.$tooltip = $('<div class="tooltip in"></div>').append(this.$innerTooltip);
            this.$body = $('body');

            this.updateContainer();
        },

        destroy : function () {
            this.$tooltip.remove();
        },

        getContainer : function () {
            var $canvas = $(this.view.canvas);
            var $fullScreenContainer = $canvas.parents(".full-screen:eq(0)");
            return $fullScreenContainer.length? $fullScreenContainer : this.$body;
        },

        getViewportSize : function () {
            var limitEl = this.container;
            if(this.container === this.$body){
                limitEl = $(window);
            }

            return {
                width : limitEl.width(),
                height : limitEl.height()
            };
        },

        getOffset : function () {
            return (this.container === this.$body) ? this.view.$canvas.offset() : this.view.$canvas.position();
        },

        getPosition : function (cursor) {
            var position = {};

            var tooltipSize = {
                width : this.$tooltip.outerWidth(),
                height : this.$tooltip.outerHeight()
            };

            var viewPortSize = this.getViewportSize();
            var limits = {
                x : viewPortSize.width - tooltipSize.width,
                y : viewPortSize.height - tooltipSize.height
            };

            var offset = this.getOffset();
            position.x = cursor.x + offset.left + 10;
            position.y = cursor.y + offset.top + 10;

            if(position.x > limits.x){
                position.x = position.x - 10 - tooltipSize.width;
            }

            if(position.y > limits.y) {
                position.y = position.y - 10 - tooltipSize.height;
            }

            return position;
        },

        updateContainer : function () {
            this.container = this.getContainer();
            this.container.append(this.$tooltip);
        },

        update : function (point) {
            if(point) {
                var title = this.view.getTitleAtMousePosition(point);

                if(title) {
                    this.$innerTooltip.text(title);
                    var position = this.getPosition(point);

                    this.$tooltip.css({
                        display : 'block',
                        top : position.y,
                        left : position.x
                    });
                }else{
                    this.hide();
                }
            }else{
                this.hide();
            }
        },

        hide : function (){
            this.$tooltip.css('display', 'none');
        }
    };

}());