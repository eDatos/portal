(function () {
    "use strict";

    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetInfoView = Backbone.View.extend({

        template : App.templateManager.get("dataset/dataset-info"),

        id : "info",
        title : "Info",
        icon : "filter-sidebar-icon-info",

        initialize : function (options) {
            this.dataset = options.dataset;
        },

        render : function () {
            var context = {
                metadata : this.dataset.metadata.toJSON()
            };
            this.$el.html(this.template(context));
        }

    });

}());