(function () {

    STAT4YOU.namespace('STAT4YOU.Map.LegendView');

    var SVGNode = STAT4YOU.svg.SVGNode;

    STAT4YOU.Map.LegendView = Backbone.View.extend({

        render : function () {
            this.destroy();
            var ranges = this._createRanges();

            var group = new SVGNode('g');
            group.set({"class" : "legend"});

            var text = new SVGNode('text');
            text.set({y : 10});

            var currentRangesNum = this.model.get("currentRangesNum");

            var spans = _.map(ranges, function (range, i) {
                var span = new SVGNode('tspan');
                span.node.textContent = range;
                span.set({x : "15"});
                if (i > 0) {
                    span.set({dy : "20"});
                }
                return span;
            });

            var colorBoxes = _.map(ranges, function (range, i) {
                var colorBox = new SVGNode('rect');
                colorBox.set({width : 10, height : 10, x : 0, y : i * 20, "class" : "color" + currentRangesNum + "-" + i });
                return colorBox;
            });

            text.append(spans);
            group.append(text);
            group.append(colorBoxes);
            this.el.appendChild(group.node);

            var MARGIN = 10;
            var background = new SVGNode('rect');
            group.appendFirst(background);

            background.set(group.getFrame());
            background.addMargins(MARGIN);
            background.set({"class" : "legendBg", rx : 5, ry : 5});


            var shadow = this._createShadow(background);
            group.appendFirst(shadow);

            // Align botton right
            this.group = group;
            var elNode = new SVGNode(this.el);


            var frame = {
                width : $(this.options.container).width(),
                height : $(this.options.container).height()
            };
            this.group.alignBottomRight(frame, 50, -7);
        },

        _createShadow: function (node) {
            var shadowNodes = SVGNode.factory('rect', 3);
            var nodeBox = node.node.getBBox();
            var radius = {rx : node.attrs.rx, ry : node.attrs.ry};
            var strokeWidths = [5, 3, 1];
            var strokeOpacity = [0.05, 0.1, 0.15];

            _.each(shadowNodes, function (shadowNode, i) {
                shadowNode.set(nodeBox);
                shadowNode.set(radius);
                shadowNode.set({fill : "none", stroke : "black", transform: "translate(1,1)"});
                shadowNode.set({"stroke-width" : strokeWidths[i]});
                shadowNode.set({"stroke-opacity" : strokeOpacity[i]});
            });

            var group = new SVGNode('g');
            group.append(shadowNodes);
            return group;
        },

        destroy : function () {
            if (this.group) {
                this.group.node.parentNode.removeChild(this.group.node);
            }
        },

        _createQuantizer : function () {
            var minValue = this.model.get("minValue");
            var maxValue = this.model.get("maxValue");
            var currentRangesNum = this.model.get("currentRangesNum");
            var values = this.model.get("values");
            return d3.scale.quantile().domain(values).range(d3.range(currentRangesNum));
        },

        _createRanges : function () {
            var minValue = this.model.get("minValue");
            var maxValue = this.model.get("maxValue");
            var quantizer = this._createQuantizer();
            var quantiles = quantizer.quantiles();

            var ranges = [];
            var rangeLimits = _.flatten([minValue, quantiles, maxValue], true);
            for (var i = 0; i < rangeLimits.length - 1; i++) {
                ranges[i] = this._createRange(rangeLimits[i], rangeLimits[i + 1]);
            }

            return ranges;
        },

        _createRange : function (from, to) {
            var localizedFrom = STAT4YOU.dataset.data.NumberFormatter.strNumberToLocalizedString(from.toFixed(2));
            var localizedTo = STAT4YOU.dataset.data.NumberFormatter.strNumberToLocalizedString(to.toFixed(2));
            return localizedFrom + " < " + localizedTo;
        }

    });

})();