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
                selection: filterDimensions.exportJSON()
            });
        },

        removePermalink: function (hash) {
            return hash.indexOf(PERMALINK_SUBPATH) !== -1 ? hash.substring(0, hash.indexOf(PERMALINK_SUBPATH)) : hash;
        },

        retrievePermalink: function (permalinkId) {
            var url = this.baseUrl() + "/" + permalinkId;
            return $.getJSON(url);
        },

        savePermalinkShowingCaptchaInElement: function (content, el) {
            return metamac.authentication.ajax({
                url: this.baseUrl(),
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ content: content })
            }, {
                    captchaEl: el
                });
        }

    }

}());

