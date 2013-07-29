(function () {
    "use strict";

    App.namespace("dataset.data.NumberFormatter");

    App.dataset.data.NumberFormatter = {};

    App.dataset.data.NumberFormatter.strToNumber = function (str) {
        var result = null;
        if (_.isString(str)) {
            var strToParse = str.replace(',', '.');
            var floatData = parseFloat(strToParse);
            if (!isNaN(floatData)) {
                result = floatData;
            }
        }
        return result;
    };

    App.dataset.data.NumberFormatter.strNumberToLocalizedString = function (value, options) {
        var options = _.defaults(options || {}, I18n.lookup("number.format"), {separator : ".", delimiter : ",", strip_insignificant_zeros : false});
        var number = parseFloat(value);
        var negative = number < 0;
        var string = value.replace('-', '');

        var parts = string.split(".")
            , decimals
            , buffer = []
            , formattedNumber
            ;

        number = parts[0];
        decimals = parts[1];

        while (number.length > 0) {
            buffer.unshift(number.substr(Math.max(0, number.length - 3), 3));
            number = number.substr(0, number.length - 3);
        }

        formattedNumber = buffer.join(options.delimiter);

        if (decimals) {
            if (options.decimals) {
                decimals = decimals.substring(0, options.decimals);
            }
            formattedNumber += options.separator + decimals;
        }

        if (negative) {
            formattedNumber = "-" + formattedNumber;
        }

        if (options.strip_insignificant_zeros) {
            var regex = {
                separator : new RegExp(options.separator.replace(/\./, "\\.") + "$"), zeros : /0+$/
            };

            formattedNumber = formattedNumber
                .replace(regex.zeros, "")
                .replace(regex.separator, "");
        }

        return formattedNumber;
    }

}());
