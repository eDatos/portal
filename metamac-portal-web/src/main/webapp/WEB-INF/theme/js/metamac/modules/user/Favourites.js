(function () {
    "use strict";

    App.namespace("App.modules.user.Favourites");

    var Favourite = App.modules.user.Favourite;

    App.modules.user.Favourites = Backbone.Collection.extend({
        model : Favourite,

        initialize : function (models, options) {
            this.user = options.user;
        },

        url : function () {
            return App.context + "/api/v1.0/users/" + this.user.get('identifier') + "/favourites";
        },

        parse : function (response) {
            return response.items;
        },

        findDataset : function (dataset) {
            return this.findDatasetByUri(dataset.uri);
        },

        findDatasetByUri : function (datasetUri) {
            var found = this.find(function (fav) {
                return fav.get('dataset').uri === datasetUri;
            });
            return found;
        },

        isFav : function (dataset) {
            var found = this.findDataset(dataset);
            return found !== undefined;
        },

        toggle : function (datasetUri) {
            var found = this.findDatasetByUri(datasetUri);
            var request;
            var favourites = this;
            if (found) {
                favourites.remove(found);
                found.destroy();
            } else {
                var favourite = new Favourite({dataset : {uri : datasetUri}});
                favourites.add(favourite);
                favourite.save();
            }
        }

    });

}());