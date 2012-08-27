(function() {
    STAT4YOU.namespace("STAT4YOU.modules.dataset");
    
    STAT4YOU.modules.dataset.PageView = Backbone.View.extend({

        template : STAT4YOU.templateManager.get('dataset/dataset-page'),

        initialize : function (options) {
            this.metadata = options.metadata;
            this.attributes = options.attributes;
        },

        render : function(){
            var context = {
                metadata : this.metadata.toJSON(),
                attributes : this.attributes
            };

            this.$el.html(this.template(context));

            $('#dataset-title h2').dotdotdot({watch: window});

            return this;
        }
    
    });
})();
