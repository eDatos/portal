(function () {
    STAT4YOU.namespace("STAT4YOU.modules.dataset");

    var providersWithImgs = ["IBESTAT", "EC"];

    STAT4YOU.modules.dataset.PageView = Backbone.View.extend({

        template : STAT4YOU.templateManager.get('dataset/dataset-page'),

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
