(function () {
    "use strict";

    App.namespace("App.admin.remove");

    App.admin.remove.DatasetSelectionCollection = App.modules.datasets.Datasets.extend({

        initialize : function () {
            this.on('add', this._selecteByDefault, this);
        },

        _selecteByDefault : function (model) {
            model.set('selected', true);
        },

        destroySelected : function () {
            var selectedDatasets = this.where({selected : true});
            var uris = _.map(selectedDatasets, function (dataset) {
                return dataset.get("uri");
            });
            $.ajax({
                type : "POST",
                url : App.context + "/app/admin/delete",
                data : {uris : uris}
            });
        }
    });

    _.extend(App.admin.remove.DatasetSelectionCollection.prototype, App.mixins.SelectableCollection);

}());