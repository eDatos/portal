(function () {
    "use strict";

    App.namespace('App.modules.collection.CollectionController');

    App.modules.collection.CollectionController = App.Controller.extend({

        initialize : function (options) {
            this.region = options.region;
            this.collection = undefined;
        },

        showCollection : function (collectionIdentifier) {
            var self = this;

            this.loadCollection(collectionIdentifier)
                .then(function () {
                    var collectionView = new App.modules.collection.CollectionView({model : self.collection});
                    self.region.show(collectionView);
                });
        },

        loadCollection : function (collectionIdentifier) {
            var collection = new App.modules.collection.Collection(collectionIdentifier);
            if (collection.equals(this.collection)) {
                var deferred = $.Deferred();
                deferred.resolve();
                return deferred.promise();
            } else {
                this.collection = collection;
                return this.collection.fetch();
            }
        }

    });

}());