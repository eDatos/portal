describe("FullScreen", function () {

    describe("no support", function () {
        var $container;
        var containerEl;
        var fullScreen;

        beforeEach(function () {
            var container = '<div id="container"> ' +
                '    <div id="chart" class="chart-container">' +
                '       Content for width' +
                '    </div> ' +
                '    <div class="fs"></div> ' +
                '</div>';

            // Simulating no browser support form fullScreen
            $container = $(container);
            $container.appendTo($("body"));

            containerEl = $container.get(0);
            containerEl.webkitRequestFullScreen = undefined;
            containerEl.requestFullScreen = undefined;
            containerEl.mozRequestFullScreen = undefined;
            containerEl.msRequestFullScreen = undefined;

            fullScreen = new STAT4YOU.FullScreen({container : containerEl});
            fullScreen.FS_RESIZE_DELAY = 0; // remove delay
        });

        afterEach(function () {
            $container.remove();
        });

        it("Should resize the div", function (done) {
            fullScreen.FS_RESIZE_DELAY = 0; // remove delay

            fullScreen.on("didEnterFullScreen", function () {
                expect($container.hasClass('full-screen-no-support')).to.be.true;
            });

            fullScreen.on("didExitFullScreen", function () {
                expect($container.hasClass('full-screen-no-support')).to.be.false;
                done();
            });

            fullScreen.enterFullScreen();
            fullScreen.exitFullScreen();
        });

        it("should trigger events", function (done) {
            var willEnterSpy = sinon.spy();
            var didEnterSpy = sinon.spy();
            var willExitSpy = sinon.spy();
            var didExitSpy = sinon.spy();

            fullScreen.on("willEnterFullScreen", willEnterSpy);
            fullScreen.on("didEnterFullScreen", didEnterSpy);
            fullScreen.on("willExitFullScreen", willExitSpy);
            fullScreen.on("didExitFullScreen", didExitSpy);

            fullScreen.enterFullScreen();
            fullScreen.exitFullScreen();

            fullScreen.on("didExitFullScreen", function () {
                expect(willEnterSpy.called).to.be.true;
                expect(didEnterSpy.called).to.be.true
                expect(willExitSpy.called).to.be.true;
                expect(didExitSpy.called).to.be.true;

                done();
            });

        });

        it("Should exit fullscreen on press exit", function (done) {
            var didExitSpy = sinon.spy();
            fullScreen.on("didExitFullScreen", didExitSpy);

            fullScreen.enterFullScreen();

            // Simulate ESC
            var keyDownEvent = $.Event("keydown");
            keyDownEvent.which = 27; // # ESC KEY
            $(document).trigger(keyDownEvent);

            fullScreen.on("didExitFullScreen", function () {
                expect(didExitSpy.called).to.be.true;
                done();
            });
        });

    });


});