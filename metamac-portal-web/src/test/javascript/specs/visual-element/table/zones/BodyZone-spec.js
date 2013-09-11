describe("[TableCanvas] BodyZone", function () {
    var Zone = App.Table.BodyZone,
        Point = App.Table.Point,
        Size = App.Table.Size,
        Cell = App.Table.Cell,
        Rectangle = App.Table.Rectangle,
        Delegate = App.Table.Delegate;

    var staticDelegate = new Delegate();

    staticDelegate.rowHeight = function() {
        return 30;
    };

    staticDelegate.columnWidth = function () {
        return 60;
    };

    var dynamicDelegate = new Delegate();

    dynamicDelegate.rowHeight = function (row) {
        return 30 + row * 10;
    };

    dynamicDelegate.columnWidth = function (column) {
        return 60 + column * 10;
    };

    it("should calculate the incrementalCellSize", function () {
        var dataSource = App.Table.DataSource.factory(5, 10);
        var delegate = {
            rowHeight : function () {
                return 30;
            },

            columnWidth : function () {
                return 60;
            }
        };

        var zone = new Zone({
            delegate : delegate,
            dataSource : dataSource
        });

        expect(zone.incrementalCellSize).to.be.defined;
        expect(zone.incrementalCellSize.rows).to.be.defined;
        expect(zone.incrementalCellSize.columns).to.be.defined;
        expect(zone.size).to.be.defined;

        expect(zone.incrementalCellSize.rows.length).to.eql(6);
        expect(zone.incrementalCellSize.columns.length).to.eql(11);

        expect(zone.incrementalCellSize.rows[0]).to.eql(0);
        expect(zone.incrementalCellSize.rows[1]).to.eql(30);
        expect(zone.incrementalCellSize.rows[4]).to.eql(120);

        expect(zone.incrementalCellSize.columns[0]).to.eql(0);
        expect(zone.incrementalCellSize.columns[1]).to.eql(60);
        expect(zone.incrementalCellSize.columns[9]).to.eql(540);

        expect(zone.size).to.eql(new Size(600, 150));
    });

    it("should calculate first cell", function () {
        var dataSource = App.Table.DataSource.factory(5, 10);

        var zone = new Zone({
            delegate : staticDelegate,
            dataSource : dataSource
        });

        expect(zone.firstCell()).to.eql(new Cell(0, 0));

        zone.setOrigin(new Point(60, 0));
        expect(zone.firstCell()).to.eql(new Cell(1, 0));

        zone.setOrigin(new Point(60, 30));
        expect(zone.firstCell()).to.eql(new Cell(1, 1));

        zone.setOrigin(new Point(150, 95));
        expect(zone.firstCell()).to.eql(new Cell(2, 3));
    });

    it("should calculate first cell with dynamic size", function () {
        var dataSource = App.Table.DataSource.factory(5, 10);

        var zone = new Zone({
            delegate : dynamicDelegate,
            dataSource : dataSource
        });

        expect(zone.firstCell()).to.eql(new Cell(0, 0));

        zone.setOrigin(new Point(60, 0));
        expect(zone.firstCell()).to.eql(new Cell(1, 0));

        zone.setOrigin(new Point(120, 0));
        expect(zone.firstCell()).to.eql(new Cell(1, 0));

        zone.setOrigin(new Point(130, 0));
        expect(zone.firstCell()).to.eql(new Cell(2, 0));

        zone.setOrigin(new Point(209, 0));
        expect(zone.firstCell()).to.eql(new Cell(2, 0));

        zone.setOrigin(new Point(210, 0));
        expect(zone.firstCell()).to.eql(new Cell(3, 0));

        zone.setOrigin(new Point(120, 30));
        expect(zone.firstCell()).to.eql(new Cell(1, 1));

        zone.setOrigin(new Point(120, 60));
        expect(zone.firstCell()).to.eql(new Cell(1, 1));

        zone.setOrigin(new Point(120, 70));
        expect(zone.firstCell()).to.eql(new Cell(1, 2));

        zone.setOrigin(new Point(120, 120));
        expect(zone.firstCell()).to.eql(new Cell(1, 3));
    });

    it("repaint from origin", function () {
        var context = new ContextStub();

        var dataSource = App.Table.DataSource.factory(10, 10);
        var cellAtIndexSpy = sinon.spy(dataSource, 'cellAtIndex');

        var zone = new Zone({
            delegate : staticDelegate,
            dataSource : dataSource,
            context : context,
            view : {
                isSelectionActive : function () {
                    return false;
                }
            }
        });
        zone.setViewPort(new Rectangle(new Point(0, 0), new Size(100, 100)));
        zone.repaint();
        expect(cellAtIndexSpy.getCall(0).args[0]).to.eql(new Cell(0, 0));
        expect(cellAtIndexSpy.getCall(1).args[0]).to.eql(new Cell(0, 1));
        expect(cellAtIndexSpy.getCall(2).args[0]).to.eql(new Cell(0, 2));
        expect(cellAtIndexSpy.getCall(3).args[0]).to.eql(new Cell(0, 3));
        expect(cellAtIndexSpy.getCall(4).args[0]).to.eql(new Cell(1, 0));
        expect(cellAtIndexSpy.getCall(5).args[0]).to.eql(new Cell(1, 1));
        expect(cellAtIndexSpy.getCall(6).args[0]).to.eql(new Cell(1, 2));
        expect(cellAtIndexSpy.getCall(7).args[0]).to.eql(new Cell(1, 3));

        zone.setOrigin(new Point(60, 30));
        zone.repaint();
        expect(cellAtIndexSpy.getCall(8).args[0]).to.eql(new Cell(1, 1));
        expect(cellAtIndexSpy.getCall(9).args[0]).to.eql(new Cell(1, 2));
        expect(cellAtIndexSpy.getCall(10).args[0]).to.eql(new Cell(1, 3));
        expect(cellAtIndexSpy.getCall(11).args[0]).to.eql(new Cell(1, 4));
        expect(cellAtIndexSpy.getCall(12).args[0]).to.eql(new Cell(2, 1));
        expect(cellAtIndexSpy.getCall(13).args[0]).to.eql(new Cell(2, 2));
        expect(cellAtIndexSpy.getCall(14).args[0]).to.eql(new Cell(2, 3));
        expect(cellAtIndexSpy.getCall(15).args[0]).to.eql(new Cell(2, 4));

    });

    it("should not need repaint after repaint", function () {
        var context = new ContextStub();

        var dataSource = App.Table.DataSource.factory(10, 10);

        var zone = new Zone({
            delegate : staticDelegate,
            dataSource : dataSource,
            context : context,
            view : {
                isSelectionActive : function () {
                    return false;
                }
            }
        });
        zone.setViewPort(new Rectangle(new Point(0, 0), new Size(100, 100)));

        zone.needRepaint = true;
        zone.repaint();
        expect(zone.needRepaint).to.be.false;
    });

    it("should convert a relative point to a cell", function () {
        var dataSource = App.Table.DataSource.factory(5, 10);

        var zone = new Zone({
            delegate : staticDelegate,
            dataSource : dataSource
        });

        expect(zone.relativePoint2Cell(new Point(0, 0))).to.eql(new Cell(0, 0));
        expect(zone.relativePoint2Cell(new Point(60, 0))).to.eql(new Cell(1, 0));
        expect(zone.relativePoint2Cell(new Point(60, 30))).to.eql(new Cell(1, 1));

        zone.setOrigin(new Point(60, 30));
        expect(zone.relativePoint2Cell(new Point(0, 0))).to.eql(new Cell(1, 1));

        zone.setViewPort(new Rectangle(10, 10, 300, 300));
        zone.setOrigin(new Point(0, 0));
        expect(zone.relativePoint2Cell(new Point(10, 10))).to.eql(new Cell(0, 0));


    });
});
