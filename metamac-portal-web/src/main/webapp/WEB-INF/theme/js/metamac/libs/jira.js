(function () {

    var A = $;
    var F = "http://jira.arte-consultores.com", E = ".atlwdg-blanket {background:#000;height:100%;left:0;opacity:.5;position:fixed;top:0;width:100%;z-index:1000000;}\n.atlwdg-popup {background:#fff;border:1px solid #666;position:fixed;top:50%;left:50%;z-index:10000011;}\n.atlwdg-popup.atlwdg-box-shadow {-moz-box-shadow:10px 10px 20px rgba(0,0,0,0.5);-webkit-box-shadow:10px 10px 20px rgba(0,0,0,0.5);box-shadow:10px 10px 20px rgba(0,0,0,0.5);background-color:#fff;}\n.atlwdg-hidden {display:none;}\n.atlwdg-trigger {position: fixed; background: #013466; padding: 5px;border: 2px solid white;border-top: none; font-weight: bold; color: white; display:block;white-space:nowrap;text-decoration:none; font-family:arial, FreeSans, Helvetica, sans-serif;font-size:12px;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);-webkit-box-shadow:5px 5px 10px rgba(0, 0, 0, 0.5); -moz-box-shadow:5px 5px 10px rgba(0, 0, 0, 0.5);border-radius: 0 0 5px 5px; -moz-border-radius: 0 0 5px 5px;}\na.atlwdg-trigger {text-decoration:none;}\n.atlwdg-trigger.atlwdg-TOP {left: 45%;top:0; }\n.atlwdg-trigger.atlwdg-RIGHT {left:100%; top:40%; -webkit-transform-origin:top left; -webkit-transform: rotate(90deg); -moz-transform: rotate(90deg); -moz-transform-origin:top left;-ms-transform: rotate(90deg); -ms-transform-origin:top left; }\n.atlwdg-trigger.atlwdg-SUBTLE { right:0; bottom:0; border: 1px solid #ccc; border-bottom: none; border-right: none; background-color: #f5f5f5; color: #444; font-size: 11px; padding: 6px; box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.5); border-radius: 2px 0 0 0; }\n.atlwdg-loading {position:absolute;top:220px;left:295px;}", I = ".atlwdg-trigger {position:absolute;}\n.atlwdg-blanket {position:absolute;filter:alpha(opacity=50);width:110%;}\n.atlwdg-popup {position:absolute;}\n.atlwdg-trigger.atlwdg-RIGHT { left:auto;right:0; filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1); }";
    A.isQuirksMode = function () {
        return document.compatMode != "CSS1Compat"
    };
    A.IssueDialog = function (S) {
        var M = A("body"), N = this, P = function () {
            N.show();
            return false
        };
        this.options = S;
        this.frameUrl = F + "/rest/collectors/1.0/template/form/" + this.options.collectorId + "?os_authType=none";
        A("head").append("<style type='text/css'>" + E + "</style>");
        var L = "atlwdg-";
        if (typeof this.options.triggerPosition !== "function") {
            L += this.options.triggerPosition
        }
        var O = A("<a href='#' id='atlwdg-trigger'/>").addClass("atlwdg-trigger " + L).text(this.options.triggerText);
        var J = A("<div id='atlwdg-container'/>").addClass("atlwdg-popup atlwdg-box-shadow atlwdg-hidden");
        var R = A("<div id='atlwdg-blanket' class='atlwdg-blanket'/>").hide();
        if (typeof this.options.triggerPosition === "function") {
            this.options.triggerPosition(P)
        } else {
            M.append(O);
            O.click(P)
        }
        M.append(R).append(J);
 /*       if (A.browser.msie && (A.isQuirksMode() || A.browser.version < 9)) {
            A("head").append("<style type='text/css'>" + I + "</style>");
            var K = function (T) {
            };
            if (this.options.triggerPosition === "TOP") {
                K = function (T) {
                    A("#atlwdg-trigger").css("top", A(window).scrollTop() + "px")
                }
            } else {
                if (this.options.triggerPosition === "RIGHT") {
                    K = function (U) {
                        var T = A("#atlwdg-trigger");
                        T.css("top", (A(window).height() / 2 - T.outerWidth() / 2 + A(window).scrollTop()) + "px");
                        if (!A.isQuirksMode() && A.browser.version === "8.0") {
                            T.css("right", -(T.outerHeight() - T.outerWidth()) + "px")
                        }
                    }
                } else {
                    if (this.options.triggerPosition === "SUBTLE") {
                        var Q = O.outerHeight();
                        K = function (T) {
                            var U = A(window);
                            O.css("top", (U.scrollTop() + U.height() - Q) + "px")
                        }
                    }
                }
            }
            A(window).bind("scroll resize", K);
            K()
        }*/
    };
    A.IssueDialog.prototype = {hideDialog : undefined, updateContainerPosition : function () {
        var K = 810, J = 450;
        A("#atlwdg-container").css({height : J + "px", width : K + "px", "margin-top" : -Math.round(J / 2) + "px", "margin-left" : -Math.round(K / 2) + "px"});
        A("#atlwdg-frame").height(J + "px").width(K + "px")
    }, show : function () {
        var R = this, N = A("#atlwdg-container"), Q = A("body"), O = A('<iframe id="atlwdg-frame" frameborder="0" src=""></iframe>'), J = A('<img class="atlwdg-loading" style="display:none;" src="' + App.resourceContext + 'images/jira_loading.gif">');
        hideDialog = function (T) {
            if (T.keyCode === 27) {
                R.hide()
            }
        };
        N.append(J);
        var P = setTimeout(function () {
            J.show()
        }, 300);
        N.append(O);
        Q.css("overflow", "hidden").keydown(hideDialog);
        window.scroll(0, 0);
        var S = "";
        if (this.options.collectFeedback) {
            var L = this.options.collectFeedback();
            for (var K in L) {
                if (L.hasOwnProperty(K) && L[K] !== undefined && L[K] !== "" && typeof L[K] === "string") {
                    S += "*" + K + "*: " + L[K] + "\n"
                }
            }
        }
        var M = {};
        if (this.options.fieldValues && !A.isEmptyObject(this.options.fieldValues)) {
            A.extend(M, this.options.fieldValues)
        }
        O.load(function () {
            var T = {feedbackString : S, fieldValues : M};
            O[0].contentWindow.postMessage(T, "http://jira.arte-consultores.com");
            A(window).bind("message", function (U) {
                if (U.originalEvent.data && U.originalEvent.data === "cancelFeedbackDialog") {
                    R.hide()
                }
            })
        });
        O.load(function (T) {
            clearTimeout(P);
            J.hide();
            O.show()
        });
        O.attr("src", this.frameUrl);
        this.updateContainerPosition();
        N.show();
        A("#atlwdg-blanket").show()
    }, hide : function () {
        A("body").css("overflow", "auto").unbind("keydown", hideDialog);
        A("#atlwdg-container").hide().empty();
        A("#atlwdg-blanket").hide()
    }};
    var B = function (K) {
        for (var J in K) {
            if (typeof K[J] !== "string") {
                console.log("bootstrap.js:filterStrings ignoring key for value '" + J + "'; typeof must be string");
                delete K[J]
            }
        }
        return K
    };
    if ("66d64af0" !== "") {
        var C = false;
        var H = {};
        if (true) {
            var G = {Location : window.location.href, "User-Agent" : navigator.userAgent, Referrer : document.referrer, "Screen Resolution" : screen.width + " x " + screen.height};
            if (window.ATL_JQ_PAGE_PROPS) {
                var D = window.ATL_JQ_PAGE_PROPS.environment;
                H = window.ATL_JQ_PAGE_PROPS.fieldValues;
                if (window.ATL_JQ_PAGE_PROPS.hasOwnProperty("66d64af0")) {
                    D = window.ATL_JQ_PAGE_PROPS["66d64af0"];
                    H = D.fieldValues
                }
                if (A.isFunction(D)) {
                    A.extend(G, D())
                } else {
                    A.extend(G, D)
                }
                if (A.isFunction(H)) {
                    A.extend(H, B(H()))
                } else {
                    if (A.isPlainObject(H)) {
                        A.extend(H, B(H))
                    }
                }
            }
            C = function () {
                return G
            }
        }
        A(function () {
            window.ATL_IssueDialog = new A.IssueDialog({collectorId : "66d64af0", collectFeedback : C, fieldValues : H, triggerText : "Reporte un bug", triggerPosition : "SUBTLE"})
        })
    } else {
        window.ATL_JQ = A
    }
})();