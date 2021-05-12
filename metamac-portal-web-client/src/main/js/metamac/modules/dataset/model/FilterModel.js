(function () {
    "use strict";

    App.namespace('App.modules.dataset.model');

    App.modules.dataset.model.FilterModel = Backbone.Model.extend({

        initialize: function ({resourceName, name, notes, permalink, userId}) {
            this.resourceName = resourceName;
            this.name = name;
            this.notes = notes;
            this.permalink = permalink;
            this.userId = userId;
        },

        toString: function () {
            return JSON.stringify({
                id: null,
                name: this.name,
                resourceName: this.resourceName,
                externalUser: { id: this.userId },
                permalink: this.permalink,
                notes: this.notes
            })
        }
    });

}());