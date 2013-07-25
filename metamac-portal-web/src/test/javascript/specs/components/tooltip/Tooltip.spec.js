describe("Tooltip", function () {
    var Tooltip = App.components.tooltip.Tooltip;
    var tooltip;
    var $container;

    beforeEach(function () {
        $container = $('<div></div>');
        $container.appendTo($('body'));
    });

    afterEach(function () {
        tooltip.destroy();
        $container.remove();
    });

    describe("setEl", function () {
        it("should eq body if el hasn't a parent in fullScreen", function () {
            $container.addClass("tooltip-container");
            tooltip = new Tooltip({el : '.tooltip-container'});
            expect(tooltip.$container.is('body')).to.be.true;
        });

        it("should eq parent in fullScreen", function () {
            $container.addClass("full-screen");
            $container.append('<div class="tooltip-container"></div>');

            tooltip = new Tooltip({el : '.tooltip-container'});
            expect(tooltip.$container.is($container)).to.be.true;
        });
    });

});