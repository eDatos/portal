(function () {
    "use strict";

    App.namespace('App.modules.multidataset.Multidataset');

    App.modules.multidataset.Multidataset = Backbone.Model.extend({

        defaults: {
            open: true
        },

        initialize: function (attributes) {
            this.multidatasetIdentifier = attributes.multidatasetIdentifier;
            this.filterDimensions = attributes.filterDimensions;
            var identifiers = this.multidatasetIdentifier.split(":");
            if (identifiers.length != 2) {
                throw new Error("Error parsing multidataset identifier: ", this.multidatasetIdentifier);
            }

            this.agency = identifiers[0];
            this.identifier = identifiers[1];
        },

        url: function () {
            return App.endpoints["statistical-resources"] + '/multidatasets/' + this.agency + '/' + this.identifier + '?_type=json';
        },

        parse: function (response) {
            var attributes = {};
            attributes.name = App.i18n.localizeText(response.name);
            attributes.description = App.i18n.localizeText(response.description);
            this.nodes = App.modules.multidataset.MultidatasetNode.parseNodes(response.data.nodes, this.multidatasetIdentifier, this.filterDimensions.metadata.identifier());
            return attributes;
        },

        equals: function (multidataset) {
            if (_.isUndefined(multidataset)) return false;

            var self = this;
            var idProperties = ["agency", "identifier"];
            var equals = _.reduce(idProperties, function (equals, property) {
                return equals && self.get(property) === multidataset.get(property);
            }, true);
            return equals;
        }

    });

    _.extend(App.modules.multidataset.Multidataset.prototype, App.mixins.ToggleModel);

}());