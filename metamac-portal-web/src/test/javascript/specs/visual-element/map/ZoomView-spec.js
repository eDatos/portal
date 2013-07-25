describe("ZoomView", function() {

    var zoomView = new STAT4YOU.Map.ZoomView({width: 1, height: 1});
    
    it("calculateDecrement - should calculate the decrement of the zoom selector when changed", function () {
        var decrement = zoomView._calculateDecrementPixels(105, 5, 10);
        expect(decrement).toBe(10);
    });
    
    zoomView.destroy();
    
});