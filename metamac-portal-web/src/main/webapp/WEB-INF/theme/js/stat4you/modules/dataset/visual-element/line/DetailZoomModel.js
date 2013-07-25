(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.VisualElement.line.DetailZoomModel");

    STAT4YOU.VisualElement.line.DetailZoomModel = Backbone.Model.extend({

        defaults : {
            start : 0,
            stop : 0.5,
            step : 0.1
        },

        validate : function (attrs) {
            if (attrs.start < 0 || attrs.start > 1) {
                return "invalid start";
            }

            if (attrs.stop < 0 || attrs.stop > 1) {
                return "invalid stop";
            }

            if (attrs.start > attrs.stop) {
                return "start must be bigger than stop";
            }
        },

        moveStepRight : function () {
            this.moveDistance(this.get('step'));
        },

        moveStepLeft : function () {
            this.moveDistance(-this.get('step'));
        },

        moveDistance : function (distance) {
            var start = this.get('start') + distance;
            var stop = this.get('stop') + distance;
            start = start < 0 ? 0 : start;
            stop = stop > 1 ? 1 : stop;
            this.set({start : start, stop : stop}, {validate : true});
        }

    });
}());