(function () {

    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.admin.status");

    var RUNNING_CSS_CLASS = "running";

    STAT4YOU.modules.admin.status.StatusView = Backbone.View.extend({

        initialize : function () {
            this.listenTo(this.collection, 'add', this.add);
            this.listenTo(this.collection, 'remove', this.remove);
        },

        className : function (model) {
            var name = model.get("name");
            return "." + name.slice(0, name.indexOf(".")) + "-status";
        },

        add : function (model) {
            var indicator = this.$(this.className(model));
            indicator.addClass(RUNNING_CSS_CLASS);
            indicator.html("<span class='label label-important'>Running since " + model.get("fireDate") + "</span>");
        },

        remove : function (model) {
            var indicator = this.$(this.className(model));
            indicator.removeClass(RUNNING_CSS_CLASS);
            indicator.html("");
        }

    });

}());