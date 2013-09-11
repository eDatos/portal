describe("RangesView", function () {

    var model = new App.Map.MapModel();
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
    var rangesView = new App.Map.RangesView({model : model});

    it("calculateIncrement - should calculate the increments of the ranges selector when changed", function () {
        var inc = rangesView._calculateIncrementPixels(100, 11);
        expect(inc).toBe(10);
    });

    it("getDraggableDivLeft - should calculate the left value od the dragging DIV", function () {
        rangesView._increment = 10;
        rangesView.model.set({ currentRangesNum : 5 });
        var draggablePageX = rangesView._getDraggableDivLeft();
        expect(draggablePageX).toBe(40);

        rangesView.model.set({ currentRangesNum : 1 });
        draggablePageX = rangesView._getDraggableDivLeft();
        expect(draggablePageX).toBe(0);

        rangesView.model.set({ currentRangesNum : 10 });
        draggablePageX = rangesView._getDraggableDivLeft();
        expect(draggablePageX).toBe(90);
    });

    it("isMovementLongEnough - check if the movement is greater than the increment", function () {
        rangesView._increment = 10;
        var eX = 1000;
        var x = 1020;
        var diffX = eX - x;
        var isLongEnough = rangesView._isMovementLongEnough(diffX);
        expect(isLongEnough).toBeTruthy();

        eX = 1005;
        x = 1000;
        diffX = eX - x;
        isLongEnough = rangesView._isMovementLongEnough(diffX);
        expect(isLongEnough).toBeFalsy();
    });

    it("movingRight - Check if we sholud move to the right and then do it", function () {
        rangesView.model.set({ currentRangesNum : 5 });
        rangesView._movingRight();
        var currentRangesNum = rangesView.model.get("currentRangesNum");
        expect(currentRangesNum).toBe(6);

        rangesView.model.set({ currentRangesNum : 1 });
        rangesView._movingRight();
        currentRangesNum = rangesView.model.get("currentRangesNum");
        expect(currentRangesNum).toBe(2);

        rangesView.model.set({ currentRangesNum : 10 });
        rangesView._movingRight();
        currentRangesNum = rangesView.model.get("currentRangesNum");
        expect(currentRangesNum).toBe(10);
    });

    it("movingLeft - Check if we sholud move to the left and then do it", function () {
        rangesView.model.set({ currentRangesNum : 5 });
        rangesView._movingLeft();
        var currentRangesNum = rangesView.model.get("currentRangesNum");
        expect(currentRangesNum).toBe(4);

        rangesView.model.set({ currentRangesNum : 10 });
        rangesView._movingLeft();
        currentRangesNum = rangesView.model.get("currentRangesNum");
        expect(currentRangesNum).toBe(9);

        rangesView.model.set({ currentRangesNum : 1 });
        rangesView._movingLeft();
        currentRangesNum = rangesView.model.get("currentRangesNum");
        expect(currentRangesNum).toBe(1);
    });

    rangesView.destroy();

});