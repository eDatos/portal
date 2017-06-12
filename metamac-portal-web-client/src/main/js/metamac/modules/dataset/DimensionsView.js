(function () {
    "use strict";

    App.namespace("App.modules.dataset");

    var DRAGOVER_CLASS = "drag-over";

    // TODO: Can we have a common View for for this and OrderSidebarView?
    App.modules.dataset.DimensionsView = Backbone.View.extend({

        template: App.templateManager.get('dataset/dataset-dimensions'),

        initialize: function (options) {
            this.dataset = options.dataset;
            this.filterDimensions = options.filterDimensions;
            this.optionsModel = options.optionsModel;
            this.measureAttribute = null;
        },

        configuration: {
            info: {
                zones: {},
            },
            table: {
                zones: {
                    top: {
                        icon: "columns",
                        draggable: true,
                        location: "right",
                        showHeader: true
                    },
                    left: {
                        icon: "rows",
                        draggable: true,
                        location: "right",
                        showHeader: true
                    }
                }
            },
            column: {
                zones: {
                    axisy: {
                        icon: "axis-y",
                        draggable: false,
                        location: "left",
                        showHeader: true,
                        showMeasureAttribute: true
                    },
                    left: {
                        icon: "axis-x",
                        draggable: true,
                        location: "right",
                        showHeader: true,
                        width: "225px"
                    },
                    top: {
                        icon: "column",
                        draggable: true,
                        location: "right",
                        showHeader: true,
                        width: "calc(100% - 225px)"
                    },
                    fixed: {
                        icon: "lock",
                        draggable: true,
                        location: "right",
                        showHeader: true
                    }
                }
            },
            line: {
                zones: {
                    axisy: {
                        icon: "axis-y",
                        draggable: false,
                        location: "left",
                        showHeader: true,
                        showMeasureAttribute: true
                    },
                    left: {
                        icon: "axis-x",
                        draggable: false,
                        location: "left",
                        showHeader: true
                    },
                    top: {
                        icon: "line",
                        draggable: true,
                        location: "right",
                        showHeader: true
                    },
                    fixed: {
                        icon: "lock",
                        draggable: true,
                        location: "right",
                        showHeader: true
                    }
                }
            },
            map: {
                zones: {
                    left: {
                        icon: "map",
                        draggable: false,
                        location: "left",
                        showHeader: false
                    },
                    fixed: {
                        icon: "lock",
                        draggable: false,
                        location: "right",
                        showHeader: true
                    },
                }
            },
            mapbubble: {
                zones: {
                    left: {
                        icon: "map",
                        draggable: false,
                        location: "left",
                        showHeader: false
                    },
                    fixed: {
                        icon: "lock",
                        draggable: false,
                        location: "right",
                        showHeader: true
                    }
                }
            }
        },

        events: {
            "dragstart .order-sidebar-dimension.draggable": "_onDragstart",
            "dragenter .order-sidebar-dimension.draggable": "_onDragenter",
            "dragover .order-sidebar-dimension.draggable": "_onDragover",
            "dragleave .order-sidebar-dimension.draggable": "_onDragleave",
            "drop .order-sidebar-dimension.draggable": "_onDrop",
            "dragend .order-sidebar-dimension.draggable": "_onDragend",

            "dragenter .order-sidebar-zone.draggable": "_onDragenter",
            "dragover .order-sidebar-zone.draggable": "_onDragover",
            "dragleave .order-sidebar-zone.draggable": "_onDragleave",
            "drop .order-sidebar-zone.draggable": "_onDrop",

            "click a.order-sidebar-dimension": "_dontFollowLinks",
            "click a.order-sidebar-measure-attribute": "_dontFollowLinks",
            "change .fixed-dimension-select-category": "_onChangeCategory",
            "change .dimension-select-level": "_onChangeLevel",
            "change .dimension-select-granularity": "_onChangeGranularity",

            "focusin .order-sidebar-dimension": "_onFocusin",
            "focusout .order-sidebar-dimension": "_onFocusout"
        },

        _dontFollowLinks: function (e) {
            e.preventDefault();
        },

        hasNewdata: function () {
            var measureAttribute = _.findWhere(this.dataset.data.getDatasetAttributes(), { type: "MEASURE" });
            if (measureAttribute) {
                this.measureAttribute = {
                    label: App.i18n.localizeText(measureAttribute.attributeValues.value[0].name)
                }
                this.render();
            }
        },

        getMeasureAttribute: function () {
            return this.measureAttribute;
        },

        _onChangeCategory: function (e) {
            var currentTarget = $(e.currentTarget);
            var selectedCategoryId = currentTarget.val();
            var dimensionId = currentTarget.data("dimension-id");
            if (dimensionId) {
                var representations = this.filterDimensions.get(dimensionId).get('representations');

                var selectedCategory = representations.findWhere({ id: selectedCategoryId });
                if (!_.isUndefined(representations.get(selectedCategory))) {
                    representations.get(selectedCategory).set({ drawable: true });
                }
            }
        },

        _updateDrawableRepresentationsBySelectedLevel: function (dimensionId, selectedLevel) {
            this.filterDimensions.get(dimensionId).get('representations').updateDrawablesBySelectedLevel(selectedLevel);
        },

        _updateDrawableRepresentationsBySelectedGranularity: function (dimensionId, selectedGranularity) {
            this.filterDimensions.get(dimensionId).get('representations').updateDrawablesBySelectedGranularity(selectedGranularity);
        },

        _updateRepresentations: function (filterDimensionId, e) {
            // TODO Refactor this to avoid accesing the DOM
            var selectedLevel = this.$el.find('select.dimension-select-level[data-dimension-id=' + filterDimensionId + ']').val();
            if (selectedLevel) {
                this._updateDrawableRepresentationsBySelectedLevel(filterDimensionId, selectedLevel);
            }

            var selectedGranularity = this.$el.find('select.dimension-select-granularity[data-dimension-id=' + filterDimensionId + ']').val();
            if (selectedGranularity) {
                this._updateDrawableRepresentationsBySelectedGranularity(filterDimensionId, selectedGranularity);
            }
        },

        _onChangeLevel: function (e) {
            var currentTarget = $(e.currentTarget);
            var selectedLevel = currentTarget.val();
            var dimensionId = currentTarget.data("dimension-id");
            if (dimensionId) {
                this._updateDrawableRepresentationsBySelectedLevel(dimensionId, selectedLevel);
            }
        },

        _onChangeGranularity: function (e) {
            var currentTarget = $(e.currentTarget);
            var selectedLevel = currentTarget.val();
            var dimensionId = currentTarget.data("dimension-id");
            if (dimensionId) {
                this._updateDrawableRepresentationsBySelectedGranularity(dimensionId, selectedLevel);
            }
        },

        _onFocusin: function (e) {
            $(e.currentTarget).addClass('active');
        },

        _onFocusout: function (e) {
            $(e.currentTarget).removeClass('active');
        },

        destroy: function () {
            this._unbindEvents();
        },

        _updateSelectedCategory: function (filterDimensionId, e) {
            if (!_.isUndefined(e)) {
                this.$el.find('select.fixed-dimension-select-category[data-dimension-id=' + filterDimensionId + ']').val(e.get('id'));
            }
        },

        _bindEvents: function () {
            var self = this;
            this.filterDimensions.each(function (filterDimension) {
                self.listenTo(filterDimension.get('representations'), 'change:drawable', _.debounce(_.bind(self._updateSelectedCategory, self, filterDimension.get('id')), 300));
                self.listenTo(self.filterDimensions, 'change:selected', _.debounce(_.bind(self._updateRepresentations, self, filterDimension.get('id')), 300));
            });
            this.listenTo(this.filterDimensions, "change:zone change:selected", _.throttle(self.render, 500));
            this.listenTo(this.dataset.data, "hasNewData", self.hasNewdata);
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        _getCurrentChartType: function () {
            return this.optionsModel.get("type");
        },

        _getLabelFromZone: function (zone) {
            var currentChartType = this._getCurrentChartType();
            return I18n.t("filter.sidebar.order." + currentChartType + "." + zone);
        },

        _getIconFromZone: function (zone) {
            var currentChartType = this._getCurrentChartType();
            var icon;
            if (currentChartType) {
                icon = this.configuration[currentChartType].zones[zone].icon;
            }
            return _.isUndefined(icon) ? "" : "icon-" + icon;
        },

        _getZonesByChartType: function () {
            var currentChartType = this._getCurrentChartType();
            return currentChartType ? Object.keys(this.configuration[currentChartType].zones) : [];
        },

        _zoneIsDraggableByChartType: function (zone) {
            var isDraggable = this._getCurrentChartType() ? this.configuration[this._getCurrentChartType()].zones[zone].draggable : false;
            if (_.isUndefined(isDraggable)) {
                throw "Is draggable undefined for zone " + zone + " and chart type " + this._getCurrentChartType();
            }
            return isDraggable;
        },

        _zoneWidthByChartType: function (zone) {
            return this._getCurrentChartType() ? this.configuration[this._getCurrentChartType()].zones[zone].width : false;
        },

        _renderContext: function () {
            var zonesIds = this._getZonesByChartType();
            var zones = _.map(zonesIds, function (zone) {
                return {
                    id: zone,
                    label: this._getLabelFromZone(zone),
                    icon: this._getIconFromZone(zone),
                    draggable: this._zoneIsDraggableByChartType(zone),
                    dimensions: this._dimensionsForZone(zone),
                    measureAttribute: this._measureAttributesForZone(zone),
                    hasSelector: this._hasSelector(zone),
                    location: this._getLocationForZone(zone),
                    showHeader: this._getShowHeader(zone),
                    width: this._zoneWidthByChartType(zone)
                };
            }, this);

            return {
                leftColumns: this._getLeftColumns(zones),
                zones: zones
            };
        },

        _getLeftColumns: function (zones) {
            var currentChartType = this._getCurrentChartType();
            var leftColumns = _.reduce(zones, function (memo, zone) {
                if (zone.location == "left") {
                    memo += zone.dimensions.length;
                    if (zone.measureAttribute) {
                        memo += 1;
                    }
                }
                return memo;
            }, 0)
            return currentChartType ? leftColumns : 0;
        },

        _getShowHeader: function (zone) {
            var currentChartType = this._getCurrentChartType();
            return currentChartType ? this.configuration[currentChartType].zones[zone].showHeader : true;
        },

        _getLocationForZone: function (zone) {
            var currentChartType = this._getCurrentChartType();
            return currentChartType ? this.configuration[currentChartType].zones[zone].location : "right";
        },

        _hasSelector: function (zoneId) {
            return this._isFixedZone(zoneId) || this._hasHierarchySelector(zoneId);
        },

        _isFixedZone: function (zoneId) {
            return this.filterDimensions.isFixedZone(zoneId);
        },

        _hasHierarchySelector: function (zone) {
            var self = this;
            return this.filterDimensions.dimensionsAtZone(zone)
                .reduce(function (memo, dimension) {
                    return memo || self._needsGeographicLevelSelector(dimension) || self._needsTemporalGranularitySelector(dimension);
                }, false);
        },

        _isMap: function () {
            return "map" === this._getCurrentChartType() || "mapbubble" === this._getCurrentChartType();
        },

        render: function () {
            this._unbindEvents();
            this._bindEvents();
            var context = this._renderContext();
            this.$el.html(this.template(context));
            this.scrollbuttons = [];
            var self = this;
            this.$el.find('.order-sidebar-dimensions.scrollable').each(function () {
                self.scrollbuttons.push(new App.components.scrollbuttons.Scrollbuttons({ el: this }));
            });
            this.$el.find('select').select2({
                dropdownParent: $('.metamac-container')
            });
        },

        _measureAttributesForZone: function (zoneId) {
            var currentChartType = this._getCurrentChartType();
            var showMeasureAttribute = this.configuration[currentChartType].zones[zoneId].showMeasureAttribute;
            if (showMeasureAttribute) {
                return this.getMeasureAttribute();
            }
        },

        _dimensionsForZone: function (zoneId) {
            var dimensionCollection = this.filterDimensions.dimensionsAtZone(zoneId);
            var isMap = this._isMap();
            var self = this;
            var dimensionsForZone = dimensionCollection.map(function (dimensionModel) {
                var dimension = dimensionModel.toJSON();
                var isGeographicDimension = dimensionModel.get('type') === "GEOGRAPHIC_DIMENSION";
                dimension.draggable = isMap ? isGeographicDimension : true;

                if (self._needsGeographicLevelSelector(dimensionModel)) {
                    dimension.selectedLevel = dimensionModel.get('representations').getMostPopulatedGeographicLevel();
                    dimension.levelList = self._getGeographicLevelCollection(dimensionModel);
                } else if (self._needsTemporalGranularitySelector(dimensionModel)) {
                    dimension.selectedGranularity = dimensionModel.get('representations').getMostPopulatedTemporalGranularity();
                    dimension.granularityList = self._getGranularityList(dimensionModel);
                } else if (self._isFixedZone(zoneId)) {
                    dimension.selectedCategory = dimensionModel.get('representations').findWhere({ drawable: true }).toJSON();
                    dimension.representationsList = dimensionModel.get('representations').where({ 'selected': true }).map(function (model) { return model.toJSON(); });
                }
                return dimension;
            });
            return dimensionsForZone;
        },

        _needsGeographicLevelSelector: function (dimension) {
            return this._isMap() && dimension.get('type') == "GEOGRAPHIC_DIMENSION";
        },

        _getGeographicLevelCollection: function (dimension) {
            var selectedLevels = dimension.get('representations').getSelectedGeographicLevels();
            var uniqueLevels = _(selectedLevels).uniq().sort();
            return _(uniqueLevels).map(function (level) {
                return {
                    level: level,
                    label: I18n.t('filter.selector.level', { level: (level + 1) })
                };
            });
        },

        _needsTemporalGranularitySelector: function (dimension) {
            return this._getCurrentChartType() == 'line' && dimension.get('type') == "TIME_DIMENSION";
        },

        _getGranularityList: function (dimension) {
            var selectedGranularities = dimension.get('representations').getSelectedTemporalGranularities();
            var uniqueGranularities = _(selectedGranularities).uniq().sort();
            return _(uniqueGranularities).map(function (granularity) {
                return {
                    granularity: granularity,
                    label: I18n.t("entity.granularity.temporal.enum." + granularity, { defaults: [{ message: "" }] })
                };
            });
        },

        _onDragstart: function (e) {
            var $elem = $(e.currentTarget);
            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('Text', $elem.data("dimension-id"));
        },

        _onDragover: function (e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);
            $currentTarget.addClass(DRAGOVER_CLASS);
            return false;
        },

        _onDragenter: function (e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);
            $currentTarget.addClass(DRAGOVER_CLASS);
        },

        _onDragleave: function (e) {
            var $currentTarget = $(e.currentTarget);
            $currentTarget.removeClass(DRAGOVER_CLASS);
        },

        _onDrop: function (e) {
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

        _onDragend: function () {
            this.$("." + DRAGOVER_CLASS).removeClass(DRAGOVER_CLASS);
        }

    });


}());