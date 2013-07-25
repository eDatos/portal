(function () {
    'use strict';

    App.namespace('App.svg.SVGNode');

    var xmlns = "http://www.w3.org/2000/svg";

    App.svg.SVGNode = function (name) {
        if (_.isString(name)) {
            this.name = name;
            this.node = document.createElementNS(xmlns, name);
        } else {
            this.node = name;
        }
        this.attrs = {};
    };

    App.svg.SVGNode.factory = function (name, n) {
        n = n || 1;
        var result = [];
        for(var i = 0; i < n; i++) {
            result.push(new App.svg.SVGNode(name));
        }
        return result;
    };

    App.svg.SVGNode.prototype = {

        set : function (attr, value) {
            if (_.isObject(attr)) {
                _.each(attr, function (value, key) {
                    this.attrs[key] = value;
                    this.node.setAttributeNS(null, key, value.toString());
                }, this);
            } else {
                this.attrs[attr] = value;
                this.node.setAttributeNS(null, attr, value.toString());
            }
        },

        append : function (nodes) {
            if (!_.isArray(nodes)) {
                nodes = [nodes];
            }
            _.each(nodes, function (node) {
                this.node.appendChild(node.node);
            }, this);
        },

        appendFirst : function(nodes) {
            if (!_.isArray(nodes)) {
                nodes = [nodes];
            }
            _.each(nodes, function (node) {
                this.node.insertBefore(node.node, this.node.firstChild);
            }, this);
        },

        getFrame : function () {
            var box = this.node.getBBox();
            return {x : box.x, y : box.y, width : box.width, height : box.height};
        },

        alignBottomRight : function (referenceNodeFrame, marginBottom, marginRight) {
            var _marginBottom = marginBottom || 0;
            var _marginRight = marginRight || 0;
            var frame = this.node.getBBox();
            var transformX = referenceNodeFrame.width - frame.width - _marginRight;
            var transformY = referenceNodeFrame.height - frame.height - _marginBottom;
            this.set("transform", "translate(" + transformX + ", " + transformY + ")");
        },

        addMargins : function (margin) {
            var frame = this.getFrame();
            this.set({
                width : frame.width + 2 * margin,
                height : frame.height + 2 * margin,
                y : frame.y - margin,
                x : frame.x - margin
            });
        }

    };

})();