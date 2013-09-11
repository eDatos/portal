(function (window, undefined) {

    var App = {
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

    App.getSigninView = function () {
        if (!App.signinView) {
            App.signinView = new App.modules.signin.SigninView({el : "#loginModal" });
        }
        return App.signinView;
    };

    App.doActionIfRegistered = function (action, msg) {
        if (App.user) {
            action();
        } else {
            App.getSigninView().show();
        }
    };

    if (Backbone.Marionette) {
        Backbone.Marionette.Renderer.render = function (template, data) {
            return App.templateManager.get(template)(data);
        };
    }

    TraceKit.report.subscribe(function (errorReport) {
        errorReport.event = 'error';
        App.track(errorReport);
    });

    _.extend(App, Backbone.Events);

    window.App = App;
    window.App = App; //code to migrate to App global namescape, better reutilization

}(window));