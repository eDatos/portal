(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.comments.Comment");

    STAT4YOU.modules.comments.Comment = Backbone.Model.extend({

        urlRoot : STAT4YOU.apiContext + '/comments',

        idAttribute : 'identifier'

    });

}());