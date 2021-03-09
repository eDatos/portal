<%@ page contentType="text/javascript"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="requestURL">${pageContext.request.requestURL}</c:set>
<c:set var="baseURL" value="${fn:replace(requestURL, pageContext.request.requestURI, pageContext.request.contextPath)}" />
(function () {
    "use strict";

    window.metamac || (window.metamac = {});
    metamac.authentication = {};
    
    
    
    function SimpleCaptcha() {

    }

    SimpleCaptcha.captchaPictureUrl = "${baseURL}/jsp/captcha-simple.jsp";
    
    SimpleCaptcha.create = function(captchaGeneratedId) {
    	var captchaContainer = "<table> <tr>"+
        "       <td class=\"formevenrow\" nowrap=\"nowrap\" >"+
        "               <img src=\"" + this.captchaPictureUrl + "\">"+
        "         </td>"+
        "</tr>" +
        "<tr>" +
        "               <td class=\"formevenrow\" align=\"right\" width=\"120\">" +
        "                       <label for=\"codigo\">Escriba el texto que aparece en la imagen superior</label>"+
        "               </td>" +
        "</tr>" +
        "<tr>" +
        "               <td class=\"formevenrow\" nowrap=\"nowrap\" align=\"center\">"+
        "                       <input type=\"text\" name=\"codigo\" tabindex=\"1002\" id=\"codigo\"  />"+
        "               </td>"+
        "</tr></table>";
    	
    	$('#' + captchaGeneratedId).html(captchaContainer);
    	this.captchaGeneratedId = captchaGeneratedId;
    }
    
    SimpleCaptcha.getResponse = function() {
    	return $('#' + this.captchaGeneratedId + ' #codigo').val();
    }
    
    SimpleCaptcha.get_response = function() {
    	return this.getResponse();
    }    

    var showCaptcha = function (options, done) {
        var $captchaContainer = $(options.captchaEl);
        $captchaContainer.append('<div class="captcha captcha-simple"></div>');
        var captchaGeneratedId = "captcha_generated_" + Math.random().toString(36).slice(2);
                
        $("<div id='" + captchaGeneratedId + "'>").appendTo($captchaContainer.find('.captcha'));
        
        SimpleCaptcha.create(captchaGeneratedId);
        
        var buttonText = options.buttonText || "Enviar";
        var $button = $("<button>").text(buttonText);
        $button.appendTo($captchaContainer.find('.captcha'));
        $button.click(function (e) {
            e.preventDefault();
            done();
        });
    };
    
    var sendRequestWithCaptcha = function (ajaxOptions, callback) {
        // Why override the base url? This function is first called when the user clicks on the button
        // that triggers the captcha modal. Is in this moment when all the callbacks are set (this function
        // being one of those). The function that gave us the ajaxOptions won't get called again
        // to provide us with fresh info if the user fails the captcha.
        //
        // That means if we update any attribute of ajaxOptions, it stays set for future calls to this
        // function, until the modal is closed and opened again. So, if the user gives the wrong answer and
        // tries again we will have a malformed url, because it will have duplicated the same query string
        // parameter. I.e.: domain.com/path?param1=foo?param1=bar?param1=baz.

        var authenticatedRequest = $.ajax({
            ...ajaxOptions,
            url: ajaxOptions.url + '?' + $.param({captcha_simple_response: SimpleCaptcha.get_response()})
        });

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
                                deferred.resolveWith(null, [result]);
                            }
                        });
                    });
                };

                startCaptchaProcess();
            } else {
                deferred.rejectWith(null, [xhr, status, error]);
            }
        });

        return deferred.promise();
    }


}());