(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.Table.Utils");

    // Comprueba si un elemento está en un array
    //     Si está, devuelve la posición
    //     Si no está, devuelve la posición del valor menor más cercano que está en el array
    STAT4YOU.Table.Utils.floorIndex = function (array, value) {
        var result;
        var index = _.lastIndexOf(array, value, true);
        if (index !== -1) {
            result = index;
        } else {
            result = _.sortedIndex(array, value) - 1;
        }
        return result;
    };

    STAT4YOU.Table.Utils.acumulate = function (len, callback) {
        var result = new Array(len);
        var i, ac = 0;
        for (i = 0; i <= len; i++) {
            result[i] = ac;
            ac = ac + callback(i);
        }
        return result;
    };

    //TODO change name
    STAT4YOU.Table.Utils.rightProductAcumulate = function (array) {
        var result = array.slice(1);
        result.push(1);

        for (var i = array.length - 2; i >= 0; i--) {
            result[i] = result[i] * result[i + 1];
        }
        return result;
    };

    STAT4YOU.Table.Utils.divideArray = function (array) {
        var len = array.length;
        var midCeil = Math.ceil(len / 2);
        var midFloor = Math.floor(len / 2);

        return [array.slice(0, midCeil), array.slice(len - midFloor, len)];
    };

    STAT4YOU.Table.Utils.permuteDimensionCodes = function (dimensions) {
        var result = [];
        var recursiveFunction = function (dimensions, ac) {
            if(dimensions && dimensions.length > 0) {
                var dimension = _.first(dimensions);
                var rest = _.rest(dimensions);
                _.each(dimension.representations, function (representation) {
                    ac[dimension.id] = representation.id;
                    recursiveFunction(rest, ac);
                });
            } else {
                result.push(_.clone(ac));
            }
        };
        recursiveFunction(dimensions, {});
        return result;
    };

}());
