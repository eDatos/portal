describe("[TableCanvas] LeftHeaderZone", function () {

    var LeftHeaderZone = App.Table.LeftHeaderZone,
        Delegate = App.Table.Delegate,
        DataSource = App.Table.DataSource,
        Rectangle = App.Table.Rectangle,
        Point = App.Table.Point;

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
        expect(leftHeaderZone.incrementalCellSize.rows).to.eql(['stub']);
        expect(leftHeaderZone.incrementalCellSize.columns).to.eql([0, 100, 200, 300]);
        expect(leftHeaderZone.size.width).to.eql(300);
        expect(leftHeaderZone.size.height).to.eql(1200);
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
        expect(leftHeaderZone.incrementalCellSize.rows).to.eql(['stub']);
        expect(leftHeaderZone.incrementalCellSize.columns).to.eql([0, 100, 220, 370]);
        expect(leftHeaderZone.size.width).to.eql(370);
        expect(leftHeaderZone.size.height).to.eql(1200);
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
            [{ label : 'a', level : 0 }, { label : 'b', level : 0 }, { label : 'c', level : 0 }, { label : 'd', level : 0 }],
            [{ label : '0', level : 0 }, { label : '1', level : 0 }, { label : '2', level : 0 }, { label : '3', level : 0 }, { label : '4', level : 0 }],
            [{ label : 'aa', level : 0 }, { label : 'bb', level : 0 }, { label : 'cc', level : 0 }, { label : 'dd', level : 0 }]
        ]);
        sinon.stub(dataSource, "leftHeaderTooltipValues").returns([
            [{ title : 'tooltip : a' }, { title : 'tooltip : b' }, { title : 'tooltip : c' }, { title : 'tooltip : d' }],
            [{ title : 'tooltip : 0' }, { title : 'tooltip : 1' }, { title : 'tooltip : 2' }, { title : 'tooltip : 3' }, { title : 'tooltip : 4' }],
            [{ title : 'tooltip : aa' }, { title : 'tooltip : bb' }, { title : 'tooltip : cc' }, { title : 'tooltip : dd' }]
        ]);

        var delegate = new Delegate();
        sinon.stub(delegate, "leftHeaderColumnWidth").returns(100);

        var topHeaderZone = new LeftHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        var paintInfo = topHeaderZone.paintInfo();

        expect(paintInfo.length).to.eql(3);
        console.log(paintInfo[2][0])
        expect(paintInfo[0]).to.eql([
            {
                index : 0,
                indexEnd : 20,
                height : 1200,
                y : 0,
                x : 0,
                width : 100,
                content : 'a',
                tooltip : 'tooltip : a',
                attributes : [],
                level : 0
            }
        ]);

        expect(paintInfo[1]).to.eql([
            {
                index : 0,
                indexEnd : 4,
                height : 240,
                y : 0,
                x : 100,
                width : 100,
                content : '0',
                tooltip : 'tooltip : 0',
                attributes : [],
                level : 0
            }
        ]);

        expect(paintInfo[2][0]).to.eql({
            index : 0,
            indexEnd : 1,
            height : 60,
            y : 0,
            x : 200,
            width : 100,
            content : 'aa',
            tooltip : 'tooltip : aa',
            attributes : [],
            level : 0
        });

        expect(paintInfo[2][1]).to.eql({
            index : 1,
            indexEnd : 2,
            height : 60,
            y : 60,
            x : 200,
            width : 100,
            content : 'bb',
            tooltip : 'tooltip : bb',
            attributes : [],
            level : 0
        });

        expect(paintInfo[2][2]).to.eql({
            index : 2,
            indexEnd : 3,
            width : 100,
            x : 200,
            y : 120,
            height : 60,
            content : 'cc',
            tooltip : 'tooltip : cc',
            attributes : [],
            level : 0
        });

        expect(paintInfo[2][3]).to.eql({
            index : 3,
            indexEnd : 4,
            width : 100,
            x : 200,
            y : 180,
            height : 60,
            content : 'dd',
            tooltip : 'tooltip : dd',
            attributes : [],
            level : 0
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
            [{ label : 'a', level : 0 }, { label : 'b', level : 0 }, { label : 'c', level : 0 }, { label : 'd', level : 0 }],
            [{ label : '0', level : 0 }, { label : '1', level : 0 }, { label : '2', level : 0 }, { label : '3', level : 0 }, { label : '4', level : 0 }],
            [{ label : 'aa', level : 0 }, { label : 'bb', level : 0 }, { label : 'cc', level : 0 }, { label : 'dd', level : 0 }]
        ]);
        sinon.stub(dataSource, "leftHeaderTooltipValues").returns([
            [{ title : 'tooltip : a'}, { title : 'tooltip : b'}, { title : 'tooltip : c'}, { title : 'tooltip : d'}],
            [{ title : 'tooltip : 0'}, { title : 'tooltip : 1'}, { title : 'tooltip : 2'}, { title : 'tooltip : 3'}, { title : 'tooltip : 4'}],
            [{ title : 'tooltip : aa'}, { title : 'tooltip : bb'}, { title : 'tooltip : cc'}, { title : 'tooltip : dd'}]
        ]);

        var delegate = new Delegate();
        sinon.stub(delegate, "leftHeaderColumnWidth").returns(100);

        var topHeaderZone = new LeftHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        topHeaderZone.setViewPort(new Rectangle(0, 100, 240, 300));

        var paintInfo = topHeaderZone.paintInfo();

        expect(paintInfo.length).to.eql(3);

        expect(paintInfo[0]).to.eql([
            {
                index : 40,
                indexEnd : 60,
                width : 100,
                x : 0,
                y : -530,
                height : 1200,
                content : 'c',
                tooltip : 'tooltip : c',
                attributes : [],
                level : 0
            }
        ]);

        expect(paintInfo[1][0]).to.eql({
            index : 48,
            indexEnd : 52,
            width : 100,
            x : 100,
            y : -50,
            height : 240,
            content : '2',
            tooltip : 'tooltip : 2',
            attributes : [],
            level : 0
        });

        expect(paintInfo[1][1]).to.eql({
            index : 52,
            indexEnd : 56,
            width : 100,
            x : 100,
            y : 190,
            height : 240,
            content : '3',
            tooltip : 'tooltip : 3',
            attributes : [],
            level : 0
        });

        expect(paintInfo[2][0]).to.eql({
            index : 50,
            indexEnd : 51,
            width : 100,
            x : 200,
            y : 70,
            height : 60,
            content : 'cc',
            tooltip : 'tooltip : cc',
            attributes : [],
            level : 0
        });

        expect(paintInfo[2][1]).to.eql({
            index : 51,
            indexEnd : 52,
            width : 100,
            x : 200,
            y : 130,
            height : 60,
            content : 'dd',
            tooltip : 'tooltip : dd',
            attributes : [],
            level : 0
        });

        expect(paintInfo[2][2]).to.eql({
            index : 52,
            indexEnd : 53,
            width : 100,
            x : 200,
            y : 190,
            height : 60,
            content : 'aa',
            tooltip : 'tooltip : aa',
            attributes : [],
            level : 0
        });

        expect(paintInfo[2][3]).to.eql({
            index : 53,
            indexEnd : 54,
            width : 100,
            x : 200,
            y : 250,
            height : 60,
            content : 'bb',
            tooltip : 'tooltip : bb',
            attributes : [],
            level : 0
        });

        expect(paintInfo[2][4]).to.eql({
            index : 54,
            indexEnd : 55,
            width : 100,
            x : 200,
            y : 310,
            height : 60,
            content : 'cc',
            tooltip : 'tooltip : cc',
            attributes : [],
            level : 0
        });
    });

    it("should return title at position", function () {
        var delegate = new Delegate();
        var leftHeaderZone = new LeftHeaderZone({ delegate : delegate });
        leftHeaderZone.lastPaintInfo = [
            [
                {
                    index : 0,
                    height : 1200,
                    y : 0,
                    x : 0,
                    width : 100,
                    content : 'a',
                    tooltip : 'tooltip : a',
                    attributes : []
                },
                {
                    index : 0,
                    height : 240,
                    y : 0,
                    x : 100,
                    width : 100,
                    content : '0',
                    tooltip : 'tooltip : 0',
                    attributes : []
                },
                {
                    index : 0,
                    height : 60,
                    y : 0,
                    x : 200,
                    width : 100,
                    content : 'aa',
                    tooltip : 'tooltip : aa',
                    attributes : []
                }
            ]
        ];

        expect(leftHeaderZone.cellInfoAtPoint(new Point(0, 0))).to.eql('tooltip : a');
        expect(leftHeaderZone.cellInfoAtPoint(new Point(100, 0))).to.eql('tooltip : 0');
        expect(leftHeaderZone.cellInfoAtPoint(new Point(199, 0))).to.eql('tooltip : 0');
        expect(leftHeaderZone.cellInfoAtPoint(new Point(299, 0))).to.eql('tooltip : aa');
    });


    describe("should calculate if point if a rectangle contains a column separator", function () {
        var topHeaderZone;

        beforeEach(function () {
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
            sinon.stub(dataSource, "leftHeaderTooltipValues").returns([
                [{ title : 'a' }, { title : 'b' }, { title : 'c' }, { title : 'd' }],
                [{ title : '0' }, { title : '1' }, { title : '2' }, { title : '3' }, { title : '4' }],
                [{ title : 'aa' }, { title : 'bb' }, { title : 'cc' }, { title : 'dd' }]
            ]);  

            var delegate = new Delegate();
            sinon.stub(delegate, "leftHeaderColumnWidth").returns(100);

            topHeaderZone = new LeftHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
            topHeaderZone.paintInfo();
        });

        it("rectangle contains column separator", function () {
            var r = new Rectangle(99, 0, 5, 5);
            expect(topHeaderZone.separatorIndexInRectangle(r)).to.equal(1);
        });

        it("rectangle don't contians column separator", function () {
            var r = new Rectangle(120, 0, 5, 5);
            expect(topHeaderZone.separatorIndexInRectangle(r)).to.be.undefined;
        });

    });
});
