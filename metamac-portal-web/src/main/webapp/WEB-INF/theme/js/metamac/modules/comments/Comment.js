(function () {
    "use strict";

    App.namespace("App.modules.comments.Comment");

    App.modules.comments.Comment = Backbone.Model.extend({

        urlRoot : App.apiContext + '/comments',

        idAttribute : 'identifier'

    });

}());