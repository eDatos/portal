(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;
    var UserUtils = App.modules.user.UserUtils;

    App.namespace('App.modules.dataset.DatasetSaveView');

    App.modules.dataset.DatasetSaveView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-save"),
        templateResult: App.templateManager.get("components/modal/modal-message"),

        events: {
            "submit": "onSubmit"
        },

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.user = this.options.user;
            this.permalink = null;
        },

        onSubmit: function(e) {
            e.preventDefault();
            var filter = new App.modules.dataset.model.FilterModel({
                resourceName: this.filterDimensions.metadata.metadataResponse.description.text.find(this._findTextByCurrentLocale).value,
                name: document.getElementById("name").value || null,
                notes: document.getElementById("notes").value,
                permalink: this.permalink,
                userId: this.user.id
            });
            var self = this;
            UserUtils.saveFilter(filter).then(function () {
                self.renderResult(true);
            }).catch(function () {
                self.renderResult(false);
            });
        },

        render: function () {
            if (this.needsPermalink()) {
                var self = this;
                this.createPermalink().done(function (permalink) {
                    self.permalink = permalink.id;
                    self.$el.html(self.template({}));
                    document.getElementById("name").value = self.filterDimensions.metadata.metadataResponse.description.text.find(self._findTextByCurrentLocale).value;
                }).fail(function() {
                    self.renderResult(false);
                });
            } else {
                this.permalink = this.getExistingPermalinkId();
                this.$el.html(this.template({}));
            }
        },

        needsPermalink: function () {
            return !(App.config.widget && this.getExistingPermalinkId());
        },

        getExistingPermalinkId: function () {
            return this.filterDimensions.metadata.identifier().permalinkId;
        },

        createPermalink: function () {
            var permalinkContent = DatasetPermalink.buildPermalinkContent(this.filterDimensions);
            return DatasetPermalink.savePermalinkShowingCaptchaInElement(permalinkContent, this.$el);
        },

        renderResult: function (succeeded) {
            var context = {
                statusMessage: succeeded ? I18n.t("filter.save.modal.success") : I18n.t("filter.save.modal.failure")
            };
            this.$el.html(this.templateResult(context));
        },

        _findTextByCurrentLocale: function (val) {
            // TODO: alternativa si no se encuentra el idioma
            return val.lang === I18n.currentLocale();
        }

    });

}());