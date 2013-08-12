(function () {
    "use strict";

    App.namespace('App.modules.selection.SelectionView');

    App.modules.selection.SelectionView = Backbone.Marionette.CompositeView.extend({

        template : "selection/selection",
        itemView : App.widget.filter.sidebar.FilterSidebarDimensionView,

        initialize : function () {
            this.collection.accordion = false;
            this.collection.invoke('set', {open : true});
        },

        appendHtml : function (collectionView, itemView) {
            collectionView.$(".selection-dimensions").append(itemView.el);
        },

        buildItemView : function (item, ItemViewType, itemViewOptions) {
            var options = _.extend({filterDimension : item, collapsable : false}, itemViewOptions);
            return new ItemViewType(options);
        }

    });

}());