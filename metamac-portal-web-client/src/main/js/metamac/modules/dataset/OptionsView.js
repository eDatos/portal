(function () {

    App.namespace("App.modules.dataset");

    App.modules.dataset.OptionsView = Backbone.View.extend({

        template : App.templateManager.get('dataset/dataset-options'),

        initialize : function (options) {
            this.filterDimensions = options.filterDimensions;
            this.optionsModel = options.optionsModel;
            this.buttons = options.buttons;

            this.listenTo(this.optionsModel, "change:type", this.render);
        },

        events : {
            "click .change-visual-element button" : "changeType",
            "click .visual-element-options-edit" : "clickFilterLoader",
            "click .visual-element-options-fs" : "clickFullScreen",
            "click .visual-element-options-share" : "clickShare",
            "click .visual-element-options-download" : "clickDownload"
        },

        destroy : function () {
            this.stopListening();
        },

        fullScreenIsAllowed : function () {
            var activeType = this.optionsModel.get('type');
            return activeType !== 'table';
        },

        isFullScreen : function () {
            return this.optionsModel.get('fullScreen');
        },

        isFilter : function () {
            return this.optionsModel.get('filter');
        },

        isOptions : function () {
            return this.optionsModel.get('options');
        },

        render : function () {
            var activeType = this.optionsModel.get('type');

            var fullScreenVisible = this.fullScreenIsAllowed();
            var fullScreenActive = this.isFullScreen();
            var filterActive = this.isFilter();
            var optionsEnabled = this.isOptions();

            if (optionsEnabled) {
                var buttons = this.buttons;

                if (this.isFullScreen()) {
                    buttons = _.without(buttons, "table");
                }

                var veTypeButtons = _.map(buttons, function (type) {
                    return {
                        title : I18n.t("filter.button." + type),
                        type : type,
                        btnClass : type === activeType ? 'active' : ''
                    };
                });

                var context = {
                    veTypeButton : veTypeButtons,
                    filter : {
                        active : filterActive,
                        btnClass : filterActive ? 'active' : ''
                    },

                    fullScreen : {
                        visible : fullScreenVisible,
                        active : fullScreenActive,
                        btnClass : fullScreenActive ? 'active' : ''
                    },
                    visualize : this.optionsModel.get('visualize'),
                    widget : this.optionsModel.get('widget')
                };
                this.$el.html(this.template(context));
            }

        },

        changeType : function (e) {
            if (this.isFilter()) {
                $(document).trigger('closeFilter');
            }
            var $target = $(e.currentTarget);
            var type = $target.data('type');

            this.optionsModel.set('type', type);
        },

        clickFilterLoader : function (e) {
            if (!this.isFilter()) {
                this.trigger('launchFilter');
            }
        },

        clickFullScreen : function (e) {
            if (this.isFullScreen()) {
                this.trigger('exitFullScreen');
            } else {
                if (this.fullScreenIsAllowed) {
                    this.trigger('enterFullScreen');
                }
            }
        },

        clickShare : function (e) {
            e.preventDefault();

            var title = I18n.t("filter.button.share");
            var modalContentView = new App.modules.dataset.DatasetShareView({filterDimensions : this.filterDimensions});
            var modal = new App.components.modal.ModalView({title : title, contentView : modalContentView});
            modal.show();
        },

        clickDownload : function (e) {
            e.preventDefault();

            var title = I18n.t("filter.button.download");
            var modalContentView = new App.modules.dataset.DatasetDownloadView({filterDimensions : this.filterDimensions});
            var modal = new App.components.modal.ModalView({title : title, contentView : modalContentView});
            modal.show();
        }


    });


}());