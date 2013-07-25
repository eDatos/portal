describe("[TableCanvas] Bottom scroll Zone", function () {

    var Size = App.Table.Size,
        Point = App.Table.Point,
        Rectangle = App.Table.Rectangle,
        BottomScrollZone = App.Table.BottomScrollZone;

    it("should calculate the scroll position", function () {
        var bodyZone = {
            size : new Size(600, 200),
            origin : new Point(0, 0)
        };

        var zone = new BottomScrollZone({bodyZone : bodyZone});
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(200, 0));

        sinon.stub(zone, 'getScrollSize').returns(10);

        expect(zone.getScrollPosition()).to.eql(0);

        bodyZone.origin.x = 300;
        expect(zone.getScrollPosition()).to.eql(142);

        bodyZone.origin.x = 400;
        expect(zone.getScrollPosition()).to.eql(190);
    });

    it("should calculate the scroll size", function () {
        var bodyZone = {
            size : new Size(800, 800),
            origin : new Point(0, 0)
        };

        var zone = new BottomScrollZone({bodyZone : bodyZone});

        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(400, 0));

        expect(zone.getScrollSize()).to.eql(200);

        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(200, 0));
        expect(zone.getScrollSize()).to.eql(50);

        // Max size = body size
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(10000, 0));
        expect(zone.getScrollSize()).to.eql(10000);
    });

    it("scroll size must have a minimum value", function () {
        var bodyZone = {
            size : new Size(10000, 0),
            origin : new Point(0, 0)
        };

        var minSize = 50;
        var delegate = {
            style : {
                scroll : {
                    minSize : minSize
                }
            }
        };

        var zone = new BottomScrollZone({bodyZone : bodyZone, delegate : delegate});
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(200, 0));

        expect(zone.getScrollSize()).to.eql(minSize);
    });

    it("should calculate paint info", function () {
        var bodyZone = {
            size : new Size(800, 800),
            origin : new Point(0, 0)
        };
        var zone = new BottomScrollZone({bodyZone : bodyZone});
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(400, 0));

        var paintInfo;

        var halfRound = Math.ceil(zone.lineWidth / 2);

        paintInfo = zone.paintInfo();

        var expectedX = halfRound;
        expect(paintInfo.begin).to.eql(new Point(expectedX, 0.5));
        expect(paintInfo.end).to.eql(new Point(expectedX + 200 - halfRound * 2, 0.5));

        bodyZone.origin.x = 400;
        paintInfo = zone.paintInfo();
        expectedX = 200 + halfRound;
        expect(paintInfo.begin).to.eql(new Point(expectedX, 0.5));
        expect(paintInfo.end).to.eql(new Point(expectedX + 200 -  halfRound * 2, 0.5));
    });

    it("should be visible only if with not equal viewPort.width", function () {
        var bodyZone = {
            size : new Size(800, 800),
            origin : new Point(0, 0)
        };
        var zone = new BottomScrollZone({bodyZone : bodyZone});
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(400, 0));

        expect(zone.isVisible()).to.be.true;
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(800, 0));
        expect(zone.isVisible()).to.be.false;

    });
});
