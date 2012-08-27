describe("[TableCanvas] TopHeaderZone", function () {

    var TopHeaderZone = STAT4YOU.Table.TopHeaderZone,
        Delegate = STAT4YOU.Table.Delegate,
        Point = STAT4YOU.Table.Point,
        DataSource = STAT4YOU.Table.DataSource,
        Rectangle = STAT4YOU.Table.Rectangle;

    var bodyZone = {
        incrementalCellSize : {
            columns : ['stub']
        },
        size : {
            width : 1200
        },

        paintInfo : function () {
            return {columns : ['paintInfoStub']};
        }
    };

    it("should calculate incrementalSize and Size", function () {
        var dataSource = new DataSource();
        sinon.stub(dataSource, "topHeaderRows").returns(3);

        var delegate = new Delegate();
        sinon.stub(delegate, "topHeaderRowHeight").returns(100);

        var topHeaderZone = new TopHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        expect(topHeaderZone.incrementalCellSize.rows).toEqual([0, 100, 200, 300]);
        expect(topHeaderZone.incrementalCellSize.columns).toEqual(['stub']);
        expect(topHeaderZone.size.height).toEqual(300);
        expect(topHeaderZone.size.width).toEqual(1200);
    });

    it("should calculate incrementalSize and Size with variable columnWidth", function () {
        var dataSource = new DataSource();

        sinon.stub(dataSource, "topHeaderRows").returns(3);

        var delegate = new Delegate();
        var delegateStub = sinon.stub(delegate, "topHeaderRowHeight");
        delegateStub.withArgs(0).returns(100);
        delegateStub.withArgs(1).returns(120);
        delegateStub.withArgs(2).returns(150);

        var leftHeaderZone = new TopHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        expect(leftHeaderZone.incrementalCellSize.rows).toEqual([0, 100, 220, 370]);
        expect(leftHeaderZone.incrementalCellSize.columns).toEqual(['stub']);
        expect(leftHeaderZone.size.height).toEqual(370);
        expect(leftHeaderZone.size.width).toEqual(1200);
    });

    it("should calculate the paintInfo", function () {

        var bodyZone = {
            incrementalCellSize : {
                columns : []
            },
            size : {
                width : 1200
            },
            origin : {
                x : 0
            },
            paintInfo : function () {
                return {
                    columns : [
                        {x : 0, index : 0, width : 60},
                        {x : 60, index : 1, width : 60},
                        {x : 120, index : 2, width : 60},
                        {x : 180, index : 3, width : 60}
                    ]
                };
            }
        };

        for (var i = 0; i < 100; i++) {
            bodyZone.incrementalCellSize.columns[i] = i * 60;
        }

        var dataSource = new DataSource();
        sinon.stub(dataSource, "topHeaderRows").returns(3);
        sinon.stub(dataSource, "topHeaderValues").returns([
            ['a', 'b', 'c', 'd'],
            ['0', '1', '2', '3', '4'],
            ['aa', 'bb', 'cc', 'dd']
        ]);

        var delegate = new Delegate();
        sinon.stub(delegate, "topHeaderRowHeight").returns(100);

        var topHeaderZone = new TopHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        var paintInfo = topHeaderZone.paintInfo();

        expect(paintInfo.length).toEqual(3);
        expect(paintInfo[0]).toEqual([
            {
                index : 0,
                indexEnd : 20,
                height : 100,
                y : 0,
                x : 0,
                width : 1200,
                content : 'a'
            }
        ]);

        expect(paintInfo[1]).toEqual([
            {
                index : 0,
                indexEnd : 4,
                height : 100,
                y : 100,
                x : 0,
                width : 240,
                content : '0'
            }
        ]);

        expect(paintInfo[2][0]).toEqual({
            index : 0,
            indexEnd : 1,
            height : 100,
            y : 200,
            x : 0,
            width : 60,
            content : 'aa'
        });

        expect(paintInfo[2][1]).toEqual({
            index : 1,
            indexEnd : 2,
            height : 100,
            y : 200,
            x : 60,
            width : 60,
            content : 'bb'
        });

        expect(paintInfo[2][2]).toEqual({
            index : 2,
            indexEnd : 3,
            height : 100,
            y : 200,
            x : 120,
            width : 60,
            content : 'cc'
        });

        expect(paintInfo[2][3]).toEqual({
            index : 3,
            indexEnd : 4,
            height : 100,
            y : 200,
            x : 180,
            width : 60,
            content : 'dd'
        });
    });

    it("should calculate the paintInfo not in origin", function () {

        var bodyZone = {
            incrementalCellSize : {
                columns : []
            },
            size : {
                width : 1200
            },
            origin : {
                x : 3030
            },
            paintInfo : function () {
                return {
                    columns : [
                        {x : -30, index : 50, width : 60},
                        {x : 30, index : 51, width : 60},
                        {x : 90, index : 52, width : 60},
                        {x : 150, index : 53, width : 60},
                        {x : 210, index : 54, width : 60}
                    ]
                };
            }
        };

        for (var i = 0; i < 100; i++) {
            bodyZone.incrementalCellSize.columns[i] = i * 60;
        }

        var dataSource = new DataSource();
        sinon.stub(dataSource, "topHeaderRows").returns(3);
        sinon.stub(dataSource, "topHeaderValues").returns([
            ['a', 'b', 'c', 'd'],
            ['0', '1', '2', '3', '4'],
            ['aa', 'bb', 'cc', 'dd']
        ]);

        var delegate = new Delegate();
        sinon.stub(delegate, "topHeaderRowHeight").returns(100);

        var topHeaderZone = new TopHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        topHeaderZone.setViewPort(new Rectangle(100, 0, 240, 300));

        var paintInfo = topHeaderZone.paintInfo();

        expect(paintInfo.length).toEqual(3);

        expect(paintInfo[0]).toEqual([
            {
                index : 40,
                indexEnd : 60,
                height : 100,
                y : 0,
                x : -530,
                width : 1200,
                content : 'c'
            }
        ]);

        expect(paintInfo[1][0]).toEqual({
            index : 48,
            indexEnd : 52,
            height : 100,
            y : 100,
            x : -50,
            width : 240,
            content : '2'
        });

        expect(paintInfo[1][1]).toEqual({
            index : 52,
            indexEnd : 56,
            height : 100,
            y : 100,
            x : 190,
            width : 240,
            content : '3'
        });

        expect(paintInfo[2][0]).toEqual({
            index : 50,
            indexEnd : 51,
            height : 100,
            y : 200,
            x : 70,
            width : 60,
            content : 'cc'
        });

        expect(paintInfo[2][1]).toEqual({
            index : 51,
            indexEnd : 52,
            height : 100,
            y : 200,
            x : 130,
            width : 60,
            content : 'dd'
        });

        expect(paintInfo[2][2]).toEqual({
            index : 52,
            indexEnd : 53,
            height : 100,
            y : 200,
            x : 190,
            width : 60,
            content : 'aa'
        });

        expect(paintInfo[2][3]).toEqual({
            index : 53,
            indexEnd : 54,
            height : 100,
            y : 200,
            x : 250,
            width : 60,
            content : 'bb'
        });

        expect(paintInfo[2][4]).toEqual({
            index : 54,
            indexEnd : 55,
            height : 100,
            y : 200,
            x : 310,
            width : 60,
            content : 'cc'
        });
    });

    it("should return title at position", function () {
        var topHeaderZone = new TopHeaderZone({});
        topHeaderZone.lastPaintInfo = [[
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

        expect(topHeaderZone.titleAtPoint(new Point(0, 0))).toEqual('a');
        expect(topHeaderZone.titleAtPoint(new Point(100, 0))).toEqual('0');
        expect(topHeaderZone.titleAtPoint(new Point(199, 0))).toEqual('0');
        expect(topHeaderZone.titleAtPoint(new Point(299, 0))).toEqual('aa');
    });
});
