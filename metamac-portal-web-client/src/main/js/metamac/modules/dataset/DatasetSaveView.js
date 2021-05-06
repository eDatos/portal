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
            const name = document.getElementById("name").value || null;
            const notes = document.getElementById("notes").value;
            this.savePermalink(this.permalink, name, notes).done(() => {
                this.renderResult(true);
            }).fail(function () {
                this.renderResult(false);
            });
        },

        render: function () {
            this.createPermalink().done((permalink) => {
                this.permalink = permalink;
                this.$el.html(this.template({}));
            }).fail(() => {
                this.renderResult(false);
            });
        },

        createPermalink: function () {
            const permalinkContent = DatasetPermalink.buildPermalinkContent(this.filterDimensions);
            return DatasetPermalink.savePermalinkShowingCaptchaInElement(permalinkContent, this.$el);
        },

        savePermalink: function (permalink, name, notes) {
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
                    name: name,
                    resourceName: resourceName,
                    externalUser: { id: this.user.id },
                    permalink: permalink.selfLink.href,
                    notes: notes
                })
            });
        },

        renderResult: function (succeeded) {
            const context = {
                statusMessage: succeeded ? I18n.t("filter.save.modal.success") : I18n.t("filter.save.modal.failure")
            };
            this.$el.html(this.templateResult(context));
        }

    });

}());