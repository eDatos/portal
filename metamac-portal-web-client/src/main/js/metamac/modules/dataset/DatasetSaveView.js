(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;

    App.namespace('App.modules.dataset.DatasetSaveView');

    App.modules.dataset.DatasetSaveView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-save"),

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.user = this.options.user;
        },

        render: function () {
            var self = this;
            this.createPermalink().done(function (permalink) {
                self.savePermalink(permalink).done(() => {
                    self.renderResult(true);
                }).fail(function () {
                    self.renderResult(false);
                });
            }).fail(function () {
                self.renderResult(false);
            });
        },

        createPermalink: function () {
            var permalinkContent = DatasetPermalink.buildPermalinkContent(this.filterDimensions);
            return DatasetPermalink.savePermalinkShowingCaptchaInElement(permalinkContent, this.$el);
        },

        savePermalink: function (permalink) {
            const resourceName = this.filterDimensions.metadata.metadataResponse.description.text.find(val => val.lang === I18n.currentLocale()).value;
            return metamac.authentication.ajax({
                url: App.endpoints["user-resources"] + '/filters',
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("authToken")
                },
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    id: null,
                    name: "Mi primer filtro",
                    resourceName: resourceName,
                    externalUser: { id: this.user.id },
                    permalink: permalink.selfLink.href,
                    notes: "."
                })
            });
        },

        renderResult: function (succeeded) {
            const context = {
                statusMessage: succeeded ? I18n.t("filter.save.success") : I18n.t("filter.save.failure")
            };
            this.$el.html(this.template(context));
        }

    });

}());