(function () {
    "use strict";

    App.namespace("App.modules.search.SearchActiveProvider");

    App.modules.search.SearchActiveProvider = Backbone.Model.extend({

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
                return App.apiContext + "/providers/" + this.activeProvider;
            }
        }

    });

}());