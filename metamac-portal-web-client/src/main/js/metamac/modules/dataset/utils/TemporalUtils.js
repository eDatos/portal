(function () {
    "use strict";

    App.namespace("App.TemporalUtils");

    App.TemporalUtils = {

        intervalDateParsers: {
            YEARLY: function(stringDate) {
                var momentDate = moment(stringDate, "YYYY").utc(); // parse format YYYY-A1 too
                return {
                    begin: momentDate.startOf('year').valueOf(),
                    end: momentDate.endOf('year').valueOf()
                }
            },
            BIYEARLY: function(stringDate) {
                var monthEnd = moment(stringDate, "YYYY-'S'M");
                monthEnd.month(((monthEnd.month() + 1) * 6) - 1);

                var monthBegin = monthEnd.clone();
                monthBegin.month(monthEnd.month() - 5);
                return {
                    begin: monthBegin.startOf('month').utc().valueOf(),
                    end: monthEnd.endOf('month').utc().valueOf()
                }
            },
            FOUR_MONTHLY: function(stringDate) {
                var monthEnd = moment(stringDate, "YYYY-'T'M");
                monthEnd.month(((monthEnd.month() + 1) * 4) - 1);

                var monthBegin = monthEnd.clone();
                monthBegin.month(monthEnd.month() - 3);
                return {
                    begin: monthBegin.startOf('month').utc().valueOf(),
                    end: monthEnd.endOf('month').utc().valueOf()
                }
            },
            QUARTERLY: function(stringDate) {
                var monthEnd = moment(stringDate, "YYYY-'Q'M");
                monthEnd.month(((monthEnd.month() + 1) * 3) - 1);

                var monthBegin = monthEnd.clone();
                monthBegin.month(monthEnd.month() - 2);
                return {
                    begin: monthBegin.startOf('month').utc().valueOf(),
                    end: monthEnd.endOf('month').utc().valueOf()
                }
            },
            MONTHLY: function(stringDate) { // 2018-M10, 2018-10
                var momentDate = moment(stringDate, (/^\d{4}-\d{2}$/).test(stringDate) ? 'YYYY-MM' : "YYYY-'M'MM").utc();
                return {
                    begin: momentDate.startOf('month').valueOf(),
                    end: momentDate.endOf('month').valueOf()
                }
            },
            WEEKLY: function(stringDate) { // 2018-W10
                var momentDate = moment(stringDate, "YYYY-'W'WW").utc();
                return {
                    begin: momentDate.startOf('week').valueOf(),
                    end: momentDate.endOf('week').valueOf()
                }
            },
            DAILY: function(stringDate) {
                var matchs = stringDate.match(/^\d{4}-D(\d{1,3})$/)
                var momentDate;
                if (matchs) {
                    momentDate = moment(stringDate, "YYYY");
                    momentDate.dayOfYear(matchs[1]);
                }
                else {
                    momentDate = moment(stringDate, "YYYY-MM-DD");
                }
                momentDate.utc();
                return {
                    begin: momentDate.startOf('day').valueOf(),
                    end: momentDate.endOf('day').valueOf()
                }
            },
            HOURLY: function(stringDate) {
                var momentDate = moment(stringDate);
                momentDate.utc();
                return {
                    begin: momentDate.startOf('hour').valueOf(),
                    end: momentDate.endOf('hour').valueOf()
                }
            }
        },

        temporalGranularityPriorities: {
            // EVENT: 8,
            YEARLY: 8, // 2000, 2000-A1
            BIYEARLY: 7, // 2000-S1
            FOUR_MONTHLY: 6, // 4 months // 2000-T3
            QUARTERLY: 5, // 3 months // 2000-Q4
            MONTHLY: 4, // 2000-M12, 2000-01
            WEEKLY: 3, // 2000-W52
            //DAILY_B: 2,
            //DAILY_D: 2,
            DAILY: 2, // 2000-D353, 2000-01-31
            HOURLY: 1 // 2013-07-24T13:21:52.519+01:00
        },

        contains: function(majorTemporal, minorTemporal) {
            if (!this.intervalDateParsers.hasOwnProperty(majorTemporal.temporalGranularity) ||
                !this.intervalDateParsers.hasOwnProperty(minorTemporal.temporalGranularity)) {
                    console.log('Some of the next granularities do not have a parser');
                    console.log(majorTemporal.temporalGranularity);
                    console.log(minorTemporal.temporalGranularity);
                    return false;
                }
            var majorInterval = this.intervalDateParsers[majorTemporal.temporalGranularity](majorTemporal.id);
            var minorInterval = this.intervalDateParsers[minorTemporal.temporalGranularity](minorTemporal.id);

            return majorInterval.begin <= minorInterval.begin && minorInterval.end <= majorInterval.end;
        },

        getTemporalGranularityPriority: function(temporalGranularity) {
            return this.temporalGranularityPriorities[temporalGranularity] || null;
        },
        
    };
}());