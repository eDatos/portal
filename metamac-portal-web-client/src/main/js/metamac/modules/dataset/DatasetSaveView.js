(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;
    var UserUtils = App.modules.user.UserUtils;
    var DynamicSelectionBuilder = App.modules.dataset.DatasetDynamicSelectionBuilder;

    App.namespace('App.modules.dataset.DatasetSaveView');

    App.modules.dataset.DatasetSaveView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-save"),
        templateResult: App.templateManager.get("components/modal/modal-message"),

        events: {
            "submit": "onSubmit",
            "change #version-current": "hideFieldData",
            "change #version-last": "showFieldData",
            "change #data-quantity": "onDataQuantityChosen",
            "change #data-date": "onDataDateChosen",
            "focus input, textarea, select": "hideError"
        },

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.user = this.options.user;
        },

        onSubmit: function(e) {
            e.preventDefault();
            var errorMessage = this.validateFilter();
            if(!errorMessage) {
                var self = this;
                this.createPermalink().done(function (permalink) {
                    var filter = new App.modules.dataset.model.FilterModel({
                        resourceName: self.filterDimensions.metadata.getTitle(),
                        name: self.$("#name").val() || null,
                        notes: self.$("#notes").val(),
                        permalink: permalink.id,
                        userId: self.user.id
                    });
                    UserUtils.saveFilter(filter).then(function () {
                        self.renderResult(true);
                    }).catch(function () {
                        self.renderResult(false);
                    });
                }).fail(function () {
                   self.renderResult(false);
                });
            } else {
                var loginEl = this.$("#save-error")[0];
                loginEl.hidden = false;
                loginEl.innerText = errorMessage;
            }
        },

        hideError: function () {
            this.$("#save-error")[0].hidden = true;
        },

        validateFilter: function () {
            if(this.isDataFieldNecessary() && !this.$("#data-quantity-related-input")[0].disabled) {
                var value = this.$("#data-quantity-related-input")[0].valueAsNumber;
                return Number.isInteger(value) && value >= 1 ? undefined : I18n.t("filter.save.error.quantity");
            }
        },

        isVersionFieldNecessary: function () {
            return (App.queryParams.type === "dataset") && this.filterDimensions.metadata.metadata.keepAllData;
        },

        isDataFieldNecessary: function () {
            return (App.queryParams.type === "dataset") && !_.isUndefined(this.getTemporalDimension()) && this.$("#version-last").length > 0 && this.$("#version-last")[0].checked;
        },

        getTemporalDimension: function () {
            return this.filterDimensions.models.find(function(dimension) {
                return dimension.get("type") === "TIME_DIMENSION"
            });
        },

        getTemporalDimensionCategories: function () {
            var temporalDimension = this.getTemporalDimension();
            return temporalDimension ? temporalDimension.get("representations").models : [];
        },

        render: function () {
            this.$el.html(this.template({
                isDataset: (App.queryParams.type === "dataset"),
                versionFieldIsNecessary: this.isVersionFieldNecessary(),
                defaultCustomConsultationName: this.filterDimensions.metadata.getTitle(),
                dimensionCategories: this.getTemporalDimensionCategories().map(function(category) { return category.attributes })
            }));
        },

        hideFieldData: function () {
            this.$("#field-data")[0].hidden = true;
        },

        showFieldData: function () {
            this.$("#field-data")[0].hidden = !this.isDataFieldNecessary();
        },

        onDataQuantityChosen: function () {
            this.$("#data-quantity-related-input")[0].disabled = false;
            this.$("#data-date-related-input")[0].disabled = true;
        },

        onDataDateChosen: function () {
            this.$("#data-quantity-related-input")[0].disabled = true;
            this.$("#data-date-related-input")[0].disabled = false;
        },

        needsPermalink: function () {
            return !(App.config.widget && this.getExistingPermalinkId());
        },

        getExistingPermalinkId: function () {
            return this.filterDimensions.metadata.identifier().permalinkId;
        },

        createPermalink: function () {
            var dynamicSelectionBuilder = DynamicSelectionBuilder();
            if(this.isDataFieldNecessary()) {
                if(this.$("#data-quantity")[0].checked) {
                    dynamicSelectionBuilder.selectNLastTemporalDimensionCategories(this.$("#data-quantity-related-input")[0].valueAsNumber);
                } else {
                    var chosenCategoryAttributes = this.getTemporalDimensionCategories().find(function(val) {
                        return val.get("id") === self.$("#data-date-related-input")[0].value
                    }).attributes;
                    dynamicSelectionBuilder.selectTemporalDimensionCategoriesAfterDate(chosenCategoryAttributes);
                }
            }
            var permalinkContent = DatasetPermalink.buildPermalinkContent(
                this.filterDimensions,
                dynamicSelectionBuilder.build(),
                this.isVersionFieldNecessary() ? this.$("#version-last")[0].checked : true);
            return DatasetPermalink.savePermalinkWithUserAuth(permalinkContent);
        },

        renderResult: function (succeeded) {
            var context = {
                statusMessage: succeeded ? I18n.t("filter.save.modal.success") : I18n.t("filter.save.modal.failure")
            };
            this.$el.html(this.templateResult(context));
        }
    });

}());