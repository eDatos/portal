(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterZone');

    App.modules.dataset.filter.models.FilterZone = Backbone.Model.extend({

        defaults : {
            dimensions : undefined,
            fixedSize : undefined,
            type : undefined,
            preferredType : undefined,
            selectedLimit : Infinity
        },

        initialize : function () {
            this.set('dimensions', new Backbone.Collection());
            this.on('change:selectedLimit', this._onChangeSelectedLimit, this);
        },

        remove : function (dimension) {
            var currentZone = dimension.get('zone');
            if (currentZone === this) {
                dimension.unset('zone');
                this.get('dimensions').remove(dimension);
            }
        },

        add : function (dimension, options) {
            this.get('dimensions').add(dimension, options);
            this._updateLimitForDimension(dimension);
            dimension.set('zone', this);
        },

        _onChangeSelectedLimit : function () {
            this.get('dimensions').each(this._updateLimitForDimension, this)
        },

        _updateLimitForDimension : function (dimension) {
            dimension.get('representations').setSelectedLimit(this.get('selectedLimit'));
        },

        leftoverDimensions : function () {
            var begin = _.isUndefined(this.get('fixedSize'))? 0 : this.get('fixedSize');
            return this.get('dimensions').slice(begin);
        },

        canAddDimension : function () {
            return _.isUndefined(this.get('fixedSize')) || this.get('dimensions').length < this.get('fixedSize');
        }

    });

}());
