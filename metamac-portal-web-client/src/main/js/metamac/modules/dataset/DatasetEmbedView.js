(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetEmbedView');

    App.modules.dataset.DatasetEmbedView = Backbone.View.extend({

        template : App.templateManager.get("dataset/dataset-embed"),

        initialize : function () {
            this.filterDimensions = this.options.filterDimensions;
        },

        render : function () {
            var self = this;
            var savePermalinkRequest = this.savePermalink();
            savePermalinkRequest.done(function (response){
                self.renderEmbed(response.id);
            });
        },

        savePermalink : function () {
            var permalinkContent = JSON.stringify(this.filterDimensions.exportJSON());
            return App.modules.dataset.DatasetPermalink.savePermalinkShowingCaptchaInElement(permalinkContent, this.$el);
        },

        getWidgetUrl : function () {
            return App.endpoints["statistical-visualizer"] + '/js/widget.js';
        },

        renderEmbed : function (permalinkId) {
            var context = {
                widgetUrl : this.getWidgetUrl(),
                params : window.location.search.substr(1) + window.location.hash + "/permalink/" + permalinkId,
                defaultId : 'dataset-widget',
                defaultWidth : 500,
                defaultHeight : 400,
                title : this.filterDimensions.metadata.getTitle(),
                description : this.filterDimensions.metadata.getDescription()
            };
            this.$el.html(this.template(context));
        }

    });

}());