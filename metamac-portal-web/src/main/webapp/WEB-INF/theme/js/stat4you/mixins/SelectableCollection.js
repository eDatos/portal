(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.mixins");

    STAT4YOU.mixins.SelectableCollection = {

        areAllSelected : function () {
            return this.where({selected : true}).length === this.length;
        },

        selectAll : function () {
            this.each(function (model) {
                model.set('selected', true);
            });
        },

        unselectAll : function () {
            this.each(function (model) {
                model.set('selected', false);
            });
        },

        toggleAllSelection : function () {
            if (this.areAllSelected()) {
                this.unselectAll();
            } else {
                this.selectAll();
            }
        }

    };

}());