(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    var DRAGOVER_CLASS = "drag-over";

    App.widget.filter.sidebar.OrderSidebarView = Backbone.View.extend({

        id : "orderSidebar",
        icon : "icon-reorder",
        title : "Ordenar",

        template : App.templateManager.get("widget/filter/sidebar/filter-order-view"),

        initialize : function (options) {
            this.filterOptions = options.filterOptions;
            this.optionsModel = options.optionsModel;
        },

        events : {
            "dragstart .order-sidebar-dimension.draggable" : "_onDragstart",
            "dragenter .order-sidebar-dimension.draggable" : "_onDragenter",
            "dragover .order-sidebar-dimension.draggable" : "_onDragover",
            "dragleave .order-sidebar-dimension.draggable" : "_onDragleave",
            "drop .order-sidebar-dimension.draggable" : "_onDrop",
            "dragend .order-sidebar-dimension.draggable" : "_onDragend",

            "dragenter .order-sidebar-zone.draggable" : "_onDragenter",
            "dragover .order-sidebar-zone.draggable" : "_onDragover",
            "dragleave .order-sidebar-zone.draggable" : "_onDragleave",
            "drop .order-sidebar-zone.draggable" : "_onDrop"
        },

        destroy : function () {
            this._unbindEvents();
        },

        _bindEvents : function () {
            this.listenTo(this.filterOptions, "change", this.render);
            this.listenTo(this.filterOptions, "reset", this.render);
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        _getCurrentChartType : function () {
            return this.optionsModel.get("type");
        },

        _getLabelFromZone : function (zone) {
            var currentChartType = this._getCurrentChartType();
            return I18n.t("filter.sidebar.order." + currentChartType + "." + zone);
        },

        _renderContextForMap : function () {
            var zonesIds = ["left", "fixed"];

            var zones = _.map(zonesIds, function (zone) {
                return {
                    id : zone,
                    label : this._getLabelFromZone(zone),
                    draggable : zone === "left",
                    dimensions : this._dimensionsForZone(zone),
                    isFixed : zone === "fixed"
                };
            }, this);

            return {zones : zones};
        },

        _renderContext : function () {
            var zonesIds = ["top", "left", "fixed"];

            var zones = _.map(zonesIds, function (zone) {
                return {
                    id : zone,
                    label : this._getLabelFromZone(zone),
                    draggable : true,
                    dimensions : this._dimensionsForZone(zone),
                    isFixed : zone === "fixed"
                };
            }, this);

            return {zones : zones};
        },

        render : function () {
            this._unbindEvents();
            this._bindEvents();
            var context = "map" === this._getCurrentChartType() ? this._renderContextForMap() : this._renderContext();
            this.$el.html(this.template(context));
        },

        _dimensionsForZone : function (zoneId) {
            var dimensions = this.filterOptions.getDimensionsInZone(zoneId);
            var isMap = this._getCurrentChartType() === "map";
            _.each(dimensions, function (dimension) {
                dimension.draggable = isMap ? dimension.type === "GEOGRAPHIC_DIMENSION" : true;

                if (zoneId === "fixed") {
                    dimension.selectedCategory = this.filterOptions.getSelectedCategories(dimension.id)[0];
                }
            }, this);

            return dimensions;
        },

        _onDragstart : function (e) {
            var $elem = $(e.currentTarget);
            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('Text', $elem.data("dimension-id"));
        },

        _onDragover : function (e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);
            $currentTarget.addClass(DRAGOVER_CLASS);
            return false;
        },

        _onDragenter : function (e) {
            var $currentTarget = $(e.currentTarget);
            $currentTarget.addClass(DRAGOVER_CLASS);
        },

        _onDragleave : function (e) {
            var $currentTarget = $(e.currentTarget);
            $currentTarget.removeClass(DRAGOVER_CLASS);
        },

        _onDrop : function (e) {
            var currentTarget = $(e.currentTarget);
            var transferDimensionId = e.originalEvent.dataTransfer.getData("Text");

            if (currentTarget.data("dimension-id")) {
                // swap two dimensions
                var toDimensionId = currentTarget.data("dimension-id");
                this.filterOptions.swapDimensions(transferDimensionId, toDimensionId);
            } else {
                //move to a zone
                var zone = currentTarget.data("zone");
                this.filterOptions.changeDimensionZone(transferDimensionId, zone);
            }
            return false;
        },

        _onDragend : function () {
            this.$("." + DRAGOVER_CLASS).removeClass(DRAGOVER_CLASS);
        }

    });


}());