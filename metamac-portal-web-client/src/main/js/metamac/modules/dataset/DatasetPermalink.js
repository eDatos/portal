(function () {
    "use strict";

    var PERMALINK_SUBPATH = "/permalink";

    App.namespace('App.modules.dataset.Permalink');

    App.modules.dataset.DatasetPermalink = {

        baseUrl: function () {
            return App.endpoints["permalinks"] + "/permalinks";
        },

        buildPermalinkContent: function (filterDimensions) {
            return JSON.stringify({
                queryParams: App.queryParams,
                hash: this.removePermalink(window.location.hash),
                selection: filterDimensions.exportJSONSelection(),
                state: filterDimensions.exportJSONState()
            });
        },

        removePermalink: function (hash) {
            return hash.indexOf(PERMALINK_SUBPATH) !== -1 ? hash.substring(0, hash.indexOf(PERMALINK_SUBPATH)) : hash;
        },

        retrievePermalink: function (permalinkId, callback) {
            var url = this.baseUrl() + "/" + permalinkId;
            $.getJSON(url).done(function (content) {
                callback(undefined, content);
            }).fail(function () {
                console.warn("Requested permalink not found.");
                callback(undefined, false);
            });
        },

        savePermalinkShowingCaptchaInElement: function (content, el) {
            return metamac.authentication.ajax({
                url: this.baseUrl(),
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ content: content }),
                xhrFields: {
                    // TODO(EDATOS-3232): In local, withCredentials seems necessary to send the JSESSION id back to the
                    //   server. However, it doesn't seems like it's needed in estadisticas demo. Maybe this is causing
                    //   trouble in prod? WHY IS NEEDED IN LOCAL BUT NOT IN DEMO?
                    withCredentials: true,
                }
            }, {
                captchaEl: el
            });
        }

    }

}());

