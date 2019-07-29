
(function () {
    "use strict";

    App.namespace("App.components.tooltip");

    App.components.tooltip.Tooltip = function (options) {
        this.initialize(options);
    };

    App.components.tooltip.Tooltip.prototype = {

        delay : 300,

        initialize : function (options) {
            this.delegate = options.delegate;
            this.view = options.view;
            this.trigger = options.trigger == "click" ? "click" : "mouseOver";
        	
            if (this.trigger === "click") {
                this._click = _.bind(this._click, this);
            } else {
                this._mouseMove = _.bind(this._mouseMove, this);
            }

            this._initializeHtml();
            this._hide();
            this.setEl(options.el);
        },

        destroy : function () {
            if (this.lineChart) {
                this.lineChart.destroy();
            }
            this.$tooltip.remove();
            this._detachEvents();
        },

        setEl : function (el) {
            this._detachEvents();

            this.$el = $(el);
            var $parentContainer = this.$el.parents(".full-screen:eq(0)");
            var isParentInFullScreen = $parentContainer.length > 0;
            this.$container = isParentInFullScreen ? $parentContainer : this.$body;
            this.$viewPort = isParentInFullScreen ? $parentContainer : this.$container;
            this.$container.append(this.$tooltip);

            this._attachEvents();
        },

        _initializeHtml : function () {
            this.$cellInfo = $('<div class="tooltip-cell-info"></div>');
            this.$cellChart = $('<div class="tooltip-cell-chart"></div>');
            this.$innerTooltip = $('<div class="tooltip-inner"></div>').append(this.$cellInfo).append(this.$cellChart);
            this.$tooltip = $('<div class="tooltip in"></div>').append(this.$innerTooltip);
            this.$body = $('body');
        },

        _attachEvents : function () {            
           	if (this.trigger === "click") {
           		this.$container.on('click.tooltip', this._click);
           	} else {
           		this.$container.on('mousemove.tooltip', this._mouseMove);
           	}
        },

        // IDEA: METAMAC-2276 This won´t scalate properly if for example you have more than one tooltip with the same trigger
        // This is because consecutive calls to setEl function will detach other tooltips events, not only the events
        // that the current tooltip have
        _detachEvents : function () {
            if (this.$container) {
                if (this.trigger === "click") {
                    this.$container.off('click.tooltip');
                } else {
                    this.$container.off('mousemove.tooltip');
                }
            }
        },

        _getViewportSize : function () {
            return {
                width : this.$viewPort.width(),
                height : this.$viewPort.height()
            };
        },

        _getOffset : function () {
            return this.$el.offset();
        },

        _getPosition : function (cursor) {
            var position = {};

            var tooltipSize = {
                width : this.$tooltip.outerWidth(),
                height : this.$tooltip.outerHeight()
            };

            var viewPortSize = this._getViewportSize();
            var limits = {
                x : viewPortSize.width - tooltipSize.width,
                y : viewPortSize.height - tooltipSize.height
            };

            var offset = this._getOffset();
            position.x = cursor.x + offset.left + 10;
            position.y = cursor.y + offset.top + 10;

            if (position.x > limits.x) {
                position.x = position.x - 10 - tooltipSize.width;
            }

            if (position.y > limits.y) {
                position.y = position.y - 10 - tooltipSize.height;
            }

            return position;
        },
        
        _update : function (point) {
            var pointInsideEl = point.x > 0 && point.y > 0 && point.x < this.$el.width() && point.y < this.$el.height();
            if (pointInsideEl) {
            	if (this.trigger === "click") {            		            	
            		this._updateByClick(point);
            	} else {
	                this._updateByMouseOver(point);
            	}
            } else {
                this._hide();
            }
        },
        
        _updateByClick : function (point) {
            var attribute = this.delegate.getCellInfoAtMousePosition(point);
            if (attribute) {
                this.view.toggleClickedCellByRelativePoint(point);
                this.$cellInfo.html(attribute);
                this._drawChart(point);
                var position = this._getPosition(point);
                this.$tooltip.css({	                        
                    top : position.y,
                    left : position.x                    
                });
                this.$tooltip.toggle();
            } else {
                this._hide();
            }
        },

        _drawChart : function(point) {
            var cellTimeSerie = this.delegate.getCellTimeSerieAtMousePosition(point);
            if (!cellTimeSerie) {
                this.$cellChart.hide();
                return;
            }

            this.$cellChart.show();
            if (!this.lineChart) {
                this.lineChart = new App.VisualElement.TooltipLineChart({
                    el: this.$cellChart,
                    data: cellTimeSerie.data,
                    permutation: cellTimeSerie.permutation,
                    timeDimension: cellTimeSerie.timeDimension
                });
                this.lineChart.render();
            } else {
                this.lineChart.update(cellTimeSerie.permutation);
            }
        },
        
        _updateByMouseOver : function (point) {
            var title = this.delegate.getTitleAtMousePosition(point);
            if (title) {
                this.$cellInfo.html(title);
                var position = this._getPosition(point);
                this.$tooltip.css({
                    display : 'block',
                    top : position.y,
                    left : position.x
                });
            } else {
                this._hide();
            }
        },

        _hide : function () {
            this.$tooltip.css('display', 'none');
            this.view.clearClickedCell();
        },

        _mouseMove : function (e) {
            var offset = this._getOffset();
            var point = new App.Table.Point(e.pageX - offset.left, e.pageY - offset.top);
            this._update(point);
        },

        _click : function (e) {
            var offset = this._getOffset();
            var point = new App.Table.Point(e.pageX - offset.left, e.pageY - offset.top);
            this._update(point);
        }

    };
}());
