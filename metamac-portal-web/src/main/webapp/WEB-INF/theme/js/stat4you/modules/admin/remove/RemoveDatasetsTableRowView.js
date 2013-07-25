(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.admin.remove");

    STAT4YOU.admin.remove.RemoveDatasetTableRowView = Backbone.Marionette.ItemView.extend({

        template : "admin/remove-page-table-row",

        tagName : 'tr',

        events : {
            "change input" : "toggleInput"
        },

        initialize : function () {
            this.listenTo(this.model, "change", this.render);
        },

        toggleInput : function () {
            this.model.set("selected", this.$("input").prop("checked"));
        }

    });

}());