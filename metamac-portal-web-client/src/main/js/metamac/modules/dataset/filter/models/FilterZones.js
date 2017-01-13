(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterZones');

    App.modules.dataset.filter.models.FilterZones = Backbone.Collection.extend({

        model : App.modules.dataset.filter.models.FilterZone,

        initialize : function () {
            this._bindEvents();
        },

        _bindEvents : function () {
            this.on('change:fixedSize', this._onModelChangeFixedSize);
        },

        swapDimensions : function (dimension1, dimension2) {
            var zone1 = dimension1.get('zone');
            var zone2 = dimension2.get('zone');
            var index1 = zone1.get('dimensions').indexOf(dimension1);
            var index2 = zone2.get('dimensions').indexOf(dimension2);

            dimension1.removeFromZone();
            dimension2.removeFromZone();

            zone2.add(dimension1, {at : index2});
            zone1.add(dimension2, {at : index1});
        },

        setDimensionZone : function (zoneId, dimension, options) {
            options = _.defaults({}, options, {force : false});
            var srcZone = dimension.get('zone');

            var destZone = this.get(zoneId);

            var srcInFixedSize = srcZone ? srcZone.get('fixedSize') === srcZone.get('dimensions').length : false;
            var destInFixedSize = destZone.get('fixedSize') === destZone.get('dimensions').length;

            if (options.force == false && (srcInFixedSize || destInFixedSize)) {
                var dimensionInDestZone = destZone.get('dimensions').last();
                if (dimensionInDestZone) {
                    this.swapDimensions(dimension, dimensionInDestZone);
                }
            } else {
                dimension.removeFromZone();
                var zone = this.get(zoneId);
                zone.add(dimension, options);
            }
        },

        getFixedZones : function() {
            return this.filter(function (zone) {
                return zone.isFixed();
            });
        },

        _onModelChangeFixedSize : function (zone) {
            var fixedSize = zone.get('fixedSize');
            if (_.isUndefined(fixedSize)) return;

            var dimensions = zone.get('dimensions');

            if (dimensions.length > fixedSize) {
                this._moveLeftoverDimensions(zone);
            } else if (dimensions.length < fixedSize) {
                this._moveToCompleteFixedSize(zone);
            }
        },

        applyFixedSizeRestriction : function () {
            this.each(this._onModelChangeFixedSize, this);
        },

        _moveLeftoverDimensions : function (zone) {
            var leftoverDimensions = zone.leftoverDimensions();
            var otherZones = this.without(zone);
            while (leftoverDimensions.length > 0) {
                if (otherZones.length === 0) {
                    throw new Error("Invalid restriction");
                }
                var dim = leftoverDimensions[0];
                var otherZone = otherZones[0];
                if (otherZone.canAddDimension()) {
                    this.setDimensionZone(otherZone.id, dim);
                    leftoverDimensions.splice(0, 1);
                } else {
                    otherZones.splice(0, 1);
                }
            }
        },

        _moveToCompleteFixedSize : function (zone) {
            var fixedSize = zone.get('fixedSize');
            var dimensions = zone.get('dimensions');
            var remainingDimensions = fixedSize - dimensions.length;
            var otherZones = this.without(zone);

            var remainingDimensionsInOtherZones = _.chain(otherZones).map(function (zone) {
                return zone.leftoverDimensions();
            }).flatten().value();

            if (remainingDimensionsInOtherZones.length < remainingDimensions) {
                throw new Error("Invalid restriction");
            }

            var dimensionsToMove = remainingDimensionsInOtherZones.slice(0, remainingDimensions);
            _.each(dimensionsToMove, _.bind(this.setDimensionZone, this, zone.id));
        }

    }, {
        initialize : function (dimensions, positions) {
            var zones = new App.modules.dataset.filter.models.FilterZones([
                {id : 'left'},
                {id : 'top'},
                {id : 'fixed', selectedLimit : 1},
                {id : 'axisy', selectedLimit : 1}
            ]);

            var leftDimensions = _.map(positions.left, dimensions.get, dimensions);
            var topDimensions = _.map(positions.top, dimensions.get, dimensions);

            _.each(leftDimensions, _.bind(zones.setDimensionZone, zones, 'left'));
            _.each(topDimensions, _.bind(zones.setDimensionZone, zones, 'top'));

            return zones;
        }
    });

}());