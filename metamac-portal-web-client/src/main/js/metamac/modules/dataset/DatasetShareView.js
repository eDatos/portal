(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetShareView');

    App.modules.dataset.DatasetShareView = Backbone.View.extend({

        template : App.templateManager.get("dataset/dataset-share"),

        initialize : function () {
            this.filterDimensions = this.options.filterDimensions;
        },

        render : function () {
            var self = this;
            var savePermalinkRequest = this.savePermalink();
            savePermalinkRequest.done(function (response){
                self.renderShare(response.id);
            });
        },

        savePermalink : function () {
            var permalinkContent = JSON.stringify(this.filterDimensions.exportJSON());
            return App.modules.dataset.DatasetPermalink.savePermalinkShowingCaptchaInElement(permalinkContent, this.$el);
        },

        renderShare : function (permalinkId) {
            var context = {
                url : window.location.href + "/permalink/" + permalinkId,
                title : this.filterDimensions.metadata.getTitle()
            };
            this.$el.html(this.template(context));

            var config = {
                data_track_addressbar : true
            };

            var share = {
                url : context.url,
                title : context.title,
                passthrough : {
                    twitter : {
                    	via : 'istac_es',
                    	text: context.title + ' ' + context.url
                    }
                }
            };

            addthis.toolbox(".addthis_toolbox", config, share);
        }

    });

}());