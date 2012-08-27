describe("[TableCanvas] BodyZone", function () {
    var Zone = STAT4YOU.Table.BodyZone,
        Point = STAT4YOU.Table.Point,
        Size = STAT4YOU.Table.Size,
        Cell = STAT4YOU.Table.Cell,
        Rectangle = STAT4YOU.Table.Rectangle,
        Delegate = STAT4YOU.Table.Delegate;

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
        var dataSource = STAT4YOU.Table.DataSource.factory(5, 10);
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

        expect(zone.incrementalCellSize).toBeDefined();
        expect(zone.incrementalCellSize.rows).toBeDefined();
        expect(zone.incrementalCellSize.columns).toBeDefined();
        expect(zone.size).toBeDefined();

        expect(zone.incrementalCellSize.rows.length).toEqual(6);
        expect(zone.incrementalCellSize.columns.length).toEqual(11);

        expect(zone.incrementalCellSize.rows[0]).toEqual(0);
        expect(zone.incrementalCellSize.rows[1]).toEqual(30);
        expect(zone.incrementalCellSize.rows[4]).toEqual(120);

        expect(zone.incrementalCellSize.columns[0]).toEqual(0);
        expect(zone.incrementalCellSize.columns[1]).toEqual(60);
        expect(zone.incrementalCellSize.columns[9]).toEqual(540);

        expect(zone.size).toEqual(new Size(600, 150));
    });

    it("should calculate first cell", function () {
        var dataSource = STAT4YOU.Table.DataSource.factory(5, 10);

        var zone = new Zone({
            delegate : staticDelegate,
            dataSource : dataSource
        });

        expect(zone.firstCell()).toEqual(new Cell(0, 0));

        zone.setOrigin(new Point(60, 0));
        expect(zone.firstCell()).toEqual(new Cell(1, 0));

        zone.setOrigin(new Point(60, 30));
        expect(zone.firstCell()).toEqual(new Cell(1, 1));

        zone.setOrigin(new Point(150, 95));
        expect(zone.firstCell()).toEqual(new Cell(2, 3));
    });

    it("should calculate first cell with dynamic size", function () {
        var dataSource = STAT4YOU.Table.DataSource.factory(5, 10);

        var zone = new Zone({
            delegate : dynamicDelegate,
            dataSource : dataSource
        });

        expect(zone.firstCell()).toEqual(new Cell(0, 0));

        zone.setOrigin(new Point(60, 0));
        expect(zone.firstCell()).toEqual(new Cell(1, 0));

        zone.setOrigin(new Point(120, 0));
        expect(zone.firstCell()).toEqual(new Cell(1, 0));

        zone.setOrigin(new Point(130, 0));
        expect(zone.firstCell()).toEqual(new Cell(2, 0));

        zone.setOrigin(new Point(209, 0));
        expect(zone.firstCell()).toEqual(new Cell(2, 0));

        zone.setOrigin(new Point(210, 0));
        expect(zone.firstCell()).toEqual(new Cell(3, 0));

        zone.setOrigin(new Point(120, 30));
        expect(zone.firstCell()).toEqual(new Cell(1, 1));

        zone.setOrigin(new Point(120, 60));
        expect(zone.firstCell()).toEqual(new Cell(1, 1));

        zone.setOrigin(new Point(120, 70));
        expect(zone.firstCell()).toEqual(new Cell(1, 2));

        zone.setOrigin(new Point(120, 120));
        expect(zone.firstCell()).toEqual(new Cell(1, 3));
    });

    it("repaint from origin", function () {
        var context = new ContextStub();

        var dataSource = STAT4YOU.Table.DataSource.factory(10, 10);
        var cellAtIndexSpy = spyOn(dataSource, 'cellAtIndex');

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
        expect(cellAtIndexSpy.argsForCall[0][0]).toEqual(new Cell(0, 0));
        expect(cellAtIndexSpy.argsForCall[1][0]).toEqual(new Cell(0, 1));
        expect(cellAtIndexSpy.argsForCall[2][0]).toEqual(new Cell(0, 2));
        expect(cellAtIndexSpy.argsForCall[3][0]).toEqual(new Cell(0, 3));
        expect(cellAtIndexSpy.argsForCall[4][0]).toEqual(new Cell(1, 0));
        expect(cellAtIndexSpy.argsForCall[5][0]).toEqual(new Cell(1, 1));
        expect(cellAtIndexSpy.argsForCall[6][0]).toEqual(new Cell(1, 2));
        expect(cellAtIndexSpy.argsForCall[7][0]).toEqual(new Cell(1, 3));

        zone.setOrigin(new Point(60, 30));
        zone.repaint();
        expect(cellAtIndexSpy.argsForCall[8][0]).toEqual(new Cell(1, 1));
        expect(cellAtIndexSpy.argsForCall[9][0]).toEqual(new Cell(1, 2));
        expect(cellAtIndexSpy.argsForCall[10][0]).toEqual(new Cell(1, 3));
        expect(cellAtIndexSpy.argsForCall[11][0]).toEqual(new Cell(1, 4));
        expect(cellAtIndexSpy.argsForCall[12][0]).toEqual(new Cell(2, 1));
        expect(cellAtIndexSpy.argsForCall[13][0]).toEqual(new Cell(2, 2));
        expect(cellAtIndexSpy.argsForCall[14][0]).toEqual(new Cell(2, 3));
        expect(cellAtIndexSpy.argsForCall[15][0]).toEqual(new Cell(2, 4));

    });

    it("should not need repaint after repaint", function () {
        var context = new ContextStub();

        var dataSource = STAT4YOU.Table.DataSource.factory(10, 10);
        var cellAtIndexSpy = spyOn(dataSource, 'cellAtIndex');

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
        expect(zone.needRepaint).toBeFalsy();
    });

    it("should convert a relative point to a cell", function () {
        var dataSource = STAT4YOU.Table.DataSource.factory(5, 10);

        var zone = new Zone({
            delegate : staticDelegate,
            dataSource : dataSource
        });

        expect(zone.relativePoint2Cell(new Point(0, 0))).toEqual(new Cell(0, 0));
        expect(zone.relativePoint2Cell(new Point(60, 0))).toEqual(new Cell(1, 0));
        expect(zone.relativePoint2Cell(new Point(60, 30))).toEqual(new Cell(1, 1));

        zone.setOrigin(new Point(60, 30));
        expect(zone.relativePoint2Cell(new Point(0, 0))).toEqual(new Cell(1, 1));

        zone.setViewPort(new Rectangle(10, 10, 300, 300));
        zone.setOrigin(new Point(0, 0));
        expect(zone.relativePoint2Cell(new Point(10, 10))).toEqual(new Cell(0, 0));


    });
});
