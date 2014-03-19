(function () {
    "use strict";

    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetHelpView = Backbone.View.extend({

        template : App.templateManager.get("dataset/dataset-help"),

        id : "help",
        title : "Help",
        icon : "filter-sidebar-icon-help",

        initialize : function () {  
        	this.title = I18n.t("filter.sidebar.help.title");
        },

        render : function () {
            var context = {};
            this.$el.html(this.template(context));
        }

    });

}());