(function () {
    'use strict';

    App.namespace('App.Map');

    App.Map.TooltipDelegate = function (options) {
        this.initialize(options);
    };

    App.Map.TooltipDelegate.prototype = {
        initialize : function (options) {
            this.text = null;
            this._data = options.data;
            this._filterDimensions = options.filterDimensions;
            this._dataJson = options.dataJson;

            _.bindAll(this, "mouseOut", "mouseOver");
        },

        mouseOut : function () {
            this.text = null;
        },

        mouseOver : function (d) {
            if (!d.properties.contour) {
                var normCode = d.id;
                var label = this._getLabelFromNormCode(normCode);
                var value = this._getValueFromNormCode(normCode);
                this.text = label + " : " + value;
            } else {
                this.text = null;
            }
        },

        _getLabelFromNormCode : function (normCode) {
            var geographicDimension = this._filterDimensions.dimensionsAtZone('left').at(0);
            var category = this._data.metadata.getCategoryByNormCode(geographicDimension.id, normCode);
            if (_.isUndefined(category)) { return normCode; }
            var representation = geographicDimension.get("representations").get(category.id);
            return representation.get("visibleLabel");
        },

        _getValueFromNormCode : function (normCode) {
            var normCodeData = this._dataJson[normCode];
            if (normCodeData) {
                return App.util.NumberFormatter.strNumberToLocalizedString(normCodeData.value.toString());
            }
            return ".";
        },

        getTitleAtMousePosition : function (position) {
            return this.text;
        }
    };
}());
