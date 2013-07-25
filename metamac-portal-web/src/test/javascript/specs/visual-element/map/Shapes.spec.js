describe("Shapes", function () {
    var TIMEOUT = 1000;
    var shapes;

    var result = [
        {normCode : "CODE1", shape : "[shape1]", geometryType : "Polygon"},
        {normCode : "CODE2", shape : "[shape2]", geometryType : "Polygon"}
    ];

    beforeEach(function () {
        shapes = new STAT4YOU.Map.Shapes();
    });

    var callbackWithResolvedDeffered = function () {
        var args = Array.prototype.slice.call(arguments);
        return function () {
            var deferred = new $.Deferred();
            deferred.resolveWith(null, args);
            return deferred;
        };
    };

    it("should try to recover the shapes to store first", function () {
        spyOn(shapes.store, "get").andCallFake(callbackWithResolvedDeffered(result));

        var normCodes = ["CODE1", "CODE2"];
        var req = shapes.fetchShapes(normCodes);

        req.always(function (res) {
            expect(res).toEqual(result);
        });

        waitsFor(function () {
            return req.state() === "resolved";
        }, TIMEOUT);

    });

    it("should find the normCodes not in the store to the api", function () {
        var storeGetResponse = [result[0], undefined];
        var apiResponse = [result[1]];
        spyOn(shapes.store, "get").andCallFake(callbackWithResolvedDeffered(storeGetResponse));
        spyOn(shapes.api, "getShapes").andCallFake(callbackWithResolvedDeffered(apiResponse));
        var saveSpy = spyOn(shapes.store, "save");

        var normCodes = ["CODE1", "CODE2"];

        var req = shapes.fetchShapes(normCodes);
        req.done(function (res) {
            expect(res).toEqual(result);
            expect(saveSpy).toHaveBeenCalledWith(apiResponse);
        });
        waitsFor(function () {
            return req.state() === "resolved";
        }, TIMEOUT);
    });

    it("should find the normCodes not in the store to the api", function () {
        var storeResponse = [undefined, result[1]];
        var apiResponse = [result[0]];
        spyOn(shapes.store, "get").andCallFake(callbackWithResolvedDeffered(storeResponse));
        spyOn(shapes.api, "getShapes").andCallFake(callbackWithResolvedDeffered(apiResponse));
        var saveSpy = spyOn(shapes.store, "save");

        var normCodes = ["CODE1", "CODE2"];

        var req = shapes.fetchShapes(normCodes);
        req.done(function (res) {
            expect(res).toEqual(result);
            expect(saveSpy).toHaveBeenCalledWith(apiResponse);
        });
        waitsFor(function () {
            return req.state() === "resolved";
        }, TIMEOUT);
    });

    it("should find the contour to cache first", function () {
        spyOn(shapes.api, "getContainer").andCallFake(callbackWithResolvedDeffered({normCode : "CONTAINER"}));
        var storeResponse = {normCode : "CONTAINER", shape : "[shape1]"};
        spyOn(shapes.store, "get").andCallFake(callbackWithResolvedDeffered([storeResponse]));

        var req = shapes.fetchContainer(["CODE1", "CODE2"])
            .done(function (result) {
                expect(result).toEqual(storeResponse);
            });

        waitsFor(function () {
            return req.state() === "resolved";
        });
    });

    it("should return undefined if pass empty normCodes list to container", function () {
        var apiSpy = spyOn(shapes.api, "getContainer");
        var storeSpy = spyOn(shapes.store, "get");

        var req = shapes.fetchContainer([null, undefined])
            .done(function (result) {
                expect(result).toEqual([]);
                expect(apiSpy).not.toHaveBeenCalled();
                expect(storeSpy).not.toHaveBeenCalled();
            });

        waitsFor(function () {
            return req.state() === "resolved";
        });

    });

});