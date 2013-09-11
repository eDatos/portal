(function () {
    'use strict';

    App.namespace('App.Map');

    App.Map.TooltipDelegate = function (options) {
        this.initialize(options);
    };

    App.Map.TooltipDelegate.prototype = {
        initialize : function (options) {
            this.text = null;
            this._dataset = options.dataset;
            this._filterOptions = options.filterOptions;
            this._dataJson = options.dataJson;

            _.bindAll(this, "mouseOut", "mouseOver");
        },

        mouseOut : function () {
            this.text = null;
        },

        mouseOver : function (d) {
            if (!d.properties.contour) {
                var normCode = d.properties.normCode;
                var label = this._getLabelFromNormCode(normCode);
                var value = this._getValueFromNormCode(normCode);
                this.text = label + " : " + value;
            } else {
                this.text = null;
            }
        },

        _getLabelFromNormCode : function (normCode) {
            return this._dataset.metadata.getCategoryByNormCode(this._filterOptions.getMapDimension().id, normCode).label;
        },

        _getValueFromNormCode : function (normCode) {
            var normCodeData = this._dataJson[normCode];
            if (normCodeData) {
                return App.dataset.data.NumberFormatter.strNumberToLocalizedString(normCodeData.value.toString());
            }
            return ".";
        },

        getTitleAtMousePosition : function (position) {
            return this.text;
        }
    };
}());
