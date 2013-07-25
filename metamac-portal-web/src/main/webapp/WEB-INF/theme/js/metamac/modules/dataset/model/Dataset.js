(function () {
    "use strict";

    var Data = App.dataset.data.Data,
        BigData = App.dataset.data.BigData;

    App.namespace("App.dataset.Dataset");

    App.dataset.Dataset = function (options) {
        this.initialize(options);
    };

    App.dataset.Dataset.prototype = {

        /**
         * @param options.metadata
         * @param options.filterOptions
         */
        initialize : function (options) {
            this.metadata = options.metadata;
            this.filterOptions = options.filterOptions;

            if (this.isBigData()) {
                this.data = new BigData(options);
            } else {
                this.data = new Data(options);
            }

            this.initializeEvents();
        },

        initializeEvents : function () {
            var self = this;
            this.filterOptions.on('change reset', function () {
                self.data.updateFilterOptions();
            });
        },

        isBigData : function () {
            return this.metadata.getTotalObservations() > 1000;
        }


    };

}());