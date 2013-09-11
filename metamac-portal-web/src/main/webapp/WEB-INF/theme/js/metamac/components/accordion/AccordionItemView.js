(function () {
    "use strict";

    App.namespace("App.components.accordion");
    App.components.accordion.AccordionItemView = {

        itemDeselect : function () {
            this.minimize();
            this.model.set({ selected : false });
        },

        itemSelect : function () {
            if (this.model.get("selected") === true) {
                return;
            }
            this.model.set({ selected : true });
            this.maximize();

            this.vent.trigger("AccordionView:SaveSelection", this.model);
        },

        minimize : function () {
            this.$el.find(this.elContent).removeClass("in");
        },

        maximize : function () {
            this.$el.find(this.elContent).addClass("in");
        }

    };

}());