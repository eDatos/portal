(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.user.Favourite");

    STAT4YOU.modules.user.Favourite = Backbone.Model.extend({

        idAttribute : 'identifier',

        initialize : function (attributes, options) {
            if(options){
                this.user = options.user;
            }
        },

        urlRoot : function () {
            var user = this._getUser();
            if(user){
                return STAT4YOU.context + "/api/v1.0/users/" + user.get('identifier') + "/favourites";
            }
        },

        _getUser : function () {
            return this.user || STAT4YOU.user;
        }

    });

}());