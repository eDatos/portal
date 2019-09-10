(function () {
    "use strict";

    App.namespace("App.TemporalUtils");

    App.TemporalUtils = {

        intervalDateParsers: {
            YEARLY: function(stringDate) {
                var momentDate = moment(stringDate, "YYYY");
                return {
                    begin: momentDate.startOf('year').utc().valueOf(),
                    end: momentDate.endOf('year').utc().valueOf()
                }
            },
            MONTHLY: function(stringDate) { // 2018-M10
                var momentDate = moment(stringDate, "YYYY-'M'MM");
                return {
                    begin: momentDate.startOf('month').utc().valueOf(),
                    end: momentDate.endOf('month').utc().valueOf()
                }
            },
            WEEKLY: function(stringDate) { // 2018-W10
                var momentDate = moment(stringDate, "YYYY-'W'WW");
                return {
                    begin: momentDate.startOf('week').utc().valueOf(),
                    end: momentDate.endOf('week').utc().valueOf()
                }
            }
        },

        temporalGranularityPriorities: {
            MINUTELY: 0,
            HOURLY: 1,
            DAILY_D: 2,
            DAILY_B: 2,
            WEEKLY: 3,
            MONTHLY: 4,
            YEARLY: 8, // [YEARLY, EVENT]
        },

        contains: function(majorTemporal, minorTemporal) {
            var majorInterval = this.intervalDateParsers[majorTemporal.temporalGranularity](majorTemporal.id);
            var minorInterval = this.intervalDateParsers[minorTemporal.temporalGranularity](minorTemporal.id);

            return majorInterval.begin <= minorInterval.begin && minorInterval.end <= majorInterval.end;
        },

        getTemporalGranularityPriority: function(temporalGranularity) {
            return this.temporalGranularityPriorities[temporalGranularity] || null;
        },
        
    };
}());