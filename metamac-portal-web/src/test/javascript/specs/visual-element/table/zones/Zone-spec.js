describe("[TableCanvas] Zone", function () {
    var Point = App.Table.Point,
        Size = App.Table.Size,
        Rectangle = App.Table.Rectangle;

    var Zones = ['Zone', 'RightScrollZone', 'BottomScrollZone'];

    _.each(Zones, function (Zone) {
        var ZoneClass = App.Table[Zone];
        describe(Zone, function () {
            it(Zone + "should initialize with empty size, viewPort", function () {
                var zone = new ZoneClass();
                expect(zone.viewPort.width).to.eql(0);
                expect(zone.viewPort.height).to.eql(0);
                expect(zone.viewPort.x).to.eql(0);
                expect(zone.viewPort.y).to.eql(0);
                expect(zone.size.width).to.eql(0);
                expect(zone.size.height).to.eql(0);
            });

            it("should need repaint when set viewPort", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(100, 100), new Size(300, 300)));
                expect(zone.needRepaint).to.be.true;
            });

            it("should need repaint when set origin", function () {
                var zone = new ZoneClass();
                zone.setOrigin(new Point(300, 300));
                expect(zone.needRepaint).to.be.true;
            });

            it("should limit the move to a visible viewPort", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                zone.setSize(new Size(600, 600));

                zone.move(new Point(-300, -300));
                expect(zone.origin.x).to.eql(300);
                expect(zone.origin.y).to.eql(300);

                zone.move(new Point(300, 300));
                expect(zone.origin.x).to.eql(0);
                expect(zone.origin.y).to.eql(0);

                //limit
                zone.move(new Point(-600, -600));
                expect(zone.origin.x).to.eql(300);
                expect(zone.origin.y).to.eql(300);
            });

            it("should convert an absolute point to a relative point", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                zone.setSize(new Size(600, 600));

                expect(zone.absolutePoint2RelativePoint(new Point(0, 0))).to.eql(new Point(0, 0));
                expect(zone.absolutePoint2RelativePoint(new Point(150, 150))).to.eql(new Point(150, 150));

                zone.setOrigin(new Point(50, 50));
                expect(zone.absolutePoint2RelativePoint(new Point(0, 0))).to.eql(new Point(-50, -50));
                expect(zone.absolutePoint2RelativePoint(new Point(150, 150))).to.eql(new Point(100, 100));


                zone.setViewPort(new Rectangle(new Point(60, 60), new Size(300, 300)));
                expect(zone.absolutePoint2RelativePoint(new Point(0, 0))).to.eql(new Point(10, 10));
                expect(zone.absolutePoint2RelativePoint(new Point(150, 150))).to.eql(new Point(160, 160));
            });

            it("should convert a relative point to and absolute point", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                zone.setSize(new Size(600, 600));

                expect(zone.relativePoint2AbsolutePoint(new Point(0, 0))).to.eql(new Point(0, 0));
                expect(zone.relativePoint2AbsolutePoint(new Point(30, 30))).to.eql(new Point(30, 30));

                zone.setOrigin(new Point(-50, -50));
                expect(zone.relativePoint2AbsolutePoint(new Point(0, 0))).to.eql(new Point(-50, -50));
                expect(zone.relativePoint2AbsolutePoint(new Point(30, 30))).to.eql(new Point(-20, -20));


                zone.setViewPort(new Rectangle(new Point(30, 30), new Size(300, 300)));
                zone.setOrigin(new Point(0, 0));

                expect(zone.relativePoint2AbsolutePoint(new Point(30, 30))).to.eql(new Point(0, 0));
                expect(zone.relativePoint2AbsolutePoint(new Point(60, 60))).to.eql(new Point(30, 30));

                zone.setOrigin(new Point(-50, -50));

                expect(zone.relativePoint2AbsolutePoint(new Point(30, 30))).to.eql(new Point(-50, -50));
                expect(zone.relativePoint2AbsolutePoint(new Point(60, 60))).to.eql(new Point(-20, -20));
            });

            it("should know if a relative point is visible", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                zone.setSize(new Size(600, 600));

                expect(zone.isRelativePointVisible(new Point(0, 0))).to.be.true;
                expect(zone.isRelativePointVisible(new Point(0, 10))).to.be.true;
                expect(zone.isRelativePointVisible(new Point(100, 0))).to.be.true;
                expect(zone.isRelativePointVisible(new Point(199, 0))).to.be.true;
                expect(zone.isRelativePointVisible(new Point(100, 100))).to.be.true;
                expect(zone.isRelativePointVisible(new Point(100, 299))).to.be.true;

                expect(zone.isRelativePointVisible(new Point(0, 300))).to.be.false;
                expect(zone.isRelativePointVisible(new Point(200, 300))).to.be.false;
                expect(zone.isRelativePointVisible(new Point(200, 301))).to.be.false;
                expect(zone.isRelativePointVisible(new Point(-1, 100))).to.be.false;
                expect(zone.isRelativePointVisible(new Point(2, -100))).to.be.false;
            });

            it("should know if a relative point is visible", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                zone.setSize(new Size(600, 600));

                expect(zone.isRelativePointVisible(new Point(0, 0))).to.be.true;
                expect(zone.isRelativePointVisible(new Point(0, 10))).to.be.true;
                expect(zone.isRelativePointVisible(new Point(100, 0))).to.be.true;
                expect(zone.isRelativePointVisible(new Point(199, 0))).to.be.true;
                expect(zone.isRelativePointVisible(new Point(100, 100))).to.be.true;
                expect(zone.isRelativePointVisible(new Point(100, 299))).to.be.true;

                expect(zone.isRelativePointVisible(new Point(0, 300))).to.be.false;
                expect(zone.isRelativePointVisible(new Point(200, 300))).to.be.false;
                expect(zone.isRelativePointVisible(new Point(200, 301))).to.be.false;
                expect(zone.isRelativePointVisible(new Point(-1, 100))).to.be.false;
                expect(zone.isRelativePointVisible(new Point(2, -100))).to.be.false;

                zone.setViewPort(new Rectangle(new Point(100, 100), new Size(300, 300)));
                expect(zone.isRelativePointVisible(new Point(99, 99))).to.be.false;
                expect(zone.isRelativePointVisible(new Point(399, 399))).to.be.true;
            });

            it("should clear the viewPort", function () {
                var clearRectSpy = sinon.spy();
                var fakeCtx = {
                    clearRect : clearRectSpy
                };

                var zone = new ZoneClass({context : fakeCtx});
                zone.setViewPort(new Rectangle(new Point(30, 40), new Size(100, 200)));
                zone.clear();
                expect(clearRectSpy.calledWith(30, 40, 100, 200)).to.be.true;
            });

            it("should calculate if a relative rectangle is visible", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));

                var rectangle = new Rectangle(0, 0, 100, 100);
                expect(zone.isRelativeRectangleVisible(rectangle)).to.be.true;

                rectangle.x = -100;
                expect(zone.isRelativeRectangleVisible(rectangle)).to.be.true;

                rectangle.x = -101;
                expect(zone.isRelativeRectangleVisible(rectangle)).to.be.false;

                rectangle.x = 0;
                rectangle.y = -100;
                expect(zone.isRelativeRectangleVisible(rectangle)).to.be.true;

                rectangle.y = -101;
                expect(zone.isRelativeRectangleVisible(rectangle)).to.be.false;
            });

            it("should calculate if a relative rectangle is visible when rectangle is bigger than the zone", function () {
                var zone = new ZoneClass();
                zone.setViewPort(new Rectangle(new Point(0, 0), new Size(300, 300)));
                var rectangle = new Rectangle(-100, -100, 500, 500);
                expect(zone.isRelativeRectangleVisible(rectangle)).to.be.true;
            });

        });
    });





});
