describe("[TableCanvas] ScrollManager", function () {

    var ScrollManager = STAT4YOU.Table.ScrollManager,
        View = STAT4YOU.Table.View;

    var view, scrollManager;
    var $document, $body;

    beforeEach(function () {
        $document = $(document);
        $body = $('body');
        view = {
            canvas : {
                addEventListener : function () {
                }
            },
            zoneFromPoint : function () {
            },
            setMousePosition : function () {

            }
        };
        scrollManager = new ScrollManager(view);
        scrollManager.$canvas = {
            offset : function () {
                return {top : 0, left : 0};
            }
        };
    });

    afterEach(function () {
        scrollManager.destroy();
    });

    function testCursorClass(zone, expectedClass) {
        spyOn(view, "zoneFromPoint").andReturn(zone);
        $document.trigger('mousemove', {pageX : 100, pageY : 100});

        waitsFor(function () {
            return view.zoneFromPoint.callCount > 0;
        }, "zone FromPoint called", 1000);


        runs(function () {
            expect($body.hasClass(expectedClass)).toBeTruthy();
        });
    }

    it("should has class .move if cursor in bodyZone", function () {
        testCursorClass("bodyZone", "move");
    });

    it("should has class .move-updown if cursor in bodyZone", function () {
        testCursorClass("leftHeaderZone", "move-updown");
    });

    it("should has class .move-leftright if cursor in bodyZone", function () {
        testCursorClass("topHeaderZone", "move-leftright");
    });

    it("should not has .move if cursor not in bodyZone", function () {
        spyOn(view, "zoneFromPoint").andReturn("otherZone");
        $document.trigger('mousemove', {pageX : 100, pageY : 100});

        waitsFor(function () {
            return view.zoneFromPoint.callCount > 0;
        }, "zone FromPoint called", 1000);

        runs(function () {
            _.each(["move", "move-leftright", "move-updown"], function (cursorClass) {
                expect($body.hasClass(cursorClass)).toBeFalsy();
            });
        });

    });

});