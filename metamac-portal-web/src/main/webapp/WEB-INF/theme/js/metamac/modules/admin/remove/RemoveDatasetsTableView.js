(function () {
    "use strict";

    App.namespace("App.admin.remove");

    App.admin.remove.RemoveDatasetsTableView = Backbone.Marionette.CompositeView.extend({

        template : "admin/remove-page-table",

        itemView : App.admin.remove.RemoveDatasetTableRowView,

        itemViewContainer : "tbody",

        events : {
            "submit .datasetDeleteForm" : "deleteDatasets",
            "change .select-all" : "toggleSelectAll"
        },

        initialize : function () {
            this.listenTo(this.collection, "change", this.updateView);
        },

        deleteDatasets : function (e) {
            e.preventDefault();
            this.collection.destroySelected();
        },

        toggleSelectAll : function () {
            this.collection.toggleAllSelection();
        },

        updateView : function () {
            this.$(".select-all").prop("checked", this.collection.areAllSelected());
        }

    });

}());