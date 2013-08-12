(function () {
    "use strict";

    App.namespace('App.modules.selection.SelectionView');

    App.modules.selection.SelectionView = Backbone.Marionette.CompositeView.extend({

        template : "selection/selection",
        itemView : App.widget.filter.sidebar.FilterSidebarDimensionView,

        events : {
            "click .selection-permalink" : "_onClickPermalink"
        },

        initialize : function (options) {
            this.metadata = options.metadata;
            this.collection.accordion = false;
            this.collection.invoke('set', {open : true});
        },

        serializeData : function () {
            var context = {
                selectAllUrl : App.context + this.metadata.urlIdentifierPart()
            };
            return context;
        },

        appendHtml : function (collectionView, itemView) {
            collectionView.$(".selection-dimensions").append(itemView.el);
        },

        buildItemView : function (item, ItemViewType, itemViewOptions) {
            var options = _.extend({filterDimension : item, collapsable : false}, itemViewOptions);
            return new ItemViewType(options);
        },

        _onClickPermalink : function () {
            var selection = this.collection.exportJSON();
            console.log("Create permalink with", selection);
        }

    });

}());