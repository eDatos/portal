(function () {
    "use strict";


    /**
     * This implementation is very simple and far from complete
     * There is some more complete implementation out there:
     *   * https://github.com/stefanpenner/ember-inflector
     *   * https://github.com/jeremyruppel/underscore.inflection
     *
     * @class App.Inflector
     */
    App.Inflector = {

        /**
         * @param {string} word
         * @returns {string} Pluralized word
         */
        pluralize : function (word) {
            if (word === "query") {
                return "queries";
            }
            return word + "s";
        }

    }

}());