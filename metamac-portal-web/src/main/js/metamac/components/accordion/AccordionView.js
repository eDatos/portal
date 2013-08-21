(function () {
    "use strict";

    App.namespace("App.components.accordion");

    App.components.accordion.AccordionView = Backbone.Marionette.CompositeView.extend({

        constructor : function () {
            Backbone.Marionette.CompositeView.prototype.constructor.apply(this, arguments);

            this.vent = new Backbone.Wreqr.EventAggregator();
            this.vent.on("AccordionView:SaveSelection", this.saveSelection, this);
            this.on("before:item:added", function (view) {
                view.vent = this.vent;
            });
        },

        saveSelection : function (model) {
            if (this.currentSelectedModel) {
                var childView = this.children.findByModel(this.currentSelectedModel);
                if (childView) {
                    childView.itemDeselect();
                }
            }
            this.currentSelectedModel = model;
        }

    });

}());