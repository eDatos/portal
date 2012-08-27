describe("[TableCanvas] LeftHeaderZone", function () {

    var LeftHeaderZone = STAT4YOU.Table.LeftHeaderZone,
        Delegate = STAT4YOU.Table.Delegate,
        DataSource = STAT4YOU.Table.DataSource,
        Rectangle = STAT4YOU.Table.Rectangle,
        Point = STAT4YOU.Table.Point;

    var bodyZone = {
        incrementalCellSize : {
            rows : ['stub']
        },
        size : {
            height : 1200
        },

        paintInfo : function () {
            return {rows : ['paintInfoStub']};
        }
    };

    it("should calculate incrementalSize and Size", function () {
        var dataSource = new DataSource();
        sinon.stub(dataSource, "leftHeaderColumns").returns(3);

        var delegate = new Delegate();
        sinon.stub(delegate, "leftHeaderColumnWidth").returns(100);

        var leftHeaderZone = new LeftHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        expect(leftHeaderZone.incrementalCellSize.rows).toEqual(['stub']);
        expect(leftHeaderZone.incrementalCellSize.columns).toEqual([0, 100, 200, 300]);
        expect(leftHeaderZone.size.width).toEqual(300);
        expect(leftHeaderZone.size.height).toEqual(1200);
    });

    it("should calculate incrementalSize and Size with variable columnWidth", function () {
        var dataSource = new DataSource();

        sinon.stub(dataSource, "leftHeaderColumns").returns(3);

        var delegate = new Delegate();
        var delegateStub = sinon.stub(delegate, "leftHeaderColumnWidth");
        delegateStub.withArgs(0).returns(100);
        delegateStub.withArgs(1).returns(120);
        delegateStub.withArgs(2).returns(150);

        var leftHeaderZone = new LeftHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        expect(leftHeaderZone.incrementalCellSize.rows).toEqual(['stub']);
        expect(leftHeaderZone.incrementalCellSize.columns).toEqual([0, 100, 220, 370]);
        expect(leftHeaderZone.size.width).toEqual(370);
        expect(leftHeaderZone.size.height).toEqual(1200);
    });

    it("should calculate the paintInfo", function () {

        var bodyZone = {
            incrementalCellSize : {
                rows : []
            },
            size : {
                height : 1200
            },
            origin : {
                y : 0
            },
            paintInfo : function () {
                return {
                    rows : [
                        {y : 0, index : 0, height : 60},
                        {y : 60, index : 1, height : 60},
                        {y : 120, index : 2, height : 60},
                        {y : 180, index : 3, height : 60}
                    ]
                };
            }
        };

        for (var i = 0; i < 100; i++) {
            bodyZone.incrementalCellSize.rows[i] = i * 60;
        }

        var dataSource = new DataSource();
        sinon.stub(dataSource, "leftHeaderColumns").returns(3);
        sinon.stub(dataSource, "leftHeaderValues").returns([
            ['a', 'b', 'c', 'd'],
            ['0', '1', '2', '3', '4'],
            ['aa', 'bb', 'cc', 'dd']
        ]);

        var delegate = new Delegate();
        sinon.stub(delegate, "leftHeaderColumnWidth").returns(100);

        var topHeaderZone = new LeftHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        var paintInfo = topHeaderZone.paintInfo();

        expect(paintInfo.length).toEqual(3);
        expect(paintInfo[0]).toEqual([
            {
                index : 0,
                indexEnd : 20,
                height : 1200,
                y : 0,
                x : 0,
                width : 100,
                content : 'a'
            }
        ]);

        expect(paintInfo[1]).toEqual([
            {
                index : 0,
                indexEnd : 4,
                height : 240,
                y : 0,
                x : 100,
                width : 100,
                content : '0'
            }
        ]);

        expect(paintInfo[2][0]).toEqual({
            index : 0,
            indexEnd : 1,
            height : 60,
            y : 0,
            x : 200,
            width : 100,
            content : 'aa'
        });

        expect(paintInfo[2][1]).toEqual({
            index : 1,
            indexEnd : 2,
            height : 60,
            y : 60,
            x : 200,
            width : 100,
            content : 'bb'
        });

        expect(paintInfo[2][2]).toEqual({
            index : 2,
            indexEnd : 3,
            width : 100,
            x : 200,
            y : 120,
            height : 60,
            content : 'cc'
        });

        expect(paintInfo[2][3]).toEqual({
            index : 3,
            indexEnd : 4,
            width : 100,
            x : 200,
            y : 180,
            height : 60,
            content : 'dd'
        });
    });

    it("should calculate the paintInfo not in origin", function () {

        var bodyZone = {
            incrementalCellSize : {
                rows : []
            },
            size : {
                height : 1200
            },
            origin : {
                y : 3030
            },
            paintInfo : function () {
                return {
                    rows : [
                        {y : -30, index : 50, height : 60},
                        {y : 30, index : 51, height : 60},
                        {y : 90, index : 52, height : 60},
                        {y : 150, index : 53, height : 60},
                        {y : 210, index : 54, height : 60}
                    ]
                };
            }
        };

        for (var i = 0; i < 100; i++) {
            bodyZone.incrementalCellSize.rows[i] = i * 60;
        }

        var dataSource = new DataSource();
        sinon.stub(dataSource, "leftHeaderColumns").returns(3);
        sinon.stub(dataSource, "leftHeaderValues").returns([
            ['a', 'b', 'c', 'd'],
            ['0', '1', '2', '3', '4'],
            ['aa', 'bb', 'cc', 'dd']
        ]);

        var delegate = new Delegate();
        sinon.stub(delegate, "leftHeaderColumnWidth").returns(100);

        var topHeaderZone = new LeftHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        topHeaderZone.setViewPort(new Rectangle(0, 100, 240, 300));

        var paintInfo = topHeaderZone.paintInfo();

        expect(paintInfo.length).toEqual(3);

        expect(paintInfo[0]).toEqual([
            {
                index : 40,
                indexEnd : 60,
                width : 100,
                x : 0,
                y : -530,
                height : 1200,
                content : 'c'
            }
        ]);

        expect(paintInfo[1][0]).toEqual({
            index : 48,
            indexEnd : 52,
            width : 100,
            x : 100,
            y : -50,
            height : 240,
            content : '2'
        });

        expect(paintInfo[1][1]).toEqual({
            index : 52,
            indexEnd : 56,
            width : 100,
            x : 100,
            y : 190,
            height : 240,
            content : '3'
        });

        expect(paintInfo[2][0]).toEqual({
            index : 50,
            indexEnd : 51,
            width : 100,
            x : 200,
            y : 70,
            height : 60,
            content : 'cc'
        });

        expect(paintInfo[2][1]).toEqual({
            index : 51,
            indexEnd : 52,
            width : 100,
            x : 200,
            y : 130,
            height : 60,
            content : 'dd'
        });

        expect(paintInfo[2][2]).toEqual({
            index : 52,
            indexEnd : 53,
            width : 100,
            x : 200,
            y : 190,
            height : 60,
            content : 'aa'
        });

        expect(paintInfo[2][3]).toEqual({
            index : 53,
            indexEnd : 54,
            width : 100,
            x : 200,
            y : 250,
            height : 60,
            content : 'bb'
        });

        expect(paintInfo[2][4]).toEqual({
            index : 54,
            indexEnd : 55,
            width : 100,
            x : 200,
            y : 310,
            height : 60,
            content : 'cc'
        });
    });

    it("should return title at position", function () {
        var leftHeaderZone = new LeftHeaderZone({});
        leftHeaderZone.lastPaintInfo = [[
            {
                index : 0,
                height : 1200,
                y : 0,
                x : 0,
                width : 100,
                content : 'a'
            },
            {
                index : 0,
                height : 240,
                y : 0,
                x : 100,
                width : 100,
                content : '0'
            },
            {
                index : 0,
                height : 60,
                y : 0,
                x : 200,
                width : 100,
                content : 'aa'
            }
        ]];

        expect(leftHeaderZone.titleAtPoint(new Point(0, 0))).toEqual('a');
        expect(leftHeaderZone.titleAtPoint(new Point(100, 0))).toEqual('0');
        expect(leftHeaderZone.titleAtPoint(new Point(199, 0))).toEqual('0');
        expect(leftHeaderZone.titleAtPoint(new Point(299, 0))).toEqual('aa');
    });
});
