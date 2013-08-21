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
            this._enumerateNodes(this.nodes, '');
            return attributes;
        },

        _enumerateNodes : function (nodes, prefix) {
            if (nodes) {
                nodes.each(function (node, i) {
                    var numeration = prefix + _.string.pad(i + 1, 2, '0');
                    node.set('numeration', numeration);
                    this._enumerateNodes(node.nodes, numeration + ".");
                }, this);
            }
        }

    });

}());