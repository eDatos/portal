describe("[TableCanvas] Right scroll Zone", function () {

    var Size = STAT4YOU.Table.Size,
        Point = STAT4YOU.Table.Point,
        Rectangle = STAT4YOU.Table.Rectangle,
        RightScrollZone = STAT4YOU.Table.RightScrollZone;

    it("should calculate the scroll position" , function () {
        var bodyZone = {
            size : new Size(200, 600),
            origin : new Point(0, 0)
        };

        var zone = new RightScrollZone({bodyZone : bodyZone});
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(0, 200));

        spyOn(zone, 'getScrollSize').andReturn(10);

        expect(zone.getScrollPosition()).toEqual(0);

        bodyZone.origin.y = 300;
        expect(zone.getScrollPosition()).toEqual(142);

        bodyZone.origin.y = 400;
        expect(zone.getScrollPosition()).toEqual(190);
    });

    it("should calculate the scroll size", function () {
        var bodyZone = {
            size : new Size(800, 800),
            origin : new Point(0, 0)
        };

        var zone = new RightScrollZone({bodyZone : bodyZone});

        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(0, 400));

        expect(zone.getScrollSize()).toEqual(200);

        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(0, 200));
        expect(zone.getScrollSize()).toEqual(50);

        // Max size = body size
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(0, 10000));
        expect(zone.getScrollSize()).toEqual(10000);
    });

    it("scroll size must have a minimum value", function () {
        var bodyZone = {
            size : new Size(0, 10000),
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

        var zone = new RightScrollZone({bodyZone : bodyZone, delegate : delegate});
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(0, 200));

        expect(zone.getScrollSize()).toEqual(minSize);
    });

    it("should calculate paint info", function () {
        var bodyZone = {
            size : new Size(800, 800),
            origin : new Point(0, 0)
        };
        var zone = new RightScrollZone({bodyZone : bodyZone});
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(0, 400));


        var halfRound = Math.ceil(zone.lineWidth / 2);
        var scroll;

        scroll = zone.paintInfo();
        var expectedY = halfRound;
        expect(scroll.begin).toEqual(new Point(0.5, expectedY));
        expect(scroll.end).toEqual(new Point(0.5, expectedY + 200 - 2* halfRound));

        bodyZone.origin.y = 400;
        scroll = zone.paintInfo();
        expectedY = 200 + halfRound;
        expect(scroll.begin).toEqual(new Point(0.5, expectedY));
        expect(scroll.end).toEqual(new Point(0.5, expectedY + 200 - 2 * halfRound));
    });

    it("should be visible only if with not equal viewPort.height", function () {
        var bodyZone = {
            size : new Size(800, 800),
            origin : new Point(0, 0)
        };
        var zone = new RightScrollZone({bodyZone : bodyZone});
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(0, 400));

        expect(zone.isVisible()).toBeTruthy();
        bodyZone.viewPort = zone.viewPort = new Rectangle(new Point(0, 0), new Size(0, 800));
        expect(zone.isVisible()).toBeFalsy();

    });
});
