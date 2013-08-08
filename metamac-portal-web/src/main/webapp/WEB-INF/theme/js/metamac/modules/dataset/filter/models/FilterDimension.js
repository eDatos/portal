(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterDimension');

    App.modules.dataset.filter.models.FilterDimension = Backbone.Model.extend({

        defaults : {
            zone : undefined,
            filterQuery : '',
            filterLevel : -1,
            open : false
        },

        initialize : function () {
            this.listenTo(this, 'change:filterQuery', this._onChangeFilterQuery);
        },

        removeFromZone : function () {
            var zone = this.get('zone');
            if (zone) {
                zone.remove(this);
            }
        },

        parse : function (attributes) {
            attributes.representations = App.modules.dataset.filter.models.FilterRepresentations.initializeWithRepresentations(attributes.representations);
            attributes.representations.on('all', this._onRepresentationEvent, this);
            return attributes;
        },

        _onRepresentationEvent : function (event, model, collection, options) {
            this.trigger.apply(this, arguments);
        },

        _onChangeFilterQuery : function () {
            this.get('representations').setVisibleQuery(this.get('filterQuery'));
        }

    });

    _.extend(App.modules.dataset.filter.models.FilterDimension.prototype, App.mixins.ToggleModel);

}());