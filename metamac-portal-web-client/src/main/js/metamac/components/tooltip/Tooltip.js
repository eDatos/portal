
(function () {
    "use strict";

    App.namespace("App.components.tooltip");

    App.components.tooltip.Tooltip = function (options) {
        this.initialize(options);
    };

    App.components.tooltip.Tooltip.prototype = {

        delay : 300,

        initialize : function (options) {
        	this.trigger = options.trigger == "click" ? "click" : "mouseOver";
        	
        	if (this.trigger === "click") {
        		this._click = _.bind(this._click, this);
        	} else {
        		this._mouseMove = _.bind(this._mouseMove, this);
        	}

            this._initializeHtml();
            this._hide();
            this.setEl(options.el);
            this.delegate = options.delegate;
        },

        destroy : function () {
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
        	this.$tooltipTitle = $('<div class="tooltip-title"></div>');
        	this.$tooltipBody = $('<div class="tooltip-body"></div>');
            this.$innerTooltip = $('<div class="tooltip-inner"></div>').append(this.$tooltipTitle);
            this.$innerTooltip.append(this.$tooltipBody);
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

        _detachEvents : function () {
            if (this.$container) {
                this.$container.off('.tooltip');
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
	        var attribute = this.delegate.getAttributeAtMousePosition(point);
	        if (attribute) {
	            this.$innerTooltip.html(attribute);
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
        
        _updateByMouseOver : function (point) {
        	var title = this.delegate.getTitleAtMousePosition(point);
            if (title) {
                this.$innerTooltip.html(title);
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
        },

        _mouseMove : function (e) {
            var offset = this._getOffset();
            var point = {
                x : e.pageX - offset.left,
                y : e.pageY - offset.top
            };
            this._update(point);
        },
        _click : function (e) {
            var offset = this._getOffset();
            var point = {
                x : e.pageX - offset.left,
                y : e.pageY - offset.top
            };
            this._update(point);
        }

    };

}());