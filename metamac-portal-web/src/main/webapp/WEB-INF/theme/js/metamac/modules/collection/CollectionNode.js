(function () {
    "use strict";

    App.namespace('App.modules.collection.CollectionNode');

    App.modules.collection.CollectionNode = Backbone.Model.extend({

        parse : function (response) {
            var attributes = {};
            attributes.name = App.i18n.localizeText(response.name);
            attributes.description = App.i18n.localizeText(response.description);


            //TODO parámetro autoopen para identificar las selection
            if (response.query) {
                attributes.type = 'query';
                var url = response.query.selfLink.href;
                var urlParts = _.last(url.split('/'), 2);
                attributes.agency = urlParts[0];
                attributes.identifier = urlParts[1];
                attributes.url = App.context + "/queries/" + attributes.agency + "/" + attributes.identifier + "/selection";
            }

            if (response.dataset) {
                attributes.type = 'dataset';
                var url = response.dataset.selfLink.href;
                var urlParts = _.last(url.split('/'), 3);
                attributes.agency = urlParts[0];
                attributes.identifier = urlParts[1];
                attributes.version = urlParts[2];
                attributes.url = App.context + "/datasets/" + attributes.agency + "/" + attributes.identifier + "/" + attributes.version + "/selection";
            }

            if (response.nodes) {
                this.nodes = App.modules.collection.CollectionNode.parseNodes(response.nodes);
            }

            return attributes;
        }

    }, {

        parseNodes : function (nodes) {
            var models = _.map(nodes.node, function (node) {
                return new App.modules.collection.CollectionNode(node, {parse : true});
            });
            return new Backbone.Collection(models);
        }

    });

}());