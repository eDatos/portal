describe("[TableCanvas] Bottom scroll Zone", function () {

    var Size = STAT4YOU.Table.Size,
        Point = STAT4YOU.Table.Point,
        Rectangle = STAT4YOU.Table.Rectangle,
        BottomScrollZone = STAT4YOU.Table.BottomScrollZone;

    it("should calculate the scroll position" , function () {
        var bodyZone = {
            size : new Size(600, 200),
            origin : new Point(0, 0)
        };

        var zone = new BottomScrollZone({bodyZone : bodyZone});
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(200, 0));

        spyOn(zone, 'getScrollSize').andReturn(10);

        expect(zone.getScrollPosition()).toEqual(0);

        bodyZone.origin.x = 300;
        expect(zone.getScrollPosition()).toEqual(142);

        bodyZone.origin.x = 400;
        expect(zone.getScrollPosition()).toEqual(190);
    });

    it("should calculate the scroll size", function () {
        var bodyZone = {
            size : new Size(800, 800),
            origin : new Point(0, 0)
        };

        var zone = new BottomScrollZone({bodyZone : bodyZone});

        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(400, 0));

        expect(zone.getScrollSize()).toEqual(200);

        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(200, 0));
        expect(zone.getScrollSize()).toEqual(50);

        // Max size = body size
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(10000, 0));
        expect(zone.getScrollSize()).toEqual(10000);
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

        expect(zone.getScrollSize()).toEqual(minSize);
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
        expect(paintInfo.begin).toEqual(new Point(expectedX, 0.5));
        expect(paintInfo.end).toEqual(new Point(expectedX + 200 - halfRound * 2, 0.5));

        bodyZone.origin.x = 400;
        paintInfo = zone.paintInfo();
        expectedX = 200 + halfRound;
        expect(paintInfo.begin).toEqual(new Point(expectedX, 0.5));
        expect(paintInfo.end).toEqual(new Point(expectedX + 200 -  halfRound * 2, 0.5));
    });

    it("should be visible only if with not equal viewPort.width", function () {
        var bodyZone = {
            size : new Size(800, 800),
            origin : new Point(0, 0)
        };
        var zone = new BottomScrollZone({bodyZone : bodyZone});
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(400, 0));

        expect(zone.isVisible()).toBeTruthy();
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(800, 0));
        expect(zone.isVisible()).toBeFalsy();

    });
});
