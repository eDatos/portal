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
        if (!ajaxOptions.headers) {
            ajaxOptions.headers = {};
        }

        ajaxOptions.headers.captcha_simple_response = SimpleCaptcha.get_response();

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