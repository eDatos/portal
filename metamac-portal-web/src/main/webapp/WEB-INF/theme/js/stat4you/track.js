(function () {
    "use strict";

    var extendTrackData = function (data) {

        var user = 'anonymous';
        if (STAT4YOU.user) {
            user = STAT4YOU.user.get('uri');
        }

        _.extend(data, {
            user: user,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            locale: I18n.currentLocale()
        });
    };

    STAT4YOU.track = function (data) {
        if (STAT4YOU.configuration["stat4you.fluentd.enable"] == "true") {
            extendTrackData(data);
            var json = JSON.stringify(data);

            var url = "http://" +
                STAT4YOU.configuration["stat4you.fluentd.external"] + "/" +
                STAT4YOU.configuration["stat4you.fluentd.tag"];

            return $.ajax({
                url: url,
                dataType: 'jsonp',
                data: {
                    json: json
                },
                timeout: 300
            });
        } else {
            // return a promise for compatibility
            var deferred = new $.Deferred();
            deferred.resolve();
            return deferred.promise();
        }
    };

}());
