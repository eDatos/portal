(function () {

    App.namespace("App.modules.dataset");

    var DisabledFeatureInternalPortalView = Backbone.View.extend({
        render: function () {
            this.$el.html('<b>' + I18n.t("filter.button.disabledFeature.internalPortal") + '</b>');
        }
    });

    App.modules.dataset.OptionsView = Backbone.View.extend({

        template: App.templateManager.get('dataset/dataset-options'),

        initialize: function (options) {
            this.filterDimensions = options.filterDimensions;
            this.optionsModel = options.optionsModel;
            this.buttons = options.buttons;

            this._bindEvents();
        },

        events: {
            "click .dataset-options-filter": "clickFilter",
            "click .change-visual-element button": "changeType",
            "click .visual-element-options-edit": "clickFilterLoader",
            "click .visual-element-options-fs": "clickFullScreen",
            "click .visual-element-options-share": "clickShare",
            "click .visual-element-options-save": "clickSave",
            "click .visual-element-options-download": "clickDownload",
            "click .visual-element-options-embed": "clickEmbed",
        },

        destroy: function () {
            this._unbindEvents();
        },

        _bindEvents: function () {
            this.listenTo(this.optionsModel, "change:type", this.render);
            this.listenTo(this.optionsModel, "change:fullScreen", this.updateFullscreenButton);
            this.listenTo(this.optionsModel, "change:filter", this.updateFilterButton);

            this.delegateEvents();
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        fullScreenIsAllowed: function () {
            return true;
        },

        isFullScreen: function () {
            return this.optionsModel.get('fullScreen');
        },

        isFilter: function () {
            return this.optionsModel.get('filter');
        },

        isOptions: function () {
            return this.optionsModel.get('options');
        },

        updateFullscreenButton: function () {
            var $fullScreenButton = this.$el.find('.visual-element-options-fs');
            $fullScreenButton.toggleClass('active', this.fullScreenIsAllowed() && this.isFullScreen());
        },

        updateFilterButton: function () {
            var $filterButton = this.$el.find('.dataset-options-filter');
            $filterButton.toggleClass('active', this.isFilter());
        },

        render: function () {
            this._unbindEvents();
            this._bindEvents();
            var self = this;

            var activeType = this.optionsModel.get('type');

            var fullScreenVisible = this.fullScreenIsAllowed();
            var fullScreenActive = this.isFullScreen();
            var filterActive = this.isFilter();
            var optionsEnabled = this.isOptions();

            if (optionsEnabled) {
                var buttons = this.buttons;

                var veTypeButtons = _.map(buttons, function (type) {
                    return {
                        title: I18n.t("filter.button." + type),
                        type: type,
                        btnClass: type === activeType ? 'active' : '',
                        enabled: self._isVisualizationButtonEnabled(type)
                    };
                });

                var context = {
                    veTypeButton: veTypeButtons,
                    filter: {
                        active: filterActive,
                        btnClass: filterActive ? 'active' : ''
                    },

                    fullScreen: {
                        visible: fullScreenVisible,
                        active: fullScreenActive,
                        btnClass: fullScreenActive ? 'active' : ''
                    },
                    visualize: this.optionsModel.get('visualize'),
                    widget: this.optionsModel.get('widget'),
                    widgetButton: this.optionsModel.get('widgetButton')
                };
                this.$el.html(this.template(context));
            }
            return this;
        },

        _isVisualizationButtonEnabled: function (type) {

            if (type == "line" && !this.filterDimensions.canDrawLineVisualizations()) {
                return false;
            }

            if ((type == "map" || type == "mapbubble") && !this.filterDimensions.canDrawMapVisualizations()) {
                return false;
            }

            if (this.optionsModel.get('widget')) {
                return type == "info" || type == this.optionsModel.get('widgetInitialType');
            }
            return true;
        },

        _isExportableImage: function () {
            return _.contains(['line', 'column', 'map', 'mapbubble'], this.optionsModel.get('type'));
        },

        clickFilter: function (e) {
            this.optionsModel.set('filter', !this.optionsModel.get('filter'));
        },

        changeType: function (e) {
            if (this.isFilter()) {
                $(document).trigger('closeFilter');
            }
            var $target = $(e.currentTarget);
            var type = $target.data('type');

            this.optionsModel.set('type', type);
        },

        clickFilterLoader: function (e) {
            if (!this.isFilter()) {
                this.trigger('launchFilter');
            }
        },

        clickFullScreen: function (e) {
            if (this.isFullScreen()) {
                this.trigger('exitFullScreen');
                this.$el.find('.visual-element-options-fs').removeClass("active");
            } else {
                if (this.fullScreenIsAllowed) {
                    this.trigger('enterFullScreen');
                    this.$el.find('.visual-element-options-fs').addClass("active");
                }
            }
        },

        clickShare: function (e) {
            e.preventDefault();
            var modalContentView = null;
            if (this.isInternalPortal()) {
                modalContentView = new DisabledFeatureInternalPortalView();
            } else {
                modalContentView = new App.modules.dataset.DatasetShareView({ filterDimensions: this.filterDimensions });
            }
            var title = I18n.t("filter.button.share");
            var modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            modal.show();
        },

        clickSave: function (e) {
            e.preventDefault();
            if (this.isInternalPortal()) {
                var modalContentView = new DisabledFeatureInternalPortalView();
                var title = I18n.t("filter.button.save");
                var modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
                modal.show();
            } else  if(sessionStorage.getItem("authToken")) {
                var self = this;
                metamac.authentication.ajax({
                    url: App.endpoints["external-users"] + "/account",
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("authToken")
                    },
                    method: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                }).done(function(val) {
                    var modalContentView = new App.modules.dataset.DatasetSaveView({ filterDimensions: self.filterDimensions, user: val });
                    var title = I18n.t("filter.save.modal.title");
                    var modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
                    modal.show();
                }).fail(function() {
                    self.clickLogin(e);
                });
            } else {
                this.clickLogin(e);
            }
        },

        clickLogin: function (e) {
            e.preventDefault();
            var modalContentView = null;
            if (this.isInternalPortal()) {
                modalContentView = new DisabledFeatureInternalPortalView();
            } else {
                modalContentView = new App.modules.dataset.DatasetLoginView({ filterDimensions: this.filterDimensions });
            }
            var title = I18n.t("login.modal.title");
            var modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            modal.show();
        },

        clickEmbed: function (e) {
            e.preventDefault();
            var modalContentView = null;
            if (this.isInternalPortal()) {
                modalContentView = new DisabledFeatureInternalPortalView();
            } else {
                modalContentView = new App.modules.dataset.DatasetEmbedView({ filterDimensions: this.filterDimensions });
            }
            var title = I18n.t("filter.button.embed");
            var modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            modal.show();
        },

        clickDownload: function (e) {
            e.preventDefault();
            var modalContentView = null;
            if (this.isInternalPortal() && !this._isExportableImage()) {
                modalContentView = new DisabledFeatureInternalPortalView();
            } else {
                modalContentView = new App.modules.dataset.DatasetDownloadView({ filterDimensions: this.filterDimensions, visualizationType: this.optionsModel.get('type') });
            }
            var title = I18n.t("filter.download.modal.title");
            var modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            modal.show();
        },

        isInternalPortal: function () {
            return App.config["installationType"] === "INTERNAL";
        }


    });


}());