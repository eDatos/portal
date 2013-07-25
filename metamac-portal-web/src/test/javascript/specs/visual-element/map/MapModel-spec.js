describe("mapModel", function () {

    var model = null;

    beforeEach(function () {

        model = new STAT4YOU.Map.MapModel();
        model.attributes = {
            minScale : 1,
            maxScale : 32,
            scaleFactor : 2,
            currentScale : 1,
            x : 0,
            y : 0,
            animationDelay : 0,
            /* Leyend */
            minValue : 0,
            maxValue : 40,
            minRangesNum : 1,
            maxRangesNum : 10,
            currentRangesNum : 5
        };
    });

    it("transformToValidScaleFactor", function () {
        var newScaleFactor;
        newScaleFactor = model.transformToValidScaleFactor(2.1);
        expect(newScaleFactor).toBe(2);

        newScaleFactor = model.transformToValidScaleFactor(6);
        expect(newScaleFactor).toBe(4);

        newScaleFactor = model.transformToValidScaleFactor(45.2);
        expect(newScaleFactor).toBe(32);

        newScaleFactor = model.transformToValidScaleFactor(0.1);
        expect(newScaleFactor).toBe(1);
    });

    it("isNewScaleFactorTooBig", function () {
        var isTooBig;
        isTooBig = model.isNewScaleFactorTooBig(3);
        expect(isTooBig).toBeFalsy();

        isTooBig = model.isNewScaleFactorTooBig(32);
        expect(isTooBig).toBeFalsy();

        isTooBig = model.isNewScaleFactorTooBig(33);
        expect(isTooBig).toBeTruthy();
    });

    it("isNewScaleFactorTooSmall", function () {
        var isTooSmall;
        isTooSmall = model.isNewScaleFactorTooSmall(3);
        expect(isTooSmall).toBeFalsy();

        isTooSmall = model.isNewScaleFactorTooSmall(1);
        expect(isTooSmall).toBeFalsy();

        isTooSmall = model.isNewScaleFactorTooSmall(0);
        expect(isTooSmall).toBeTruthy();

        isTooSmall = model.isNewScaleFactorTooSmall(-10);
        expect(isTooSmall).toBeTruthy();
    });

    it("isRequestedZoomAllowed - When the current scale in not in the boundaries the zoom must be allowed", function () {
        /*ZoomOut*/
        model.set({ currentScale : 1});
        expect(model.isRequestedZoomAllowed(-1)).toBeFalsy();
        model.set({ currentScale : 2});
        expect(model.isRequestedZoomAllowed(-1)).toBeTruthy();
        /* ZoomIn */
        model.set({ currentScale : 32});
        expect(model.isRequestedZoomAllowed(1)).toBeFalsy();
        model.set({ currentScale : 16});
        expect(model.isRequestedZoomAllowed(1)).toBeTruthy();
    });

    describe("Zoom", function () {
        it("zoomIn - should double the currentScale", function () {
            model.set({ currentScale : 8});
            model.zoomIn();
            expect(model.attributes.currentScale).toBe(16);
        });

        it("zoomIn - when the limit is reached the scale doesn't change", function () {
            model.set({ currentScale : 32});
            model.zoomIn();
            expect(model.attributes.currentScale).toBe(32);
        });

        it("zoomOut - should divide by two the currentScale", function () {
            model.set({ currentScale : 8});
            model.zoomOut();
            expect(model.attributes.currentScale).toBe(4);
        });

        it("zoomOut - when the limit is reached the scale doesn't change", function () {
            model.set({ currentScale : 1});
            model.zoomOut();
            expect(model.attributes.currentScale).toBe(1);
        });

    });

    it("currentZoomLevel - get the current zoom from the current scale", function () {
        model.set({ currentScale : 1});
        var currentZoom = model.currentZoomLevel();
        expect(currentZoom).toBe(0);
        model.set({ currentScale : 16});
        currentZoom = model.currentZoomLevel();
        expect(currentZoom).toBe(4);
    });

    it("numZoomLevels - get the number of zoom levels from the max scale factor", function () {
        model.set({ maxScale : 32});
        var numZoomLevels = model.numZoomLevels();
        expect(numZoomLevels).toBe(5);
    });


    describe("zoomMouseWheel", function () {

        it("zoomMouseWheel - The new position is calculated properly when zooming In", function () {
            model.zoomMouseWheel({delta : 1, xOffset : 177, yOffset : -82});
            expect(model.attributes.currentScale).toBe(2);
            expect(model.attributes.x).toBe(-88.5);
            expect(model.attributes.y).toBe(41);
        });

        it("zoomMouseWheel - The new position is calculated properly when zooming Out", function () {
            model.set({ currentScale : 2, x : -88.5, y : 41});
            model.zoomMouseWheel({delta : -1, xOffset : 177, yOffset : -82});
            expect(model.attributes.currentScale).toBe(1);
            expect(model.attributes.x).toBe(0);
            expect(model.attributes.y).toBe(0);
        });

    });

    it("scaleMovement - The movement must be scaled depending on the currentScale", function () {
        expect(model.scaleMovement(10)).toBe(10);
        model.set({ currentScale : 8});
        expect(model.scaleMovement(80)).toBe(10);
    });

    it("log2 - obtain the right value of a log2(n)", function () {
        expect(model._log2(8)).toBe(3);
    });

});