(function () {
    "use strict";

    STAT4YOU.namespace("dataset.data.NumberFormatter");

    STAT4YOU.dataset.data.NumberFormatter = {};

    STAT4YOU.dataset.data.NumberFormatter.strToNumber = function (str) {
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

    STAT4YOU.dataset.data.NumberFormatter.strNumberToLocalizedString = function (value) {
        var options = _.defaults({}, I18n.lookup("number.format"), {separator : ".", delimiter : ",", strip_insignificant_zeros : false});
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
