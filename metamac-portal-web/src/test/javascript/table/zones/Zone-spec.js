describe("[TableCanvas] Zone", function () {
    var Point = STAT4YOU.Table.Point,
        Size = STAT4YOU.Table.Size,
        Rectangle = STAT4YOU.Table.Rectangle;

    var Zones = ['Zone', 'RightScrollZone', 'BottomScrollZone'];

    _.each(Zones, function (Zone) {
        var ZoneClass = STAT4YOU.Table[Zone];
        describe(Zone, function () {
            it(Zone + "should initialize with empty size, viewPort", function () {
                var zone = new ZoneClass();
                expect(zone.viewPort.width).toEqual(0);
                expect(zone.viewPort.height).toEqual(0);
                expect(zone.viewPort.x).toEqual(0);
                expect(zone.viewPort.y).toEqual(0);
                expect(zone.size.width).toEqual(0);
                expect(zone.size.height).toEqual(0);
            });

            it("should need repaint when set viewPort", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(100, 100), new Size(300, 300)));
                expect(zone.needRepaint).toBeTruthy();
            });

            it("should need repaint when set origin", function () {
                var zone = new ZoneClass();
                zone.setOrigin(new Point(300, 300));
                expect(zone.needRepaint).toBeTruthy();
            });

            it("should limit the move to a visible viewPort", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                zone.setSize(new Size(600, 600));

                zone.move(new Point(-300, -300));
                expect(zone.origin.x).toEqual(300);
                expect(zone.origin.y).toEqual(300);

                zone.move(new Point(300, 300));
                expect(zone.origin.x).toEqual(0);
                expect(zone.origin.y).toEqual(0);

                //limit
                zone.move(new Point(-600, -600));
                expect(zone.origin.x).toEqual(300);
                expect(zone.origin.y).toEqual(300);
            });

            it("should convert an absolute point to a relative point", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                zone.setSize(new Size(600, 600));

                expect(zone.absolutePoint2RelativePoint(new Point(0, 0))).toEqual(new Point(0, 0));
                expect(zone.absolutePoint2RelativePoint(new Point(150, 150))).toEqual(new Point(150, 150));

                zone.setOrigin(new Point(50, 50));
                expect(zone.absolutePoint2RelativePoint(new Point(0, 0))).toEqual(new Point(-50, -50));
                expect(zone.absolutePoint2RelativePoint(new Point(150, 150))).toEqual(new Point(100, 100));


                zone.setViewPort(new Rectangle(new Point(60, 60), new Size(300, 300)));
                expect(zone.absolutePoint2RelativePoint(new Point(0, 0))).toEqual(new Point(10, 10));
                expect(zone.absolutePoint2RelativePoint(new Point(150, 150))).toEqual(new Point(160, 160));
            });

            it("should convert a relative point to and absolute point", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                zone.setSize(new Size(600, 600));

                expect(zone.relativePoint2AbsolutePoint(new Point(0, 0))).toEqual(new Point(0, 0));
                expect(zone.relativePoint2AbsolutePoint(new Point(30, 30))).toEqual(new Point(30, 30));

                zone.setOrigin(new Point(-50, -50));
                expect(zone.relativePoint2AbsolutePoint(new Point(0, 0))).toEqual(new Point(-50, -50));
                expect(zone.relativePoint2AbsolutePoint(new Point(30, 30))).toEqual(new Point(-20, -20));


                zone.setViewPort(new Rectangle(new Point(30, 30), new Size(300, 300)));
                zone.setOrigin(new Point(0, 0));

                expect(zone.relativePoint2AbsolutePoint(new Point(30, 30))).toEqual(new Point(0, 0));
                expect(zone.relativePoint2AbsolutePoint(new Point(60, 60))).toEqual(new Point(30, 30));

                zone.setOrigin(new Point(-50, -50));

                expect(zone.relativePoint2AbsolutePoint(new Point(30, 30))).toEqual(new Point(-50, -50));
                expect(zone.relativePoint2AbsolutePoint(new Point(60, 60))).toEqual(new Point(-20, -20));
            });

            it("should know if a relative point is visible", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                zone.setSize(new Size(600, 600));

                expect(zone.isRelativePointVisible(new Point(0, 0))).toBeTruthy();
                expect(zone.isRelativePointVisible(new Point(0, 10))).toBeTruthy();
                expect(zone.isRelativePointVisible(new Point(100, 0))).toBeTruthy();
                expect(zone.isRelativePointVisible(new Point(199, 0))).toBeTruthy();
                expect(zone.isRelativePointVisible(new Point(100, 100))).toBeTruthy();
                expect(zone.isRelativePointVisible(new Point(100, 299))).toBeTruthy();

                expect(zone.isRelativePointVisible(new Point(0, 300))).toBeFalsy();
                expect(zone.isRelativePointVisible(new Point(200, 300))).toBeFalsy();
                expect(zone.isRelativePointVisible(new Point(200, 301))).toBeFalsy();
                expect(zone.isRelativePointVisible(new Point(-1, 100))).toBeFalsy();
                expect(zone.isRelativePointVisible(new Point(2, -100))).toBeFalsy();
            });

            it("should know if a relative point is visible", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                zone.setSize(new Size(600, 600));

                expect(zone.isRelativePointVisible(new Point(0, 0))).toBeTruthy();
                expect(zone.isRelativePointVisible(new Point(0, 10))).toBeTruthy();
                expect(zone.isRelativePointVisible(new Point(100, 0))).toBeTruthy();
                expect(zone.isRelativePointVisible(new Point(199, 0))).toBeTruthy();
                expect(zone.isRelativePointVisible(new Point(100, 100))).toBeTruthy();
                expect(zone.isRelativePointVisible(new Point(100, 299))).toBeTruthy();

                expect(zone.isRelativePointVisible(new Point(0, 300))).toBeFalsy();
                expect(zone.isRelativePointVisible(new Point(200, 300))).toBeFalsy();
                expect(zone.isRelativePointVisible(new Point(200, 301))).toBeFalsy();
                expect(zone.isRelativePointVisible(new Point(-1, 100))).toBeFalsy();
                expect(zone.isRelativePointVisible(new Point(2, -100))).toBeFalsy();

                zone.setViewPort(new Rectangle(new Point(100, 100), new Size(300, 300)));
                expect(zone.isRelativePointVisible(new Point(99, 99))).toBeFalsy();
                expect(zone.isRelativePointVisible(new Point(399, 399))).toBeTruthy();
            });

            it("should clear the viewPort", function () {
                var clearRectSpy = jasmine.createSpy();
                var fakeCtx = {
                    clearRect : clearRectSpy
                };

                var zone = new ZoneClass({context : fakeCtx});
                zone.setViewPort(new Rectangle(new Point(30, 40), new Size(100, 200)));
                zone.clear();
                expect(clearRectSpy).toHaveBeenCalledWith(30, 40, 100, 200);
            });

            it("should calculate if a relative rectangle is visible", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));

                var rectangle = new Rectangle(0, 0, 100, 100);
                expect(zone.isRelativeRectangleVisible(rectangle)).toBeTruthy();

                rectangle.x = -100;
                expect(zone.isRelativeRectangleVisible(rectangle)).toBeTruthy();

                rectangle.x = -101;
                expect(zone.isRelativeRectangleVisible(rectangle)).toBeFalsy();

                rectangle.x = 0;
                rectangle.y = -100;
                expect(zone.isRelativeRectangleVisible(rectangle)).toBeTruthy();

                rectangle.y = -101;
                expect(zone.isRelativeRectangleVisible(rectangle)).toBeFalsy();
            });

        });
    });





});
