(function () {
    "use strict";

    App.namespace('App.modules.collection.CollectionView');

    App.modules.collection.CollectionNodeView = Backbone.Marionette.CompositeView.extend({

        template : 'collection/collectionNode',
        tagName : 'li',

        initialize : function () {
            this.collection = this.model.nodes;
        },

        appendHtml : function (collectionView, itemView) {
            collectionView.$("ul:first").append(itemView.el);
        }

    });

    App.modules.collection.CollectionView = Backbone.Marionette.CompositeView.extend({

        template : 'collection/collection',
        itemView : App.modules.collection.CollectionNodeView,

        initialize : function () {
            this.collection = this.model.nodes;
            console.log(this.collection);
        },

        appendHtml : function (collectionView, itemView) {
            collectionView.$(".collection-nodes").append(itemView.el);
        }

    });

}());