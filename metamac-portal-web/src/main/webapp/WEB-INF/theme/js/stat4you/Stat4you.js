(function (window, undefined) {

    var STAT4YOU = {
        context : "",
        apiContext : "",
        resourceContext : "",

        namespace : function (namespaceString) {

            if (!namespaceString) {
                return null;
            }

            var parts = namespaceString.split('.'),
                parent = window,
                currentPart = '',
                i,
                length = parts.length;

            for (i = 0; i < length; i++) {
                currentPart = parts[i];
                parent[currentPart] = parent[currentPart] || {};
                parent = parent[currentPart];
            }

            return parent;
        }
    };

    STAT4YOU.getSigninView = function () {
        if (!STAT4YOU.signinView) {
            STAT4YOU.signinView = new STAT4YOU.modules.signin.SigninView({el : "#loginModal" });
        }
        return STAT4YOU.signinView;
    };

    STAT4YOU.doActionIfRegistered = function (action, msg) {
        if (STAT4YOU.user) {
            action();
        } else {
            STAT4YOU.getSigninView().show();
        }
    };

    if (Backbone.Marionette) {
        Backbone.Marionette.Renderer.render = function (template, data) {
            return STAT4YOU.templateManager.get(template)(data);
        };
    }

    TraceKit.report.subscribe(function (errorReport) {
        errorReport.event = 'error';
        STAT4YOU.track(errorReport);
    });

    _.extend(STAT4YOU, Backbone.Events);

    window.STAT4YOU = STAT4YOU;
    window.App = STAT4YOU; //code to migrate to App global namescape, better reutilization

}(window));