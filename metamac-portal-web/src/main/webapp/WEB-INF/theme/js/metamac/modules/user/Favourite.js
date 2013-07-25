(function () {
    "use strict";

    App.namespace("App.modules.user.Favourite");

    App.modules.user.Favourite = Backbone.Model.extend({

        idAttribute : 'identifier',

        initialize : function (attributes, options) {
            if(options){
                this.user = options.user;
            }
        },

        urlRoot : function () {
            var user = this._getUser();
            if(user){
                return App.context + "/api/v1.0/users/" + user.get('identifier') + "/favourites";
            }
        },

        _getUser : function () {
            return this.user || App.user;
        }

    });

}());