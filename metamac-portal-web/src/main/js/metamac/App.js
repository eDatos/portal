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

    if (Backbone.Marionette) {
        Backbone.Marionette.Renderer.render = function (template, data) {
            return App.templateManager.get(template)(data);
        };
    }

    _.extend(App, Backbone.Events);

    window.App = App;

}(window));