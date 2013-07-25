(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.admin.remove");

    STAT4YOU.admin.remove.RemoveView = Backbone.View.extend({

        template : STAT4YOU.templateManager.get('admin/remove-page'),

        datasets : new STAT4YOU.admin.remove.DatasetSelectionCollection(),

        events : {
            "submit .datasetSearchForm" : "updateDatasetQuery"
        },

        initialize : function () {
            this.modelBinder = new Backbone.ModelBinder();
        },

        render : function () {
            var context = {
                datasets : this.datasets.toJSON()
            };
            this.$el.html(this.template(context));

            this.modelBinder.unbind();
            this.modelBinder.bind(this.options.deleteFormModel, this.$(".datasetSearchForm"));

            var tableView = new STAT4YOU.admin.remove.RemoveDatasetsTableView({collection : this.datasets});
            tableView.render();
            this.$('.datasets-list').append(tableView.el);
        },

        updateDatasetQuery : function (e) {
            e.preventDefault();
            var criteria = this.options.deleteFormModel.get("criteria");
            var limit = this.options.deleteFormModel.get("limit");
            this.datasets.reset([]);
            this.datasets.fetch({
                data : {
                    criteria : criteria,
                    limit : limit
                }
            });
        }

    });

}());
