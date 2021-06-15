(function () {
    "use strict";

    App.namespace("App.modules.user");

    App.modules.user.UserUtils = {

        AUTH_TOKEN_NAME: "authenticationToken",
        XSRF_COOKIE_NAME: "XSRF-TOKEN",

        _activatePostRequestsIsNecessary: function () {
            return this._getXsrfCookie() ? $.when({}) : metamac.authentication.ajax({
                url: App.endpoints["external-users"] + "/api/profile-info",
                method: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            });
        },

        getAccount: function () {
            var self = this;
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: App.endpoints["external-users"] + "/api/account",
                    method: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    beforeSend: self.getBeforeSendWithAuthentication(),
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
            window.location.href = App.endpoints["external-users"] + "/forced-external-login?url=" + encodeURIComponent(window.location.href);
        },

        // This method will try to log in the user if there is already a token in the external users app. Either way, the browser will be redirected back immediately.
        loginOnlyIfAlreadyLoggedInExternalUsers: function () {
            var currentUrl = new URL(Backbone.history.location.href);
            // tokenInTheUrl: a token in the url means there is a user about to be logged in with that token, so a new login is not necessary
            var tokenInTheUrl = currentUrl.searchParams.get("token");
            if(tokenInTheUrl) {
                this.setAuthenticationTokenCookie(tokenInTheUrl);
                currentUrl.searchParams.delete("token");
                window.history.replaceState(history.state,"", currentUrl.href);
            } else {
                // automaticAuthenticationHasNotBeenTriedYet: the sessionStorage property "authentication-already-tried" is stored when this method has already
                // been called in this tab. It is avoiding an infinite loop.
                var automaticAuthenticationHasNotBeenTriedYet = _.isNull(sessionStorage.getItem("authentication-already-tried"));
                if(automaticAuthenticationHasNotBeenTriedYet) {
                    // getAccount(): this call confirms that a user is already logged in. If it is not, then it is the case where we try to log in.
                    this.getAccount().catch(function() {
                        sessionStorage.setItem("authentication-already-tried", "true");
                        window.location.href = App.endpoints["external-users"] + "/external-login?url=" + encodeURIComponent(window.location.href);
                    });
                }
            }
        },

        logout: function () {
            var self = this;
            return new Promise(function(resolve, reject) {
                self._activatePostRequestsIsNecessary().done(function() {
                    $.ajax({
                        url: App.endpoints["external-users"] + '/api/account/logout',
                        method: "POST",
                        beforeSend: self.getBeforeSendWithXsrfAndAuthentication(),
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
                        url: App.endpoints["external-users"] + '/api/filters',
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: filter.toString(),
                        beforeSend: self.getBeforeSendWithXsrfAndAuthentication(),
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

        updateLastAccess: function (permalinkId) {
            var self = this;
            return new Promise(function(resolve, reject) {
                self._activatePostRequestsIsNecessary().done(function() {
                    $.ajax({
                        url: App.endpoints["external-users"] + '/api/filters/last-access/' + permalinkId,
                        method: "PUT",
                        beforeSend: self.getBeforeSendWithXsrfAndAuthentication(),
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

        getBeforeSendWithXsrfAndAuthentication: function () {
            var self = this;
            return function(xhr) {
                var xsrfTokenCookie = self._getXsrfCookie();
                var authToken = self.getAuthenticationTokenCookie();
                if(xsrfTokenCookie && authToken) {
                    xhr.setRequestHeader("X-XSRF-TOKEN", xsrfTokenCookie);
                    xhr.setRequestHeader("Authorization", "Bearer " + authToken);
                } else {
                    return false;
                }
            }
        },

        getBeforeSendWithAuthentication: function (optional) {
            var self = this;
            return function(xhr) {
                var authToken = self.getAuthenticationTokenCookie();
                if(authToken) {
                    xhr.setRequestHeader("Authorization", "Bearer " + authToken);
                } else if(!optional) {
                    return false;
                }
            }
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

