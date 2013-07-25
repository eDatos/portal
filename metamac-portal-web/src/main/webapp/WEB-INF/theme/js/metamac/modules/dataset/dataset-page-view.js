(function () {
    App.namespace("App.modules.dataset");

    var providersWithImgs = ["IBESTAT", "EC"];

    App.modules.dataset.PageView = Backbone.View.extend({

        template : App.templateManager.get('dataset/dataset-page'),

        initialize : function (options) {
            this.metadata = options.metadata;
            this.attributes = options.attributes;
        },

        _providerHasImg : function () {
            return _.contains(providersWithImgs, this.metadata.getProvider());
        },

        render : function () {
            var context = {
                metadata : this.metadata.toJSON(),
                providerHasImg : this._providerHasImg(),
                attributes : this.attributes
            };
            this.$el.html(this.template(context));

            $('.dataset-header-title').dotdotdot({watch : window});

            return this;
        }

    });
})();
