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
            "change #data-date": "onDataDateChosen"
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
                        name: document.getElementById("name").value || null,
                        notes: document.getElementById("notes").value,
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
                var loginEl = document.getElementById("save-error");
                loginEl.hidden = false;
                loginEl.innerText = errorMessage;
            }
        },

        validateFilter: function () {
            if(document.getElementById("version-last").checked) {
                if(this.isDataFieldNecessary() && !document.getElementById("data-quantity-related-input").disabled) {
                    var value = document.getElementById("data-quantity-related-input").valueAsNumber;
                    return Number.isInteger(value) && value > 1 ? undefined : I18n.t("filter.save.error.quantity");
                }
            }
        },

        isVersionFieldNecessary: function () {
            return this.filterDimensions.metadata.metadata.keepAllData;
        },

        isDataFieldNecessary: function () {
            return !_.isUndefined(this.getTemporalDimension()) && document.getElementById("version-last").checked;
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
                versionFieldIsNecessary: this.isVersionFieldNecessary(),
                defaultCustomConsultationName: this.filterDimensions.metadata.getTitle(),
                dimensionCategories: this.getTemporalDimensionCategories().map(function(category) { return category.attributes })
            }));
        },

        hideFieldData: function () {
            document.getElementById("field-data").hidden = true;
        },

        showFieldData: function () {
            document.getElementById("field-data").hidden = !this.isDataFieldNecessary();
        },

        onDataQuantityChosen: function () {
            document.getElementById("data-quantity-related-input").disabled = false;
            document.getElementById("data-date-related-input").disabled = true;
        },

        onDataDateChosen: function () {
            document.getElementById("data-quantity-related-input").disabled = true;
            document.getElementById("data-date-related-input").disabled = false;
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
                if(document.getElementById("data-quantity").checked) {
                    dynamicSelectionBuilder.selectNLastTemporalDimensionCategories(document.getElementById("data-quantity-related-input").valueAsNumber);
                } else {
                    var chosenCategoryAttributes = this.getTemporalDimensionCategories().find(function(val) {
                        return val.get("id") === document.getElementById("data-date-related-input").value
                    }).attributes;
                    dynamicSelectionBuilder.selectTemporalDimensionCategoriesAfterDate(chosenCategoryAttributes);
                }
            }
            var permalinkContent = DatasetPermalink.buildPermalinkContent(
                this.filterDimensions,
                dynamicSelectionBuilder.build(),
                this.isVersionFieldNecessary() ? document.getElementById("version-last").checked : true);
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