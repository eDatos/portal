(function () {

    App.namespace("App.modules.dataset");

    App.modules.dataset.OptionsView = Backbone.View.extend({

        template : App.templateManager.get('dataset/dataset-options'),

        initialize : function (options) {
            this.filterDimensions = options.filterDimensions;
            this.optionsModel = options.optionsModel;
            this.buttons = options.buttons;

            this._bindEvents();
        },

        events : {
            "click .dataset-options-filter" : "clickFilter",
            "click .change-visual-element button" : "changeType",
            "click .visual-element-options-edit" : "clickFilterLoader",
            "click .visual-element-options-fs" : "clickFullScreen",
            "click .visual-element-options-share" : "clickShare",
            "click .visual-element-options-download" : "clickDownload",
            "click .visual-element-options-embed" : "clickEmbed",
        },

        destroy : function () {
            this._unbindEvents();
        },

        _bindEvents : function() {
            this.listenTo(this.optionsModel, "change:type", this.render);
            this.listenTo(this.optionsModel, "change:fullScreen", this.updateFullscreenButton);
            this.listenTo(this.optionsModel, "change:filter", this.updateFilterButton);

            this.delegateEvents();
        },

        _unbindEvents : function() {
            this.stopListening();
        },

        fullScreenIsAllowed : function () {
            return true;
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

        updateFullscreenButton : function() {
            var $fullScreenButton = this.$el.find('.visual-element-options-fs');
            $fullScreenButton.toggleClass('active', this.fullScreenIsAllowed() && this.isFullScreen());
        },

        updateFilterButton : function() {
            var $filterButton = this.$el.find('.dataset-options-filter');
            $filterButton.toggleClass('active', this.isFilter());
        },

        render : function () {
            this._unbindEvents();        
            this._bindEvents();
            
            var activeType = this.optionsModel.get('type');

            var fullScreenVisible = this.fullScreenIsAllowed();
            var fullScreenActive = this.isFullScreen();
            var filterActive = this.isFilter();
            var optionsEnabled = this.isOptions();

            if (optionsEnabled) {
                var buttons = this.buttons;

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
                    widget : this.optionsModel.get('widget'),
                    widgetButton : this.optionsModel.get('widgetButton')
                };
                this.$el.html(this.template(context));
            }
            return this;
        },

        clickFilter : function(e) {
            this.optionsModel.set('filter', !this.optionsModel.get('filter'));
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
                this.$el.find('.visual-element-options-fs').removeClass("active");
            } else {
                if (this.fullScreenIsAllowed) {
                    this.trigger('enterFullScreen');
                    this.$el.find('.visual-element-options-fs').addClass("active");
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

        clickEmbed : function (e) {
            e.preventDefault();

            var title = I18n.t("filter.button.embed");
            var modalContentView = new App.modules.dataset.DatasetEmbedView({filterDimensions : this.filterDimensions});
            var modal = new App.components.modal.ModalView({title : title, contentView : modalContentView});
            modal.show();
        },

        clickDownload : function (e) {
            e.preventDefault();

            var title = I18n.t("filter.button.download");
            var modalContentView = new App.modules.dataset.DatasetDownloadView({filterDimensions : this.filterDimensions, visualizationType :  this.optionsModel.get('type') });
            var modal = new App.components.modal.ModalView({title : title, contentView : modalContentView});
            modal.show();
        }


    });


}());