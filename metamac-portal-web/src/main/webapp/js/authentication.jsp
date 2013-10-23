<%@ page import="org.siemac.metamac.core.common.conf.ConfigurationService"%><%@ page import="org.siemac.metamac.core.common.util.ApplicationContextProvider"%><%@ page import="org.siemac.metamac.portal.core.constants.PortalConfigurationConstants"%><%@page contentType="text/javascript" %>
<%
ConfigurationService configurationService = ApplicationContextProvider.getApplicationContext().getBean(ConfigurationService.class);
String CAPTCHA_PUBLIC_KEY = configurationService.getProperty(PortalConfigurationConstants.CAPTCHA_PUBLIC_KEY);
%>
        (function () {
            "use strict";

            window.metamac || (window.metamac = {});
            metamac.authentication = {};

            metamac.authentication.RECAPTCHA_PUBLIC_KEY = "<%= CAPTCHA_PUBLIC_KEY %>";

            var showCaptcha = function (options, done) {
                var $captchaContainer = $(options.captchaEl);
                var captchaGeneratedId = "captcha_generated_" + Math.random().toString(36).slice(2);

                $("<div id='" + captchaGeneratedId + "'>").appendTo($captchaContainer);

                Recaptcha.create(metamac.authentication.RECAPTCHA_PUBLIC_KEY, captchaGeneratedId, {
                    theme : "red",
                    callback : Recaptcha.focus_response_field
                });

                var buttonText = options.buttonText || "Enviar";
                var $button = $("<button>").text(buttonText);
                $button.appendTo($captchaContainer);
                $button.click(function (e) {
                    e.preventDefault();
                    done();
                });
            };

            var loadCaptchaScript = function (done) {
                if (window.Recaptcha) {
                    done();
                } else {
                    $.getScript("//www.google.com/recaptcha/api/js/recaptcha_ajax.js").done(done);
                }
            };

            var sendRequestWithCaptcha = function (ajaxOptions, callback) {
                if (!ajaxOptions.headers) {
                    ajaxOptions.headers = {};
                }

                ajaxOptions.headers.recaptcha_challenge = Recaptcha.get_challenge();
                ajaxOptions.headers.recaptcha_response = Recaptcha.get_response();

                var authenticatedRequest = $.ajax(ajaxOptions);

                authenticatedRequest.done(function (response) {
                    callback(null, response);
                });

                authenticatedRequest.fail(function (xhr, status, error) {
                    callback("fail", {xhr : xhr, status : status, error : error});
                });
            };

            var xhrIsUnauthorized = function (xhr) {
                return xhr.status === 401;
            };


            /**
             *
             * @param ajaxOptions - ajax options passed to $.ajax
             * @param options -
             *          captchaEl : element where the captcha will be rendered
             *          buttonText : text for the send captcha button
             *
             * @returns ajax promise result of the correct request
             */
            metamac.authentication.ajax = function (ajaxOptions, options) {
                var deferred = $.Deferred();

                var unauthenticatedRequest = $.ajax(ajaxOptions);

                unauthenticatedRequest.done(function (response) {
                    deferred.resolveWith(null, [response]);
                });

                unauthenticatedRequest.fail(function (xhr, status, error) {
                    if (xhrIsUnauthorized(xhr)) {

                        loadCaptchaScript(function () {

                            var startCaptchaProcess = function () {
                                showCaptcha(options, function () {
                                    sendRequestWithCaptcha(ajaxOptions, function (err, result) {
                                        $(options.captchaEl).empty();

                                        if (err) {
                                            if (xhrIsUnauthorized(result.xhr)) {
                                                startCaptchaProcess();
                                            } else {
                                                deferred.rejectWith(err, result);
                                            }
                                        } else {
                                            deferred.resolveWith(null, result);
                                        }
                                    });
                                });
                            };

                            startCaptchaProcess();
                        });
                    } else {
                        deferred.rejectWith(null, [xhr, status, error]);
                    }
                });

                return deferred.promise();
            }


        }());