(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;

    App.namespace('App.modules.dataset.DatasetSaveView');

    App.modules.dataset.DatasetSaveView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-save"),

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
        },

        render: function () {
            var self = this;
            if (this.needsPermalink()) {
                var savePermalinkRequest = this.saveFilter();
                savePermalinkRequest.done(function (response) {
                    self.renderFilter(true);
                }).fail(function (response) {
                    self.renderFilter(false);
                });
            } else {
                self.renderFilter(this.getExistingPermalinkId());
            }
        },

        needsPermalink: function () {
            return !(App.config.widget && this.getExistingPermalinkId());
        },

        getExistingPermalinkId: function () {
            return this.filterDimensions.metadata.identifier().permalinkId;
        },

        saveFilter: function () {
            var permalinkContent = DatasetPermalink.buildPermalinkContent(this.filterDimensions);
            return metamac.authentication.ajax({
                url: App.endpoints["user-resources"] + "/filters",
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ content: permalinkContent }),
                xhrFields: {
                    withCredentials: true,
                }
            }, {
                captchaEl: this.$el
            });
        },

        renderFilter: function (succeeded) {
            const context = {
                statusMessage: succeeded ? I18n.t("filter.save.success") : I18n.t("filter.save.failure")
            };
            this.$el.html(this.template(context));
        }

    });

}());