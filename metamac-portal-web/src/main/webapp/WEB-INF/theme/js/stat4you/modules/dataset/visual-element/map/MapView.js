(function () {
    'use strict';

    var GeoJsonConverter = STAT4YOU.Map.GeoJsonConverter;

    STAT4YOU.namespace('STAT4YOU.Map.MapView');

    STAT4YOU.Map.MapView = Backbone.View.extend({

        initialize : function (options) {
            this._dataset = options.dataset;
            this._filterOptions = options.filterOptions;
            this._width = options.width;
            this._height = options.height;
            this._shapeList = options.shapeList;
            this._container = options.container;
            this._dataJson = options.dataJson;

            this.tooltipDelegate = new STAT4YOU.Map.TooltipDelegate(options);

            _.bindAll(this, "_calculateColor");

            this._onResize = _.debounce(_.bind(this._onResize, this), 200);
        },

        events : {
            "mousewheel" : "_handleMousewheel",
            "dblclick" : "_handleDblclick",
            "resize" : "_onResize"
        },

        render : function () {
            this._calculateOriginAndScale();
            this._createProjection();
            this._createSvgContainerAndTooltip();
            this._createQuantizer();
            this._createMapContent();

            this._legendView = new STAT4YOU.Map.LegendView({el : this._svg[0], model : this.model, container : this.el });
            this._legendView.render();

            this._creditsView = new STAT4YOU.Map.CredistView({ el : this._svg[0], container : this.el });
            this._creditsView.render();

            this.model.set({currentScale : 2});

            this.delegateEvents();
        },

        destroy : function () {
            if (this._svg) {
                this._svg.remove();
            }
            if (this.tooltip) {
                this.tooltip.destroy();
            }

            this.undelegateEvents();
        },

        transform : function () {
            var currentScale = this.model.get("currentScale");
            var x = this.model.get("x");
            var y = this.model.get("y");
            var animationDelay = this.model.get("animationDelay");
            if (animationDelay) {
                this._regions.transition()
                    .duration(animationDelay)
                    .attr("transform", "scale(" + currentScale + ")translate(" + x + "," + y + ")");
            } else {
                this._regions.attr("transform", "scale(" + currentScale + ")translate(" + x + "," + y + ")");
            }
        },

        zoomExit : function () {
            this._centered = null;
            this._regions.selectAll("path")
                .classed("active", this._centered);
        },

        updateRanges : function () {
            this._legendView.render();
            this._createQuantizer();
            this._repaintRegions();
        },

        canRender : function () {
            return this._shapeListOrderByHierarchy().length > 0;
        },

        _updateSize : function () {
            if (this._svg) {
                var newWidth = this.$el.width();
                var newHeight = this.$el.height();

                if (newWidth !== this._width || newHeight !== this._height) {
                    this._width = newWidth;
                    this._height = newHeight;
                    this.destroy();
                    this.render();
                }
            }
        },

        _calculateOriginAndScale : function () {
            this._origin = this._calculateNewOriginAndBounds();
            this._scale = this._calculateNewScale({x : this._minX, y : this._minY}, {x : 0, y : 0}, this._origin);
        },

        _calculateNewOriginAndBounds : function () {
            var coordinates = _.chain(this._shapeList).compact().pluck("shape").flatten().value();

            var xCoordinates = _.filter(coordinates, function (num, i) {
                return i % 2 === 0;
            });
            var yCoordinates = _.filter(coordinates, function (num, i) {
                return i % 2 !== 0;
            });

            this._maxX = _.max(xCoordinates);
            this._minX = _.min(xCoordinates);
            this._maxY = _.max(yCoordinates);
            this._minY = _.min(yCoordinates);

            var originX = this._minX + (this._maxX - this._minX) / 2;
            var originY = this._minY + (this._maxY - this._minY) / 2;
            return [originX, originY];
        },

        _calculateNewScale : function (coordinates, pixels, origin) {
            var tempProjection = d3.geo.albers()
                .origin(origin)
                .translate([0, 0]);

            var currentScale = tempProjection.scale();
            var currentValX = tempProjection([coordinates.x, coordinates.y])[0];
            var newScaleX = ((-this._width / 2) * currentScale) / currentValX;

            var currentValY = tempProjection([coordinates.x, coordinates.y])[1];
            var newScaleY = ((-this._height / 2) * currentScale) / currentValY;

            if (Math.abs(newScaleX) < Math.abs(newScaleY)) {
                return Math.abs(newScaleX) / 2.3;
            } else {
                return Math.abs(newScaleY) / 2.3;
            }
        },

        _createProjection : function () {
            this._projection = d3.geo.albers()
                .origin(this._origin)
                .scale(this._scale)
                .translate([0, 0]);

            this._path = d3.geo.path()
                .projection(this._projection);

            // TODO: The events should be managed by the manager
            this._dnd = d3.behavior.drag();
            this._dnd.on("drag", _.bind(this._handleDrag, this));
            this._dnd.on('dragstart', _.bind(this._handleDragstart, this));
            this._dnd.on('dragend', _.bind(this._handleDragend, this));
        },

        _createSvgContainerAndTooltip : function () {
            this._svg = d3.select(this.el).append("svg:svg")
                .attr("width", this._width)
                .attr("height", this._height)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("version", "1.1")
                .attr('class', "map");

            this._svg.append("rect")
                .attr("class", "background")
                .attr("width", this._width)
                .attr("height", this._height)
                .on("click", _.bind(this._handleClick, this))
                .call(this._dnd);

            if (this.tooltip) {
                this.tooltip.destroy();
            }

            this.tooltip = new STAT4YOU.components.tooltip.Tooltip({el : this.el, delegate : this.tooltipDelegate});
        },

        _shapeListOrderByHierarchy : function () {
            return _.chain(this._shapeList).compact().sortBy(function (shape) {
                return shape.hierarchy;
            }).value();
        },

        _createMapContent : function () {
            var self = this;

            this._width = this.$el.width();
            this._height = this.$el.height();

            this._regions = this._svg.append("svg:g")
                .attr("transform", "translate(" + this._width / 2 + "," + this._height / 2 + ")")
                .append("g")
                .attr("id", "regions")
                .call(this._dnd);

            this._createQuantizer();

            var geoJson = GeoJsonConverter.shapeListToGeoJson(this._shapeListOrderByHierarchy());
            var containerGeoJson = GeoJsonConverter.shapeListToGeoJson([this._container], {contour : true});
            var features = _.union(containerGeoJson.features, geoJson.features);

            // Regions
            this._regions.selectAll("path")
                .data(features)
                .enter().append("svg:path")
                .attr("d", this._path)
                .attr("class", _.bind(this._calculateColor, this))
                .on("click", _.bind(self._handleClick, this))
                .on("mouseover", self.tooltipDelegate.mouseOver)
                .on("mouseout", self.tooltipDelegate.mouseOut);
        },

        _createQuantizer : function () {
            var minValue = this.model.get("minValue");
            var maxValue = this.model.get("maxValue");
            var currentRangesNum = this.model.get("currentRangesNum");
            this._quantizer = d3.scale.quantile()
                .domain(this.model.get("values"))
                .range(d3.range(currentRangesNum));
        },

        _repaintRegions : function () {
            var self = this;
            this._regions.selectAll("path")
                .attr("class", self._calculateColor)
                .classed("active", function (d) {
                    return d === self._centered;
                });
        },

        _calculateColor : function (d) {
            if (d.properties.normCode && !d.properties.contour) {
                var normCodeData = this._dataJson[d.properties.normCode];
                if (normCodeData) {
                    var value = normCodeData.value;
                    if (!isNaN(value)) {
                        var currentRangesNum = this.model.get("currentRangesNum");
                        return "color" + currentRangesNum + '-' + this._quantizer(value);
                    }
                } else {
                    return "noAvailable";
                }
            } else if (d.properties.contour) {
                return "contour";
            }
        },

        _newCenterOffset : function (pathBounds) {
            var origin = [(pathBounds[0][0] + pathBounds[1][0]) / 2, (pathBounds[0][1] + pathBounds[1][1]) / 2];
            var originPx = this._projection(origin);
            originPx[0] *= -1;
            originPx[1] *= -1;
            return originPx;
        },

        _newScaleCenteredInObject : function (pathBounds) {
            var origin = [(pathBounds[0][0] + pathBounds[1][0]) / 2, (pathBounds[0][1] + pathBounds[1][1]) / 2];
            var leftBottomCoordinates = {x : pathBounds[0][0], y : pathBounds[0][1]};
            var pixels = {x : 0, y : this._height};
            var totalNewScale = this._calculateNewScale(leftBottomCoordinates, pixels, origin);
            var newScaleFactor = totalNewScale / this._scale;
            newScaleFactor = this.model.transformToValidScaleFactor(newScaleFactor);
            return newScaleFactor;
        },

        _handleClick : function (d) {
            var self = this;
            var maxScale = this.model.get("maxScale");
            var minScale = this.model.get("minScale");
            var originPx = [0, 0],
                currentScale = minScale,
                action = true;
            //TODO: Do we know that there is always going to be a "normCode" property?
            if (d && d.properties.normCode && !d.properties.contour) {
                this._centered = d;
                this._regions.selectAll("path")
                    .classed("active", this._centered && function (d) {
                        return d === self._centered;
                    });
                // Getting the new origin and scale
                var pathBounds = d3.geo.bounds(d);
                originPx = this._newCenterOffset(pathBounds);
                currentScale = this._newScaleCenteredInObject(pathBounds);
                this.model.set({currentScale : currentScale, x : originPx[0], y : originPx[1], animationDelay : 1000});
            } else {
                this._centered = null;
                this._regions.selectAll("path").classed("active", false);
            }
        },

        _handleDrag : function (d) {
            var x = this.model.get("x");
            var y = this.model.get("y");
            x += this.model.scaleMovement(d3.event.dx);
            y += this.model.scaleMovement(d3.event.dy);

            this.model.set({x : x, y : y, animationDelay : 0});
            return true;
        },

        _handleDragstart : function () {
            this.$el.addClass('grabbing');
            return true;
        },

        _handleDragend : function () {
            this.$el.removeClass('grabbing');
            return true;
        },

        _offsetFromMouseEvent : function (e) {
            var offset = this.$el.offset();
            var xOffset = e.pageX - (offset.left + this._width / 2);
            var yOffset = e.pageY - (offset.top + this._height / 2);
            return {left : xOffset, top : yOffset};
        },

        _handleMousewheel : function (e, delta, deltaX, deltaY) {
            var offset = this._offsetFromMouseEvent(e);
            this.model.zoomMouseWheel({delta : deltaY, xOffset : offset.left, yOffset : offset.top});
            return false;
        },

        _handleDblclick : function (e) {
            var offset = this._offsetFromMouseEvent(e);
            this.model.zoomMouseWheel({delta : 1, xOffset : offset.left, yOffset : offset.top});
        },

        _onResize : function () {
            this._updateSize();
            this.tooltip.setEl(this.el);
        }

    });

}());