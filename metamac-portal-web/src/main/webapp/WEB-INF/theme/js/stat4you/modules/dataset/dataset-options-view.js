(function() {

    STAT4YOU.namespace("STAT4YOU.modules.dataset");
    
    STAT4YOU.modules.dataset.OptionsView = Backbone.View.extend({

        initialize : function (options) {
            this.buttons = options.buttons;
        },

        template : STAT4YOU.templateManager.get('dataset/dataset-options'),

        events : {
            "click #change-visual-element button" : "changeType",
            "click #filter-loader" : "clickFilterLoader",
            "click #enter-exit-fs" : "clickFullScreen"
        },

        fullScreenIsAllowed : function () {
            var activeType = this.model.get('type');
            return activeType !== 'table';
        },

        isFullScreen : function () {
            return this.model.get('fullScreen');
        },

        isFilter : function () {
            return this.model.get('filter');
        },
        
        isOptions : function () {
            return this.model.get('options');
        },

        render : function() {
            var self = this;
            var activeType = this.model.get('type');

            var fullScreenVisible = this.fullScreenIsAllowed();
            var fullScreenActive = this.isFullScreen();
            var filterActive = this.isFilter();
            var optionsEnabled = this.isOptions();

            if (optionsEnabled) {
                var buttons = this.buttons;

                if (this.isFullScreen()) {
                    buttons = _.without(buttons, "table");
                }

                var veTypeButtons = _.map(buttons, function(type){
                    return {
                        title : I18n.t("filter.button."+type),
                        type : type,
                        btnClass : type === activeType? 'active' : ''
                    };
                });

                var context = {
                    veTypeButton : veTypeButtons,
                    filter : {
                        active : filterActive,
                        btnClass : filterActive? 'active' : ''
                    },

                    fullScreen : {
                        visible : fullScreenVisible,
                        active : fullScreenActive,
                        btnClass : fullScreenActive? 'active' : ''
                    }
                };
                this.$el.html(this.template(context));
            }

        },

        changeType : function(e) {
            if(this.isFilter()) {
                $(document).trigger('closeFilter');
            }
            var $target = $(e.currentTarget);
            var type = $target.data('type');
            this.model.set('type', type);
        },

        clickFilterLoader : function (e) {
            if(!this.isFilter()) {
                this.trigger('launchFilter');
            }
        },

        clickFullScreen : function (e) {
            if(this.isFullScreen()){
                this.trigger('exitFullScreen');
            } else {
                if(this.fullScreenIsAllowed) {
                    this.trigger('launchFullScreen');
                }
            }
        }
    });
    
    
})();