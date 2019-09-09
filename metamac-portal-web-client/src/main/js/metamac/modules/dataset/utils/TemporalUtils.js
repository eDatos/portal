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

        dateParsers: {
            YEARLY: function(stringDate) {
                return moment(stringDate, "YYYY");
            },
            MONTHLY: function(stringDate) { // 2018-M10
                return moment(stringDate, "YYYY-'M'MM");
            },
            WEEKLY: function(stringDate) { // 2018-W10
                return moment(stringDate, "YYYY-'W'WW");
            }
        },

        contains: function(temporalA, temporalB) {
            var interval = this.intervalDateParsers[temporalA.temporalGranularity](temporalA.id);
            var date = this.dateParsers[temporalB.temporalGranularity](temporalB.id);
            return interval.begin <= date && date <= interval.end;
        },

        getTemporalPriority: function(temporalGranularity) {
            var temporalPriorities = [
                'MINUTELY',
                'HOURLY',
                ['DAILY_D', 'DAILY_B'],
                'WEEKLY',
                'MONTHLY',
                'YEARLY' // ['YEARLY', 'EVENT']
            ];

            var priority = 0;
            while (priority < temporalPriorities.length) {
                if (Array.isArray(temporalPriorities[priority])) {
                    if (temporalPriorities[priority].indexOf(temporalGranularity) != -1) {
                        return priority;
                    }
                }
                else if (temporalPriorities[priority] === temporalGranularity) {
                    return priority;
                }
                priority++;
            }
            return null;
        },
        
    };
}());