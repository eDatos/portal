(function () {
    "use strict";

    App.namespace("App.libs.strings");

    App.libs.strings.containsLowerCase = function (a, b) {
        return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
    };

}());