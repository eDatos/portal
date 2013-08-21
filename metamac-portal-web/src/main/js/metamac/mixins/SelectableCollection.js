(function () {
    "use strict";

    App.namespace("App.mixins");

    App.mixins.SelectableCollection = {

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