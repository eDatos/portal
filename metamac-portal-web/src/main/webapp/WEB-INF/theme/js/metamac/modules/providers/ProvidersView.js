(function () {
    "use strict";

    App.namespace("App.modules.providers.ProvidersView");

    App.modules.providers.ProvidersView = Backbone.View.extend({
        template : App.templateManager.get("providers/providers"),

        events : {
            "click #provider-list a" : "navigate"
        },

        render : function(){
            var context = {
                providers : this.collection.toJSON()
            };

            this.$el.html(this.template(context));
            return this;
        },

        navigate : function(evt){
            // Prevent new tab http://dev.tenfarms.com/posts/proper-link-handling
            if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey) {
                // Get the anchor href and protcol
                var $target = $(evt.currentTarget),
                    href = $target.attr("href"),
                    protocol = this.protocol + "//";

                // Ensure the protocol is not part of URL, meaning its relative.
                if (href && href.slice(0, protocol.length) !== protocol) {
                    evt.preventDefault();
                    Backbone.history.navigate(href, true);
                }
                return false;
            }
        }

    });

}());
