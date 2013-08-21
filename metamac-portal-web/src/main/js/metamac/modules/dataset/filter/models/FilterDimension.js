(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterDimension');

    App.modules.dataset.filter.models.FilterDimension = Backbone.Model.extend({

        defaults : {
            zone : undefined,
            filterQuery : '',
            filterLevel : undefined,
            open : false
        },

        initialize : function () {
            this._bindEvents();
        },

        _bindEvents : function () {
            this.listenTo(this, 'change:filterQuery', this._onChangeFilterQuery);
            this.listenTo(this, 'change:filterLevel', this._onChangeFilterLevel);
        },

        _unbindEvents : function () {
            this.stopListening();
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
            this._unbindEvents(); //unbind to not trigger _onChangeFilterQuery
            this.set('filterLevel', this.defaults.filterLevel);
            this._bindEvents();

            var filterQuery = _.string.slugify(this.get('filterQuery'));
            var filterQueryLength = filterQuery.length;

            var representations = this.get('representations');
            representations.each(function (model) {
                model.set({open : false}, {trigger : false});
            });

            var setObject = {};
            var visibleModels = [];
            representations.each(function (model) {
                var matchIndex = _.string.slugify(model.get('label')).indexOf(filterQuery);
                var match = matchIndex !== -1;

                if (match) {
                    setObject[model.id] = {id : model.id, visible : true, matchIndexBegin : matchIndex, matchIndexEnd : matchIndex + filterQueryLength};
                    visibleModels.push(model);
                } else {
                    setObject[model.id] = {id : model.id, visible : false, matchIndexBegin : undefined, matchIndexEnd : undefined};
                }
            }, this);

            _.each(visibleModels, function (model) {
                var parentId = model.get('parent');
                while (parentId) {
                    var parent = representations.get(parentId);
                    setObject[parent.id].open = true;
                    setObject[parent.id].visible = true;
                    parentId = parent.get('parent');
                }
            }, this);

            representations.each(function (model) {
                model.set(setObject[model.id]);
            });
        },

        _onChangeFilterLevel : function () {
            this._unbindEvents(); //unbind to not trigger _onChangeFilterQuery
            this.set('filterQuery', this.defaults.filterQuery);
            this._bindEvents();

            var filterLevel = this.get('filterLevel');
            var representations = this.get('representations');
            if (_.isUndefined(filterLevel)) {
                representations.invoke('set', {visible : true, open : true})
            } else {
                representations.each(function (model) {
                    var level = model.get('level');
                    var visible = level === filterLevel;
                    if (visible) {
                        model.set({visible : true, open : false, matchIndexBegin : undefined, matchIndexEnd : undefined});
                    } else {
                        model.set({visible : false, matchIndexBegin : undefined, matchIndexEnd : undefined});
                    }
                });
            }
        },

        getMaxHierarchyLevel : function () {
            var maxLevelModel = this.get('representations').max(function (model) {
                return model.get('level');
            });
            return maxLevelModel.get('level');
        }

    });

    _.extend(App.modules.dataset.filter.models.FilterDimension.prototype, App.mixins.ToggleModel);

}());