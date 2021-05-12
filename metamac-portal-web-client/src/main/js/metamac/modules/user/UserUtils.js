(function () {
    "use strict";

    App.namespace("App.modules.user");

    App.modules.user.UserUtils = {

        _activatePostRequestsIsNecessary: function () {
            return this._getXsrfCookie() ? $.when({}) : metamac.authentication.ajax({
                url: App.endpoints["external-users"] + "/profile-info",
                method: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            });
        },

        getAccount: function () {
            return new Promise(function(resolve, reject) {
                metamac.authentication.ajax({
                    url: App.endpoints["external-users"] + "/account",
                    method: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function(xhr) {
                        if(!sessionStorage.getItem("authToken")) {
                            return false;
                        } else {
                            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("authToken"));
                        }
                    }
                }).done(function(val) {
                    resolve(val)
                }).fail(function() {
                    reject()
                });
            })
        },

        login: function (credentials) {
            var self = this;
            return new Promise(function(resolve, reject) {
                self._activatePostRequestsIsNecessary().done(function() {
                    var xsrfTokenCookie = self._getXsrfCookie();
                    metamac.authentication.ajax({
                        url: App.endpoints["external-users"] + "/login",
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(credentials),
                        beforeSend: function (xhr) {
                            if (xsrfTokenCookie) {
                                xhr.setRequestHeader("X-XSRF-TOKEN", xsrfTokenCookie);
                            } else {
                                return false;
                            }
                        }
                    }).done(function(val) {
                        resolve(val)
                    }).fail(function() {
                        reject()
                    });
                }).fail(function() {
                    reject()
                });
            });
        },

        saveFilter: function (filter) {
            var self = this;
            return new Promise(function(resolve, reject) {
                self._activatePostRequestsIsNecessary().done(function() {
                    var xsrfTokenCookie = self._getXsrfCookie();
                    metamac.authentication.ajax({
                        url: App.endpoints["external-users"] + '/filters',
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: filter.toString(),
                        beforeSend: function(xhr) {
                            var authToken = sessionStorage.getItem("authToken");
                            if(xsrfTokenCookie && authToken) {
                                xhr.setRequestHeader("X-XSRF-TOKEN", xsrfTokenCookie);
                                xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("authToken"));
                            } else {
                                return false;
                            }
                        }
                    }).done(function(val) {
                        resolve(val)
                    }).fail(function() {
                        reject()
                    });
                }).fail(function() {
                    reject()
                });
            });
        },

        _getXsrfCookie: function () {
            var xsrfTokenMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
            return xsrfTokenMatch ? xsrfTokenMatch[1] : null;
        }
    }
}());

