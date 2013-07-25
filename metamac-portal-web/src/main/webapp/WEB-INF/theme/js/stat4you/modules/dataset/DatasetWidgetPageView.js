(function () {

    STAT4YOU.namespace("STAT4YOU.modules.dataset");

    STAT4YOU.modules.dataset.DatasetWidgetPageView = Backbone.View.extend({

        template : STAT4YOU.templateManager.get('dataset/dataset-widget-page'),

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