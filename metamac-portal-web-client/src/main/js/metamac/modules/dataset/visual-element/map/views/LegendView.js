(function () {

    App.namespace('App.Map.LegendView');

    var SVGNode = App.svg.SVGNode;

    App.Map.LegendView = Backbone.View.extend({

        render : function () {
            this.destroy();
            var ranges = this.model.createRanges();

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
        }

    });

})();