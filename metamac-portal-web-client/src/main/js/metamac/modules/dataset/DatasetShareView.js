(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;

    App.namespace('App.modules.dataset.DatasetShareView');

    App.modules.dataset.DatasetShareView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-share"),

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
        },

        render: function () {
            var self = this;
            var savePermalinkRequest = this.savePermalink();
            savePermalinkRequest.done(function (response) {
                self.renderShare(response.id);
            });
        },

        savePermalink: function () {
            var permalinkContent = DatasetPermalink.buildPermalinkContent(this.filterDimensions);
            return DatasetPermalink.savePermalinkShowingCaptchaInElement(permalinkContent, this.$el);
        },

        getSharedVisualizerParams: function (permalinkId) {
            return [
                'permalink',
                '=',
                permalinkId
            ].join('')
        },

        getSharedUrl: function (permalinkId) {
            return [
                this.filterDimensions.metadata.getSharedVisualizerUrl(),
                '?',
                this.getSharedVisualizerParams(permalinkId)
            ].join('');
        },

        renderShare: function (permalinkId) {
            var context = {
                url: this.getSharedUrl(permalinkId),
                title: this.filterDimensions.metadata.getTitle(),
                description: this.filterDimensions.metadata.getDescription()
            };
            this.$el.html(this.template(context));

            var config = {
                data_track_addressbar: true
            };

            var share = {
                url: context.url,
                title: context.title,
                description: context.description,
                passthrough: {
                    twitter: {
                        via: 'istac_es',
                        text: context.title
                    }
                }
            };

            addthis.toolbox(".addthis_toolbox", config, share);
        }

    });

}());