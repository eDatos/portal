(function () {
    "use strict";

    var extendTrackData = function (data) {

        var user = 'anonymous';
        if (App.user) {
            user = App.user.get('uri');
        }

        _.extend(data, {
            user: user,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            locale: I18n.currentLocale()
        });
    };

    App.track = function (data) {
        if (App.configuration["App.fluentd.enable"] == "true") {
            extendTrackData(data);
            var json = JSON.stringify(data);

            var url = "http://" +
                App.configuration["App.fluentd.external"] + "/" +
                App.configuration["App.fluentd.tag"];

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
