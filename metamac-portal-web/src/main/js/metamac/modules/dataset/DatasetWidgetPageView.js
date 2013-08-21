(function () {

    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetWidgetPageView = Backbone.View.extend({

        template : App.templateManager.get('dataset/dataset-widget-page'),

        initialize : function (options) {
            this.metadata = options.metadata;
            this.attributes = options.attributes;
        },

        render : function () {
            var context = {
                metadata : this.metadata.toJSON(),
                attributes : this.attributes,
                showOptions : this.options.showOptions,
                showExport : this.options.showExport
            };
            this.$el.html(this.template(context));
            return this;
        }
    });

}());