(function () {
    "use strict";

    App.namespace('App.modules.collection.Collection');

    App.modules.collection.Collection = Backbone.Model.extend({

        url : function () {
            return App.apiContext + '/collections/' + this.get('agency') + '/' + this.get('identifier') + '/' + this.get('version') + '?_type=json';
        },

        parse : function (response) {
            var attributes = {};
            attributes.name = App.i18n.localizeText(response.name);
            attributes.description = App.i18n.localizeText(response.description);
            this.nodes = App.modules.collection.CollectionNode.parseNodes(response.data.nodes);
            return attributes;
        }

    });

}());