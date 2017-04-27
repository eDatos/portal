(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;

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
            var permalinkContent = DatasetPermalink.buildPermalinkContent(this.filterDimensions);
            return DatasetPermalink.savePermalinkShowingCaptchaInElement(permalinkContent, this.$el);            
        },

        getWidgetUrl : function () {
            return App.endpoints["statistical-visualizer"] + '/js/widget.js';
        },

        getSharedVisualizerUrl : function() {
            return [window.location.protocol, '//', window.location.host, window.location.pathname].join('');
        },

        removeParamFromUrl : function(url, param) {
            var paramRegex = new RegExp(param + '=[^&]+&');
            return url.replace(paramRegex,'');
        },

        getParams : function (permalinkId) {
            var urlQuery = this.removeParamFromUrl(window.location.search.substr(1), 'sharedVisualizerUrl');
            return urlQuery + window.location.hash + "/permalink/" + permalinkId;
        },

        renderEmbed : function (permalinkId) {
            var context = {
                widgetUrl : this.getWidgetUrl(),
                params : this.getParams(permalinkId),
                sharedVisualizerUrl : this.getSharedVisualizerUrl(),
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