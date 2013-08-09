(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterRepresentations');

    App.modules.dataset.filter.models.FilterRepresentations = Backbone.Collection.extend({

        model : App.modules.dataset.filter.models.FilterRepresentation,

        initialize : function () {
            this.selectedLimit = Infinity;
            this._bindEvents();
        },

        _bindEvents : function () {
            this.listenTo(this, 'change:selected', this._onChangeSelected);
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        initializeHierarchy : function () {
            var hasHierarchy = false;
            this.each(function (representation) {
                var children = this.where({parent : representation.id});
                if (children.length) {
                    hasHierarchy = true;
                    representation.children.set(children);
                }
            }, this);
            this.hasHierarchy = hasHierarchy;
        },

        _selectedModels : function () {
            return this.where({selected : true});
        },

        selectVisible : function () {
            var visibleModels = this.where({visible : true, selected : false});
            var selectedModels = this._selectedModels();
            var visibleModelsToSelect = this.selectedLimit - selectedModels.length;
            var modelsToSelect = visibleModels.slice(0, visibleModelsToSelect);
            _.invoke(modelsToSelect, 'set', {selected : true});
        },

        deselectVisible : function () {
            var visibleModels = this.where({visible : true, selected : true});
            var selectedModels = this._selectedModels();
            if (visibleModels.length === selectedModels.length) {
                visibleModels.shift(); //leave at least one model selected
            }
            _.invoke(visibleModels, 'set', {selected : false});
        },

        setSelectedLimit : function (selectedLimit) {
            this.selectedLimit = selectedLimit;
            var selectedModels = this._selectedModels();
            _.invoke(selectedModels.slice(selectedLimit), 'set', {selected : false});
        },

        toggleRepresentationsVisibleRange : function (start, end, state) {
            var visibleModels = this.where({visible : true});
            var modelsToChange = visibleModels.slice(start, end + 1);
            _.invoke(modelsToChange, 'set', {selected : state});
        },

        _onChangeSelected : function (model) {
            var selectedModels = this._selectedModels();
            if (!model.get('selected') && selectedModels.length === 0) {
                model.set('selected', true);
            }

            if (model.get('selected') && selectedModels.length > this.selectedLimit) {
                var otherModel = _.find(selectedModels, function (selectedModel) {
                    return selectedModel.id !== model.id;
                });
                otherModel.set('selected', false);
            }
        },

        parse : function (representations) {
            //group by parents
            var representationsByParent = _.groupBy(representations, function (representation) {
                return representation.parent;
            });

            //sort by levels
            for (var parent in representationsByParent) {
                representationsByParent[parent] = _.sortBy(representationsByParent[parent], 'order');
            }

            // recursive depth tree traversal for hierarchy order
            var rootRepresentations = representationsByParent["undefined"]; //TODO this is risky
            var sortedRepresentations = [];
            var depthTreeTraversal = function (level, node) {
                node.level = level;
                sortedRepresentations.push(node);
                _.each(representationsByParent[node.id], _.partial(depthTreeTraversal, level + 1));
            };
            _.each(rootRepresentations, _.partial(depthTreeTraversal, 0));
            return sortedRepresentations;
        }

    }, {
        initializeWithRepresentations : function (representations) {
            var filterRepresentations = new App.modules.dataset.filter.models.FilterRepresentations(representations, {parse : true});
            filterRepresentations.initializeHierarchy();
            return filterRepresentations;
        }
    });

}());