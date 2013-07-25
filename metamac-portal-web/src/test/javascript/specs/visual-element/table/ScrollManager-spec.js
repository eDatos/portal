describe("[TableCanvas] ScrollManager", function () {

    var ScrollManager = STAT4YOU.Table.ScrollManager,
        View = STAT4YOU.Table.View;

    var view, scrollManager;
    var $document, $body;

    beforeEach(function () {
        $document = $(document);
        $body = $('body');

        var $canvas = $('<div></div>');

        view = {
            canvas : $canvas[0],
            zoneFromPoint : function () {
            },
            setMousePosition : function () {

            },
            rectangleContainsColumnSeparator : function () {

            }
        };
        scrollManager = new ScrollManager(view);
    });

    afterEach(function () {
        scrollManager.destroy();
    });

    var testCursorClass = function (zone, expectedClass, done) {
        sinon.stub(view, "zoneFromPoint").returns(zone);
        sinon.stub(view, "rectangleContainsColumnSeparator").returns(false);
        scrollManager.$canvas.trigger('mousemove', {pageX : 100, pageY : 100});

        SpecUtils.waitFor(function () {
            return view.zoneFromPoint.called;
        }, function () {
            expect($body.hasClass(expectedClass)).to.be.true;
            done();
        });
    }

    it("should has class .move if cursor in bodyZone", function (done) {
        testCursorClass("bodyZone", "move", done);
    });

    it("should has class .move-updown if cursor in bodyZone", function (done) {
        testCursorClass("leftHeaderZone", "move-updown", done);
    });

    it("should has class .col-resize if cursor in leftHeaderZone-separator", function (done) {
        testCursorClass("leftHeaderZone-separator", "col-resize", done);
    });

    it("should has class .col-resize if cursor in topHeaderZone-separator", function (done) {
        testCursorClass("topHeaderZone-separator", "col-resize", done);
    });

    it("should has class .move-leftright if cursor in bodyZone", function (done) {
        testCursorClass("topHeaderZone", "move-leftright", done);
    });

});