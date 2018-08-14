(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterRepresentations');

    App.modules.dataset.filter.models.FilterRepresentations = Backbone.Collection.extend({

        model: App.modules.dataset.filter.models.FilterRepresentation,

        initialize: function () {
            this.drawableLimit = Infinity;

            this.selectedGeographicalLevel = null;
            this._bindEvents();
        },

        _bindEvents: function () {
            this.listenTo(this, 'change:selected', this._onChangeSelected);
            this.listenTo(this, 'change:drawable', this._onChangeDrawable);
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        initializeHierarchy: function () {
            var hasHierarchy = false;
            this.each(function (representation) {
                var children = this.where({ parent: representation.id });
                if (children.length) {
                    hasHierarchy = true;
                    representation.children.reset(children);
                    representation._onChangeOpen();
                }
            }, this);
            this.hasHierarchy = hasHierarchy;
        },

        _updateDrawables: function () {
            var modelsToUndraw = this.where({ drawable: true });
            var modelsToDraw = this._getModelsToDraw();

            _.invoke(modelsToUndraw, 'set', { drawable: false }, { silent: true });
            _.invoke(modelsToDraw, 'set', { drawable: true });
        },

        _getModelsToDraw: function () {
            var nModelsSelected = this.getSelectedRepresentations().length;
            var nModelsToDraw = this.drawableLimit - nModelsSelected;
            if (this.drawableLimit == nModelsSelected) {
                nModelsToDraw += 1; // Draw at least one model
            }
            return this.getSelectedRepresentations().slice(0, nModelsToDraw);
        },

        selectAll: function () {
            _.invoke(this.models, 'set', { selected: true });
        },

        selectVisible: function () {
            var visibleModels = this.where({ visible: true, selected: false });
            _.invoke(visibleModels, 'set', { selected: true });
        },

        deselectVisible: function () {
            var visibleModels = this.where({ visible: true, selected: true });
            _.invoke(visibleModels, 'set', { selected: false });
        },

        setDrawableLimit: function (drawableLimit) {
            this.drawableLimit = drawableLimit;
            this._updateDrawables();
        },

        toggleRepresentationsVisibleRange: function (start, end, state) {
            var visibleModels = this.where({ visible: true });
            var modelsToChange = visibleModels.slice(start, end + 1);
            _.invoke(modelsToChange, 'set', { selected: state });
        },

        _onChangeSelected: function (model) {
            this._updateDrawables();
            this.updateSelectedGeographicLevel();
        },

        _onChangeDrawable: function (model) {
            if (!model) { return; }

            var drawableModels = this.getDrawableRepresentations();
            if (!model.get('drawable') && drawableModels.length === 0) {
                model.set('drawable', true);
            }

            if (model.get('drawable') && drawableModels.length > this.drawableLimit) {
                var otherModel = _.find(drawableModels, function (drawableModel) {
                    return drawableModel.id !== model.id;
                });
                otherModel.set('drawable', false);
            }
        },

        parse: function (representations) {
            //group by parents
            var representationsByParent = _.groupBy(representations, function (representation) {
                return representation.parent;
            });

            //sort by levels
            for (var parent in representationsByParent) {
                representationsByParent[parent] = _.sortBy(representationsByParent[parent], 'order');
            }

            // recursive depth tree traversal for hierarchy order
            var rootRepresentations = representationsByParent["undefined"];
            var sortedRepresentations = [];
            var depthTreeTraversal = function (level, node) {
                node.level = level;
                sortedRepresentations.push(node);
                _.each(representationsByParent[node.id], _.partial(depthTreeTraversal, level + 1));
            };
            _.each(rootRepresentations, _.partial(depthTreeTraversal, 0));

            return sortedRepresentations;
        },

        reverse: function () {
            this.reset(this.last(this.length).reverse());
            this.trigger("reverse");
        },

        getSelectedRepresentations: function () {
            return this.where({ selected: true });
        },

        getDrawableRepresentations: function () {
            return this.where({ drawable: true });
        },

        updateDrawablesBySelectedLevel: function (selectedLevel) {
            _.invoke(this.models, 'set', { drawable: false }, { silent: true });
            _.invoke(this.where({ level: parseInt(selectedLevel), selected: true }), 'set', { drawable: true });
            this.selectedGeographicalLevel = selectedLevel;

            this.trigger("change:drawable");
        },

        updateDrawablesBySelectedGranularity: function (selectedGranularity) {
            _.invoke(this.models, 'set', { drawable: false }, { silent: true });
            _.invoke(this.where({ temporalGranularity: selectedGranularity, selected: true }), 'set', { drawable: true });

            this.trigger("change:drawable");
        },

        getSelectedGeographicLevel: function () {
            if (this.selectedGeographicalLevel == null) {
                this.updateSelectedGeographicLevel();
            }
            return this.selectedGeographicalLevel;
        },

        updateSelectedGeographicLevel: function () {
            this.selectedGeographicalLevel = this._getMostRepeatedValue(this.getSelectedGeographicLevels());
        },

        getSelectedGeographicLevels: function () {
            return _(this.getSelectedRepresentations()).invoke("get", "level");
        },

        getMostPopulatedTemporalGranularity: function () {
            return this._getMostRepeatedValue(this.getSelectedTemporalGranularities());
        },

        getSelectedTemporalGranularities: function () {
            return _(this.getSelectedRepresentations()).invoke("get", "temporalGranularity");
        },

        _getMostRepeatedValue: function (collection) {
            var countedBy = _(collection).countBy();
            var maxPopulation = _(countedBy).max();
            return _.invert(countedBy)[maxPopulation];
        },



    }, {
            initializeWithRepresentations: function (representations) {
                var filterRepresentations = new App.modules.dataset.filter.models.FilterRepresentations(representations, { parse: true });
                filterRepresentations.initializeHierarchy();

                return filterRepresentations;
            }
        });

}());