describe("FullScreen", function(){

    describe("no support", function () {
        var $container, containerEl;
        beforeEach(function () {
            var container = '<div id="container"> ' +
                '    <div id="chart" class="chart-container">' +
                '       Content for width' +
                '    </div> ' +
                '    <div class="fs"></div> ' +
                '</div>';
            setFixtures(container);

            // Simulating no browser support form fullScreen
            $container = $('#container');
            containerEl = $container.get(0);
            containerEl.webkitRequestFullScreen = undefined;
            containerEl.requestFullScreen = undefined;
            containerEl.mozRequestFullScreen = undefined;
            containerEl.msRequestFullScreen = undefined;
        });


        it("Should resize the div", function(){
            var fullScreen = new STAT4YOU.FullScreen({container : containerEl});
            fullScreen.enterFullScreen();
            expect($container.hasClass('full-screen-no-support')).toBeTruthy();
            fullScreen.exitFullScreen();
            expect($container.hasClass('full-screen-no-support')).toBeFalsy();
        });

        it("should trigger events", function () {
            var fullScreen = new STAT4YOU.FullScreen({container : containerEl});
            var willEnterSpy = jasmine.createSpy();
            var didEnterSpy = jasmine.createSpy();
            var willExitSpy = jasmine.createSpy();
            var didExitSpy = jasmine.createSpy();

            fullScreen.on("willEnterFullScreen", willEnterSpy);
            fullScreen.on("didEnterFullScreen", didEnterSpy);
            fullScreen.on("willExitFullScreen", willExitSpy);
            fullScreen.on("didExitFullScreen", didExitSpy);

            fullScreen.enterFullScreen();
            expect(willEnterSpy).toHaveBeenCalled();
            expect(didEnterSpy).toHaveBeenCalled();

            fullScreen.exitFullScreen();
            expect(willExitSpy).toHaveBeenCalled();
            expect(didExitSpy).toHaveBeenCalled();
        });

        it("Should exit fullscreen on press exit", function () {
            var fullScreen = new STAT4YOU.FullScreen({container : containerEl});

            var didExitSpy = jasmine.createSpy();
            fullScreen.on("didExitFullScreen", didExitSpy);

            fullScreen.enterFullScreen();

            // Simulate ESC
            var keyDownEvent = $.Event("keydown");
            keyDownEvent.which = 27; // # ESC KEY
            $(document).trigger(keyDownEvent);

            expect(didExitSpy).toHaveBeenCalled();
        });
    });


});