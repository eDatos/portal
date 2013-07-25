(function () {
    App.namespace("App.Map.MapModel");

    App.Map.MapModel = Backbone.Model.extend({
        defaults : {
            minScale : 1,
            maxScale : 32,
            scaleFactor : 2,
            currentScale : 1,
            x : 0,
            y : 0,
            animationDelay : 0,
            minValue : 0,
            maxValue : 40,
            values : [1],
            minRangesNum : 1,
            maxRangesNum : 10,
            currentRangesNum : 5
        },

        zoomExit : function () {
            this.set({currentScale : 2, x : 0, y : 0, animationDelay : 1000});
            this.trigger('zoomExit');
        },

        zoomIn : function () {
            var currentScale = this.get("currentScale");
            var scaleFactor = this.get("scaleFactor");

            var newScale = currentScale * scaleFactor;

            if (this.isRequestedZoomAllowed(1)) {
                this.set({currentScale : newScale, animationDelay : 500});
            }
        },

        zoomOut : function () {
            var currentScale = this.get("currentScale");
            var scaleFactor = this.get("scaleFactor");

            var newScale = currentScale / scaleFactor;

            if (this.isRequestedZoomAllowed(-1)) {
                this.set({currentScale : newScale, animationDelay : 500});
            }
        },

        zoomMouseWheel : function (options) {
            var currentScale = this.get("currentScale");
            var newScale = Math.pow(2, options.delta) * currentScale;

            if (newScale > this.get("maxScale")) {
                newScale = this.get("maxScale");
            }

            if (newScale < this.get("minScale")) {
                newScale = this.get("minScale");
            }

            var x = this.get("x") - this.scaleMovement(options.xOffset, currentScale) + this.scaleMovement(options.xOffset, newScale);
            var y = this.get("y") - this.scaleMovement(options.yOffset, currentScale) + this.scaleMovement(options.yOffset, newScale);

            this.set({currentScale : newScale, x : x, y : y, animationDelay : 0});
        },

        currentZoomLevel : function () {
            var currentScale = this.get("currentScale");
            return this._log2(currentScale);
        },

        numZoomLevels : function () {
            var maxScale = this.get("maxScale");
            return this._log2(maxScale);
        },

        transformToValidScaleFactor : function (newScaleFactor) {
            var currentZoomLevelDecimal = this._log2(newScaleFactor);
            var currentZoomLevelInteger = parseInt(currentZoomLevelDecimal);
            var newScaleFactorInteger = Math.pow(2, currentZoomLevelInteger);
            if (this.isNewScaleFactorTooBig(newScaleFactorInteger)) {
                newScaleFactorInteger = this.get("maxScale");
            } else if (this.isNewScaleFactorTooSmall(newScaleFactorInteger)) {
                newScaleFactorInteger = this.get("minScale");
            }
            return newScaleFactorInteger;
        },

        isRequestedZoomAllowed : function (delta) {
            var currentScale = this.get("currentScale");
            var maxScale = this.get("maxScale");
            var minScale = this.get("minScale");
            if (delta > 0)
                return (currentScale < maxScale);
            else
                return (currentScale > minScale);
        },

        isNewScaleFactorTooBig : function (newScaleFactor) {
            var maxScale = this.get("maxScale");
            return newScaleFactor > maxScale;
        },

        isNewScaleFactorTooSmall : function (newScaleFactor) {
            var minScale = this.get("minScale");
            return newScaleFactor < minScale;
        },

        scaleMovement : function (value, newScale) {
            var currentScale = newScale || this.get("currentScale");
            return value / currentScale;
        },

        _log2 : function (val) {
            return Math.log(val) / Math.log(2);
        }

    });

})();