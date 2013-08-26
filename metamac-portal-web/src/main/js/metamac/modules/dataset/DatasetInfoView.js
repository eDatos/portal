(function () {
    "use strict";

    App.namespace("App.modules.dataset");

    var providersWithImgs = ["IBESTAT", "EC"];

    App.modules.dataset.DatasetInfoView = Backbone.View.extend({

        template : App.templateManager.get("dataset/dataset-info"),

        id : "info",
        title : "Info",
        icon : "filter-sidebar-icon-info",

        initialize : function (options) {
            this.dataset = options.dataset;
            this.datasetAttributes = options.datasetAttributes;
        },

        _providerHasImg : function () {
            return _.contains(providersWithImgs, this.dataset.metadata.getProvider());
        },

        render : function () {
            var context = {
                metadata : this.dataset.metadata.toJSON(),
                providerHasImg : this._providerHasImg(),
                attributes : this.datasetAttributes
            };
            this.$el.html(this.template(context));
        }

    });

}());