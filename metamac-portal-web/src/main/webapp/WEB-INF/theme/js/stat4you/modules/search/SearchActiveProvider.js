(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.search.SearchActiveProvider");

    STAT4YOU.modules.search.SearchActiveProvider = Backbone.Model.extend({

        setActiveProvider : function (activeProvider) {
            this.activeProvider = activeProvider;
            if (activeProvider) {
                this.fetch();
            } else {
                this.clear();
            }
        },

        url : function () {
            if (this.activeProvider) {
                return STAT4YOU.apiContext + "/providers/" + this.activeProvider;
            }
        }

    });

}());