(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterRepresentation');

    App.modules.dataset.filter.models.FilterRepresentation = Backbone.Model.extend({

        defaults : {
            visible : true,
            open : true,
            selected : true,
            childrenSelected : true,
            level : 0
        },

        initialize : function () {
            this.children = new Backbone.Collection();

            this.listenTo(this.children, 'change:selected', this._updateChildrenSelected);
            this.listenTo(this.children, 'change:childrenSelected', this._updateChildrenSelected);
            this.listenTo(this, 'change:open', this._onChangeOpen);
        },

        _updateChildrenSelected : function () {
            var childrenSelected = this.children.every(function (child) {
                return child.get('selected') && child.get('childrenSelected');
            });
            this.set('childrenSelected', childrenSelected);
        },

        _close : function () {
            this.children.each(function (child) {
                child.set('visible', false);
                child._close();
            });
        },

        _open : function () {
            if (this.get('open')) {
                this.children.each(function (child) {
                    child.set('visible', true);
                    child._open();
                });
            }
        },

        _onChangeOpen : function () {
            if (this.get('open')) {
               this._open();
            } else {
                this._close();
            }
        }

    });

    _.extend(App.modules.dataset.filter.models.FilterRepresentation.prototype, App.mixins.ToggleModel);

}());