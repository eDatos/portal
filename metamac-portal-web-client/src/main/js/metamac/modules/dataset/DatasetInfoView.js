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
            
            this.listenTo(this.dataset.data, "hasNewData", this.updateDatasetAttributes ); 
        },
        
        updateDatasetAttributes : function() {
            this.datasetAttributes = this.dataset.data.getDatasetAttributes();
        },

        render : function () {
            var context = {
                metadata : this.dataset.metadata.toJSON(),
                datasetAttributes : this.datasetAttributes
            };
            this.$el.html(this.template(context));
        }

    });

}());