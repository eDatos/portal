(function () {
    "use strict";

    App.namespace('App.modules.multidataset.MultidatasetNode');

    App.modules.multidataset.MultidatasetNode = Backbone.Model.extend({

        defaults: {
            visible: true,
            matchIndexBegin: undefined,
            matchIndexEnd: undefined,
            selected: false
        },

        parse: function (response, options) {
            var attributes = {};
            var multidatasetIdentifier = options.multidatasetIdentifier;
            var resourceIdentifier = options.resourceIdentifier;

            attributes.name = App.i18n.localizeText(response.name);
            attributes.description = response.description ? App.i18n.localizeText(response.description) : attributes.name;

            if (response.query) {
                attributes.type = 'query';
                var urn = response.query.urn;
                var queryIdentifier = _.last(urn.split('='));
                var urlPartMatches = queryIdentifier.match(/(.*):(.*)/);
                attributes.agency = urlPartMatches[1];
                attributes.identifier = urlPartMatches[2];
                attributes.url = "?agencyId=" + attributes.agency + "&resourceId=" + attributes.identifier + "&resourceType=" + attributes.type;
            }

            if (response.dataset) {
                attributes.type = 'dataset';
                var urn = response.dataset.urn;
                var datasetIdentifier = _.last(urn.split('='));
                var urlPartMatches = datasetIdentifier.match(/(.*):(.*)\(([^\)]*?)\)/);
                attributes.agency = urlPartMatches[1];
                attributes.identifier = urlPartMatches[2];
                attributes.version = urlPartMatches[3];
                attributes.url = "?agencyId=" + attributes.agency + "&resourceId=" + attributes.identifier + "&version=" + attributes.version + "&resourceType=" + attributes.type;
            }

            attributes.url += "&multidatasetId=" + multidatasetIdentifier + window.location.hash;

            if (response.nodes) {
                this.nodes = App.modules.multidataset.MultidatasetNode.parseNodes(response.nodes);
            }

            attributes.selected = App.modules.multidataset.MultidatasetNode.areSameResource(resourceIdentifier, attributes);

            return attributes;
        }

    }, {
            parseNodes: function (nodes, multidatasetIdentifier, resourceIdentifier) {
                var models = _.map(nodes.node, function (node) {
                    return new App.modules.multidataset.MultidatasetNode(node, {
                        parse: true,
                        multidatasetIdentifier: multidatasetIdentifier,
                        resourceIdentifier: resourceIdentifier
                    });
                });
                return new Backbone.Collection(models);
            },

            areSameResource: function (resourceIdentifier, attributes) {
                return resourceIdentifier.agency === attributes.agency && resourceIdentifier.identifier === attributes.identifier && ((!resourceIdentifier.version && !attributes.version) || (resourceIdentifier.version == attributes.version));
            }

        });

}());