(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;

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
            var name = document.getElementById("name").value || null;
            var notes = document.getElementById("notes").value;
            var self = this;
            this.savePermalink(this.permalink, name, notes).done(function() {
                self.renderResult(true);
            }).fail(function() {
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

        savePermalink: function (permalink, name, notes) {
            var resourceName = this.filterDimensions.metadata.metadataResponse.description.text.find(this._findTextByCurrentLocale).value;
            return metamac.authentication.ajax({
                url: App.endpoints["external-users"] + '/filters',
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("authToken")
                },
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    id: null,
                    name: name,
                    resourceName: resourceName,
                    externalUser: { id: this.user.id },
                    permalink: permalink,
                    notes: notes
                })
            });
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