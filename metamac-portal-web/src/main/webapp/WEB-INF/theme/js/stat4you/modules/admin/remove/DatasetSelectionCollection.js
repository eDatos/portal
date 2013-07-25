(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.admin.remove");

    STAT4YOU.admin.remove.DatasetSelectionCollection = STAT4YOU.modules.datasets.Datasets.extend({

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
                url : STAT4YOU.context + "/app/admin/delete",
                data : {uris : uris}
            });
        }
    });

    _.extend(STAT4YOU.admin.remove.DatasetSelectionCollection.prototype, STAT4YOU.mixins.SelectableCollection);

}());