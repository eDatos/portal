(function () {
    "use strict";

    App.namespace('App.mixins.ToggleModel');

    App.mixins.ToggleModel = {

        toggle : function (attribute) {
            var currentValue = this.get(attribute);
            this.set(attribute, !currentValue);
        }

    };

}());