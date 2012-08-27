describe('[TableCanvas] TableDataSource', function () {
    it('should initialize with array', function () {

        var data = [];
        data[0] = [0, 1, 2];
        data[1] = [3, 4, 5];

        var ds = new STAT4YOU.Table.DataSource(data);
        expect(ds.columns()).toEqual(3);
        expect(ds.rows()).toEqual(2);

        expect(ds.cellAtIndex(new STAT4YOU.Table.Cell(0, 0))).toEqual(0);
        expect(ds.cellAtIndex(new STAT4YOU.Table.Cell(1, 0))).toEqual(1);
        expect(ds.cellAtIndex(new STAT4YOU.Table.Cell(0, 1))).toEqual(3);
        expect(ds.cellAtIndex(new STAT4YOU.Table.Cell(2, 1))).toEqual(5);
    });

    it('should initialize with rows and cols', function () {
        var ds = STAT4YOU.Table.DataSource.factory(5, 6);
        expect(ds.rows()).toEqual(5);
        expect(ds.columns()).toEqual(6);

        expect(ds.cellAtIndex(new STAT4YOU.Table.Cell(0, 0))).toEqual(0);
        expect(ds.cellAtIndex(new STAT4YOU.Table.Cell(5, 4))).toEqual(29);
    });

    it('should return undefined', function () {
        var ds = STAT4YOU.Table.DataSource.factory(2, 2);

        expect(ds.cellAtIndex(new STAT4YOU.Table.Cell(100, 100))).toEqual(undefined);
        expect(ds.cellAtIndex(new STAT4YOU.Table.Cell(-100, -100))).toEqual(undefined);
    });
});
