(function () {
    "use strict";

    App.namespace('App.modules.selection.SelectionView');

    App.modules.selection.SelectionView = Backbone.Marionette.CompositeView.extend({

        template : "selection/selection",
        itemView : App.widget.filter.sidebar.FilterSidebarDimensionView,
        itemViewContainer: ".selection-dimensions",

        events : {
            "click .selection-visualize-selection" : "onVisualizeSelection",
            "click .selection-visualize-all" : "onVisualizeAll"
        },

        initialize : function (options) {
            this.metadata = options.metadata;
            this.controller = options.controller;
        },

        serializeData : function () {
            var context = {
                selectAllUrl : App.context + this.metadata.urlIdentifierPart()
            };
            return context;
        },

        buildItemView : function (item, ItemViewType, itemViewOptions) {
            var options = _.extend({filterDimension : item, collapsable : false}, itemViewOptions);
            return new ItemViewType(options);
        },

        onBeforeRender : function () {
            this.delegateEvents();

            this.collection.invoke('set', {open : true});
            this.collection.accordion = false;

            var zones = this.collection.zones;

            // Remove restrictions
            zones.get("left").set({fixedSize : undefined, selectedLimit : Infinity});
            zones.get("top").set({fixedSize : undefined, selectedLimit : Infinity});

            var fixedDimensions = _.clone(zones.get("fixed").get("dimensions").models);
            _.each(fixedDimensions, function (dimension) {
                zones.setDimensionZone("left", dimension);
            }, this);
        },

        onBeforeClose : function () {
            var models = this.collection.models;
            _(models).first().set({open : true});
            _.chain(models).tail().invoke('set', {open : false});
            this.collection.accordion = true;
        },

        onVisualizeAll : function (e) {
            e.preventDefault();

            this.collection.each(function (filterDimension) {
                filterDimension.get('representations').selectAll();
            });
            this.gotoVisualization();
        },

        onVisualizeSelection : function (e) {
            e.preventDefault();
            // generate a permalink?
            this.gotoVisualization();
        },

        gotoVisualization : function () {
            var controllerParams = this.metadata.identifier();
            this.controller.showDatasetVisualization(controllerParams);
        }

    });

}());