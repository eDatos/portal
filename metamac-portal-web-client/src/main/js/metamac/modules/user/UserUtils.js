(function () {
    "use strict";

    App.namespace("App.modules.user");

    App.modules.user.UserUtils = {

        AUTH_TOKEN_NAME: "authenticationToken",
        XSRF_COOKIE_NAME: "XSRF-TOKEN",

        _activatePostRequestsIsNecessary: function () {
            return this._getXsrfCookie() ? $.when({}) : metamac.authentication.ajax({
                url: App.endpoints["external-users"] + "/profile-info",
                method: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            });
        },

        getAccount: function () {
            var self = this;
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: App.endpoints["external-users"] + "/account",
                    method: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function(xhr) {
                        var authToken = self.getAuthenticationTokenCookie();
                        if(!authToken) {
                            return false;
                        } else {
                            xhr.setRequestHeader("Authorization", "Bearer " + authToken);
                        }
                    },
                    statusCode: {
                        401: function() {
                            self.deleteAuthenticationTokenCookie();
                            App.trigger("logout");
                        }
                    }
                }).fail(function(jqXHR) {
                    reject(jqXHR)
                }).done(function(val) {
                    resolve(val)
                });
            })
        },

        login: function () {
            window.open(App.endpoints["external-users-web"] + '/login?origin=' + encodeURIComponent(window.location.href), '_self').focus();
        },

        loginOnlyIfAlreadyLogged: function () {
            window.open(App.endpoints["external-users-web"] + '/login?origin=' + encodeURIComponent(window.location.href) + '&nonStop=true', '_self').focus();
        },

        logout: function () {
            var self = this;
            return new Promise(function(resolve, reject) {
                self._activatePostRequestsIsNecessary().done(function() {
                    $.ajax({
                        url: App.endpoints["external-users"] + '/account/logout',
                        method: "POST",
                        beforeSend: function(xhr) {
                            var xsrfTokenCookie = self._getXsrfCookie();
                            var authToken = self.getAuthenticationTokenCookie();
                            if(xsrfTokenCookie && authToken) {
                                xhr.setRequestHeader("X-XSRF-TOKEN", xsrfTokenCookie);
                                xhr.setRequestHeader("Authorization", "Bearer " + authToken);
                            } else {
                                // FIXME: manejar este error y devolver un false
                                return true;
                            }
                        }
                    }).done(function() {
                        resolve();
                    }).fail(function(jqXHR) {
                        reject(jqXHR)
                    }).always(function () {
                        App.trigger("logout");
                        self.deleteAuthenticationTokenCookie();
                    });
                }).fail(function(jqXHR) {
                    reject(jqXHR)
                });
            });
        },

        saveFilter: function (filter) {
            var self = this;
            return new Promise(function(resolve, reject) {
                self._activatePostRequestsIsNecessary().done(function() {
                    $.ajax({
                        url: App.endpoints["external-users"] + '/filters',
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: filter.toString(),
                        beforeSend: function(xhr) {
                            var xsrfTokenCookie = self._getXsrfCookie();
                            var authToken = self.getAuthenticationTokenCookie();
                            // FIXME: controlar cuando mandar y cuando no esta request
                            if(xsrfTokenCookie && authToken) {
                                xhr.setRequestHeader("X-XSRF-TOKEN", xsrfTokenCookie);
                                xhr.setRequestHeader("Authorization", "Bearer " + authToken);
                            } else {
                                // FIXME: manejar este error y devolver un false
                                return true;
                            }
                        },
                        statusCode: {
                            401: function() {
                                self.deleteAuthenticationTokenCookie();
                                App.trigger("logout");
                            }
                        }
                    }).done(function(val) {
                        resolve(val)
                    }).fail(function(jqXHR) {
                        reject(jqXHR)
                    });
                }).fail(function(jqXHR) {
                    reject(jqXHR)
                });
            });
        },

        getAuthenticationTokenCookie: function () {
            return Cookies.get(this.AUTH_TOKEN_NAME);
        },

        setAuthenticationTokenCookie: function (value) {
            return Cookies.set(this.AUTH_TOKEN_NAME, value);
        },

        deleteAuthenticationTokenCookie: function () {
            return Cookies.set(this.AUTH_TOKEN_NAME);
        },

        _getXsrfCookie: function () {
            return Cookies.get(this.XSRF_COOKIE_NAME);
        }
    }
}());

