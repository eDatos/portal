(function () {
    "use strict";

    var UserUtils = App.modules.user.UserUtils;
    var PERMALINK_SUBPATH = "/permalink";

    App.namespace('App.modules.dataset.Permalink');

    App.modules.dataset.DatasetPermalink = {

        baseUrl: function () {
            return App.endpoints["permalinks"] + "/permalinks";
        },

        buildPermalinkContent: function (filterDimensions, dynamicSelection, lastVersion) {
            var queryParams = JSON.parse(JSON.stringify(App.queryParams));
            queryParams.version = lastVersion ? "~latest" : filterDimensions.metadata.getVersion();
            return JSON.stringify({
                queryParams: queryParams,
                hash: this.removePermalink(window.location.hash),
                selection: filterDimensions.exportJSONSelection(),
                dynamicSelection: dynamicSelection,
                state: filterDimensions.exportJSONState()
            });
        },

        removePermalink: function (hash) {
            return hash.indexOf(PERMALINK_SUBPATH) !== -1 ? hash.substring(0, hash.indexOf(PERMALINK_SUBPATH)) : hash;
        },

        retrievePermalink: function (permalinkId, callback) {
            var url = this.baseUrl() + "/" + permalinkId;
            $.getJSON(url).done(function (content) {
                if(App.endpoints["external-users"] !== "error" && App.endpoints["external-users-web"] !== "error") {
                    UserUtils.updateLastAccess().then(function () { });
                }
                callback(undefined, content);
            }).fail(function () {
                console.warn("Requested permalink not found.");
                callback(undefined, false);
            });
        },

        savePermalinkWithUserAuth: function (content) {
            return metamac.authentication.ajax({
                url: this.baseUrl(),
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ content: content }),
                beforeSend: function(xhr) {
                    var authToken = UserUtils.getAuthenticationTokenCookie();
                    if(authToken) {
                        xhr.setRequestHeader("Authorization", "Bearer " + authToken);
                    } else {
                        return false;
                    }
                }
            });
        },

        savePermalink: function (content, el) {
            return metamac.authentication.ajax({
                url: this.baseUrl(),
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ content: content }),
                beforeSend: function(xhr) {
                    var authToken = UserUtils.getAuthenticationTokenCookie();
                    if(authToken) {
                        xhr.setRequestHeader("Authorization", "Bearer " + authToken);
                    }
                }
            }, {
                captchaEl: el
            });
        },
    }

}());

