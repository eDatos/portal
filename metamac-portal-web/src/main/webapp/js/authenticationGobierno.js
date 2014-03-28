(function () {
    "use strict";

    window.metamac || (window.metamac = {});
    metamac.authentication = {};
    
    
    
    function GovernCaptcha() {
    	
    }
    GovernCaptcha.captchaPictureUrl = 'captcha.jsp';
    
    GovernCaptcha.create = function(captchaGeneratedId) {
    	var captchaContainer = "<table> <tr>"+
        "       <td class=\"formevenrow\" nowrap=\"nowrap\" colspan=\"2\">"+
        "               <img src=\"" + this.captchaPictureUrl + "\">"+
        "         </td>"+
        "</tr>" +
        "<tr>" +
        "               <td class=\"formevenrow\" align=\"right\" width=\"120\">" +
        "                       <label for=\"codigo\">Resultado de la operaci&oacute;n</label>"+
        "               </td>" +
        "               <td class=\"formevenrow\" nowrap=\"nowrap\" align=\"center\">"+
        "                       <input type=\"text\" name=\"codigo\" tabindex=\"1002\" id=\"codigo\"  />"+
        "               </td>"+
        "</tr></table>";
    	
    	$('#' + captchaGeneratedId).html(captchaContainer);
    	this.captchaGeneratedId = captchaGeneratedId;
    }
    
    GovernCaptcha.getResponse = function() {
    	debugger;
    	return $('#' + this.captchaGeneratedId + ' #codigo').val();
    }
    
    GovernCaptcha.get_response = function() {
    	return this.getResponse();
    }    

    var showCaptcha = function (options, done) {
        var $captchaContainer = $(options.captchaEl);
        var captchaGeneratedId = "captcha_generated_" + Math.random().toString(36).slice(2);
                
        $("<div id='" + captchaGeneratedId + "'>").appendTo($captchaContainer);
        
        GovernCaptcha.create(captchaGeneratedId);
        
        var buttonText = options.buttonText || "Enviar";
        var $button = $("<button>").text(buttonText);
        $button.appendTo($captchaContainer);
        $button.click(function (e) {
            e.preventDefault();
            done();
        });
    };
    
    var sendRequestWithCaptcha = function (ajaxOptions, callback) {
        if (!ajaxOptions.headers) {
            ajaxOptions.headers = {};
        }

        ajaxOptions.headers.recaptcha_response = GovernCaptcha.get_response();
debugger;
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