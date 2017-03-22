(function () {
    "use strict";

    App.namespace("App.modules.dataset");

    var DRAGOVER_CLASS = "drag-over";

    // TODO: Can we have a common View for for this and OrderSidebarView?
    App.modules.dataset.DimensionsView = Backbone.View.extend({

        template : App.templateManager.get('dataset/dataset-dimensions'),

        initialize : function (options) {
            this.filterDimensions = options.filterDimensions;
            this.optionsModel = options.optionsModel;
        },
        
        configuration : {
            info : {
                zones : {},
            },
            canvasTable : {
                zones : {
                    left : {
                        icon : "rows",
                        draggable : true,
                        location : "right",
                        showHeader : true
                    },
                    top : {
                        icon : "columns",
                        draggable : true,
                        location : "right",
                        showHeader : true
                    },
                }                
            },
            column : {
                zones : {
                    axisy : {
                        icon : "axis-y",
                        draggable : false,
                        location : "left",
                        showHeader : true
                    },
                    left : {
                        icon : "axis-x",
                        draggable : true,
                        location : "right",
                        showHeader : true
                    },
                    fixed : {
                        icon : "lock",
                        draggable : true,
                        location : "right",
                        showHeader : true
                    }                    
                }                
            },
            line : {
                zones : {
                    axisy : {
                        icon : "axis-y",
                        draggable : false,
                        location : "left",
                        showHeader : true
                    }, 
                    left : {
                        icon : "axis-x",
                        draggable : false,
                        location : "left",
                        showHeader : true
                    },                                     
                    top : {
                        icon : "line",
                        draggable : true,
                        location : "right",
                        showHeader : true
                    },
                    fixed : {
                        icon : "lock",
                        draggable : true,
                        location : "right",
                        showHeader : true
                    }
                }                
            },
            map : {
                zones : {
                    left : {
                        icon : "map",
                        draggable : false,
                        location : "left",
                        showHeader : true
                    },
                    fixed : {
                        icon : "lock",
                        draggable : false,
                        location : "right",
                        showHeader : true
                    },
                }                
            },
            mapbubble : {
                zones : {
                    left : {
                        icon : "map",
                        draggable : false,
                        location : "left",
                        showHeader : true
                    },
                    fixed : {
                        icon : "lock",
                        draggable : false,
                        location : "right",
                        showHeader : true
                    }
                }                
            }
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
            "drop .order-sidebar-zone.draggable" : "_onDrop",

            "click a.order-sidebar-dimension" : "_dontFollowLinks",
            "change .fixed-dimension-select-category" : "_onChange",

            "focusin .order-sidebar-dimension" : "_onFocusin",
            "focusout .order-sidebar-dimension" : "_onFocusout"
        },

        _dontFollowLinks : function(e) {
            e.preventDefault();
        },

        _onChange : function(e) {
            var currentTarget = $(e.currentTarget);
            var selectedCategoryId = currentTarget.val();
            var dimensionId = currentTarget.data("dimension-id");
            if (dimensionId) {
                var representations = this.filterDimensions.get(dimensionId).get('representations');
                var selectedCategory = representations.findWhere({ id  : selectedCategoryId});
                if (!_.isUndefined(representations.get(selectedCategory))) {
                    representations.get(selectedCategory).set({drawable : true});
                }
            }
        },

        _onFocusin : function(e) {
            $(e.currentTarget).addClass('active');
        },

        _onFocusout : function(e) {
            $(e.currentTarget).removeClass('active');
        },

        destroy : function () {
            this._unbindEvents();
        },

        _updateSelectedCategory : function(filterDimensionId, e) {
            if (!_.isUndefined(e)) {
                this.$el.find('select[data-dimension-id=' + filterDimensionId + ']').val(e.get('id'));
            }            
        },

        _bindEvents : function () {
            var self = this;
            this.filterDimensions.each(function(filterDimension) {
                filterDimension.get('representations').on("change:drawable", _.debounce(_.bind(self._updateSelectedCategory, self, filterDimension.get('id')), 300));                
            });
            this.listenTo(this.filterDimensions, "change:zone change:selected", _.throttle(this.render, 15));
            this.listenTo(this.optionsModel, "change:filter", this.toggleVisibility);
        },

        toggleVisibility: function() {
            if (this.optionsModel.get('filter')) {
                this.$el.show();
            } else {
                this.$el.hide();
            }
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

        _getIconFromZone : function (zone) {
            var currentChartType = this._getCurrentChartType();
            var icon;
            if (currentChartType) {
                icon = this.configuration[currentChartType].zones[zone].icon;
            } 
            return _.isUndefined(icon) ? "" : "icon-" + icon;
        },

        _getZonesByChartType : function() {
            var currentChartType = this._getCurrentChartType();
            return currentChartType ? Object.keys(this.configuration[currentChartType].zones) : [];
        },
        
        _zoneIsDraggableByChartType : function(zone) {
            var isDraggable = this._getCurrentChartType() ? this.configuration[this._getCurrentChartType()].zones[zone].draggable : false;
            if (_.isUndefined(isDraggable)) {
                throw "Is draggable undefined for zone " + zone + " and chart type " + this._getCurrentChartType();
            }
            return isDraggable;
        },

        _renderContext : function () {
            var zonesIds = this._getZonesByChartType();
            var zones = _.map(zonesIds, function (zone) {
                return {
                    id : zone,
                    label : this._getLabelFromZone(zone),
                    icon : this._getIconFromZone(zone),
                    draggable : this._zoneIsDraggableByChartType(zone),
                    dimensions : this._dimensionsForZone(zone),
                    isFixed : this._isFixedZone(zone),
                    location : this._getLocationForZone(zone),
                    showHeader : this._getShowHeader(zone)
                };
            }, this);

            return {
                leftColumnDimensions : this._getLeftColumnDimensions(zones),
                zones : zones
            };
        },

        _getLeftColumnDimensions : function(zones) {
            var currentChartType = this._getCurrentChartType();
            var leftColumnDimensions = _.reduce(zones, function(memo, zone) {
                if (zone.location == "left") {
                    return memo + zone.dimensions.length; 
                } else {
                    return memo;
                }             
            }, 0)
            return currentChartType ? leftColumnDimensions : 0;
        },
        
        _getShowHeader : function(zone) {
            var currentChartType = this._getCurrentChartType();
            return currentChartType ? this.configuration[currentChartType].zones[zone].showHeader : true;
        },

        _getLocationForZone : function(zone) {
            var currentChartType = this._getCurrentChartType();
            return currentChartType ? this.configuration[currentChartType].zones[zone].location : "right";
        },

        _isFixedZone : function(zoneId) {
            return this.filterDimensions.isFixedZone(zoneId);
        },

        _isMap : function () {
            return "map" === this._getCurrentChartType() || "mapbubble" === this._getCurrentChartType();
        },

        render : function () {
            this._unbindEvents();
            this._bindEvents();
            var context = this._renderContext();
            this.$el.html(this.template(context));
            this.scrollbuttons = [];
            var self = this;
            this.$el.find('.order-sidebar-dimensions.scrollable').each(function() {
                 self.scrollbuttons.push(new App.components.scrollbuttons.Scrollbuttons({el : this}));
            });

            this.toggleVisibility();
        },

        _dimensionsForZone : function (zoneId) {
            var dimensionCollection = this.filterDimensions.dimensionsAtZone(zoneId);
            var isMap = this._isMap();
            var self = this;
            var dimensionsForZone = dimensionCollection.map(function (dimensionModel) {
                var dimension = dimensionModel.toJSON();
                dimension.draggable = isMap ? dimensionModel.get('type') === "GEOGRAPHIC_DIMENSION" : true;
                if (self._isFixedZone(zoneId)) {                    
                    dimension.selectedCategory = dimensionModel.get('representations').findWhere({drawable : true}).toJSON();
                    dimension.representationsList = dimensionModel.get('representations').where({'selected': true}).map(function(model) { return model.toJSON(); });
                }
                return dimension;
            });
            return dimensionsForZone;
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
            e.preventDefault();
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
            var transferDimension = this.filterDimensions.get(transferDimensionId);
            if (transferDimension) {
                if (currentTarget.data("dimension-id")) {
                    // swap two dimensions
                    var toDimensionId = currentTarget.data("dimension-id");
                    var toDimension = this.filterDimensions.get(toDimensionId);
                    this.filterDimensions.zones.swapDimensions(transferDimension, toDimension);
                } else {
                    //move to a zone
                    var zone = currentTarget.data("zone");
                    this.filterDimensions.zones.setDimensionZone(zone, transferDimension);
                }
            } // Non draggable        
            return false;
        },

        _onDragend : function () {
            this.$("." + DRAGOVER_CLASS).removeClass(DRAGOVER_CLASS);
        }

    });


}());