describe("[TableCanvas] TopHeaderZone", function () {

    var TopHeaderZone = App.Table.TopHeaderZone,
        Delegate = App.Table.Delegate,
        Point = App.Table.Point,
        DataSource = App.Table.DataSource,
        Rectangle = App.Table.Rectangle;

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
        expect(topHeaderZone.incrementalCellSize.rows).to.eql([0, 100, 200, 300]);
        expect(topHeaderZone.incrementalCellSize.columns).to.eql(['stub']);
        expect(topHeaderZone.size.height).to.eql(300);
        expect(topHeaderZone.size.width).to.eql(1200);
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
        expect(leftHeaderZone.incrementalCellSize.rows).to.eql([0, 100, 220, 370]);
        expect(leftHeaderZone.incrementalCellSize.columns).to.eql(['stub']);
        expect(leftHeaderZone.size.height).to.eql(370);
        expect(leftHeaderZone.size.width).to.eql(1200);
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
        sinon.stub(dataSource, "topHeaderTooltipValues").returns([
            [{ title : 'tooltip : a' }, { title : 'tooltip : b' }, { title : 'tooltip : c' }, { title : 'tooltip : d' }],
            [{ title : 'tooltip : 0' }, { title : 'tooltip : 1' }, { title : 'tooltip : 2' }, { title : 'tooltip : 3' }, { title : 'tooltip : 4' }],
            [{ title : 'tooltip : aa' }, { title : 'tooltip : bb' }, { title : 'tooltip : cc' }, { title : 'tooltip : dd' }]
        ]);

        var delegate = new Delegate();
        sinon.stub(delegate, "topHeaderRowHeight").returns(100);

        var topHeaderZone = new TopHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        var paintInfo = topHeaderZone.paintInfo();

        expect(paintInfo.length).to.eql(3);
        expect(paintInfo[0]).to.eql([
            {
                index : 0,
                indexEnd : 20,
                height : 100,
                y : 0,
                x : 0,
                width : 1200,
                content : 'a',
                tooltip : 'tooltip : a',
                attributes : []
            }
        ]);

        expect(paintInfo[1]).to.eql([
            {
                index : 0,
                indexEnd : 4,
                height : 100,
                y : 100,
                x : 0,
                width : 240,
                content : '0',
                tooltip : 'tooltip : 0',
                attributes : []               
            }
        ]);

        expect(paintInfo[2][0]).to.eql({
            index : 0,
            indexEnd : 1,
            height : 100,
            y : 200,
            x : 0,
            width : 60,
            content : 'aa',
            tooltip : 'tooltip : aa',
            attributes : []
        });

        expect(paintInfo[2][1]).to.eql({
            index : 1,
            indexEnd : 2,
            height : 100,
            y : 200,
            x : 60,
            width : 60,
            content : 'bb',
            tooltip : 'tooltip : bb',
            attributes : []
        });

        expect(paintInfo[2][2]).to.eql({
            index : 2,
            indexEnd : 3,
            height : 100,
            y : 200,
            x : 120,
            width : 60,
            content : 'cc',
            tooltip : 'tooltip : cc',
            attributes : []
        });

        expect(paintInfo[2][3]).to.eql({
            index : 3,
            indexEnd : 4,
            height : 100,
            y : 200,
            x : 180,
            width : 60,
            content : 'dd',
            tooltip : 'tooltip : dd',
            attributes : []
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
        sinon.stub(dataSource, "topHeaderTooltipValues").returns([
            [{ title : 'tooltip : a' }, { title : 'tooltip : b' }, { title : 'tooltip : c' }, { title : 'tooltip : d' }],
            [{ title : 'tooltip : 0' }, { title : 'tooltip : 1' }, { title : 'tooltip : 2' }, { title : 'tooltip : 3' }, { title : 'tooltip : 4' }],
            [{ title : 'tooltip : aa' }, { title : 'tooltip : bb' }, { title : 'tooltip : cc' }, { title : 'tooltip : dd' }]
        ]);


        var delegate = new Delegate();
        sinon.stub(delegate, "topHeaderRowHeight").returns(100);

        var topHeaderZone = new TopHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
        topHeaderZone.setViewPort(new Rectangle(100, 0, 240, 300));

        var paintInfo = topHeaderZone.paintInfo();

        expect(paintInfo.length).to.eql(3);

        expect(paintInfo[0]).to.eql([
            {
                index : 40,
                indexEnd : 60,
                height : 100,
                y : 0,
                x : -530,
                width : 1200,
                content : 'c',
                tooltip : 'tooltip : c',
                attributes : []
            }
        ]);

        expect(paintInfo[1][0]).to.eql({
            index : 48,
            indexEnd : 52,
            height : 100,
            y : 100,
            x : -50,
            width : 240,
            content : '2',
            tooltip : 'tooltip : 2',
            attributes : []
        });

        expect(paintInfo[1][1]).to.eql({
            index : 52,
            indexEnd : 56,
            height : 100,
            y : 100,
            x : 190,
            width : 240,
            content : '3',
            tooltip : 'tooltip : 3',
            attributes : []
        });

        expect(paintInfo[2][0]).to.eql({
            index : 50,
            indexEnd : 51,
            height : 100,
            y : 200,
            x : 70,
            width : 60,
            content : 'cc',
            tooltip : 'tooltip : cc',
            attributes : []
        });

        expect(paintInfo[2][1]).to.eql({
            index : 51,
            indexEnd : 52,
            height : 100,
            y : 200,
            x : 130,
            width : 60,
            content : 'dd',
            tooltip : 'tooltip : dd',
            attributes : []
        });

        expect(paintInfo[2][2]).to.eql({
            index : 52,
            indexEnd : 53,
            height : 100,
            y : 200,
            x : 190,
            width : 60,
            content : 'aa',
            tooltip : 'tooltip : aa',
            attributes : []
        });

        expect(paintInfo[2][3]).to.eql({
            index : 53,
            indexEnd : 54,
            height : 100,
            y : 200,
            x : 250,
            width : 60,
            content : 'bb',
            tooltip : 'tooltip : bb',
            attributes : []
        });

        expect(paintInfo[2][4]).to.eql({
            index : 54,
            indexEnd : 55,
            height : 100,
            y : 200,
            x : 310,
            width : 60,
            content : 'cc',
            tooltip : 'tooltip : cc',
            attributes : []
        });
    });

    it("should return title at position", function () {        
        var delegate = new Delegate();
        var topHeaderZone = new TopHeaderZone({ delegate : delegate });
        topHeaderZone.lastPaintInfo = [[
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
        ]];

        expect(topHeaderZone.cellInfoAtPoint(new Point(0, 0))).to.eql('tooltip : a');
        expect(topHeaderZone.cellInfoAtPoint(new Point(100, 0))).to.eql('tooltip : 0');
        expect(topHeaderZone.cellInfoAtPoint(new Point(199, 0))).to.eql('tooltip : 0');
        expect(topHeaderZone.cellInfoAtPoint(new Point(299, 0))).to.eql('tooltip : aa');
    });

    describe("should calculate if point if a rectangle contains a column separator", function () {

        var topHeaderZone;

        beforeEach(function () {
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
            sinon.stub(dataSource, "topHeaderTooltipValues").returns([
                [{ title : 'tooltip : a' }, { title : 'tooltip : b' }, { title : 'tooltip : c' }, { title : 'tooltip : d' }],
                [{ title : 'tooltip : 0' }, { title : 'tooltip : 1' }, { title : 'tooltip : 2' }, { title : 'tooltip : 3' }, { title : 'tooltip : 4' }],
                [{ title : 'tooltip : aa' }, { title : 'tooltip : bb' }, { title : 'tooltip : cc' }, { title : 'tooltip : dd' }]
            ]);

            var delegate = new Delegate();
            sinon.stub(delegate, "topHeaderRowHeight").returns(100);

            topHeaderZone = new TopHeaderZone({dataSource : dataSource, delegate : delegate, bodyZone : bodyZone});
            topHeaderZone.setViewPort(new Rectangle(100, 0, 240, 300));
        });

        it("rectangle in column separator", function () {
            var r = new Rectangle(70, 0, 5, 5);
            expect(topHeaderZone.separatorIndexInRectangle(r)).to.equal(50);
        });

        it("rectangle not in column separator", function () {
            var r = new Rectangle(311, 0, 5, 5);
            expect(topHeaderZone.separatorIndexInRectangle(r)).to.be.undefined;
        });
    });

});
