describe("[TableCanvas] View", function () {
    "use strict";

    var View = App.Table.View,
        Rectangle = App.Table.Rectangle,
        DataSource = App.Table.DataSource,
        Delegate = App.Table.Delegate,
        Point = App.Table.Point;

    var canvas, view, dataSource, delegate;
    beforeEach(function () {
        canvas = {
            width : 500,
            height : 600
        };

        dataSource = new DataSource();
        sinon.stub(dataSource, "rows").returns(100);
        sinon.stub(dataSource, "columns").returns(100);
        sinon.stub(dataSource, "leftHeaderColumns").returns(3);
        sinon.stub(dataSource, "topHeaderRows").returns(3);
        sinon.stub(dataSource, "isBlankRow").returns(false);

        delegate = new Delegate();
        sinon.stub(delegate, "leftHeaderColumnWidth").returns(100);
        sinon.stub(delegate, "topHeaderRowHeight").returns(30);

        view = new View({canvas : canvas, dataSource : dataSource, delegate : delegate});
    });

    afterEach(function () {
        view.destroy();
    });

    it("should configure the viewPort zones", function () {
        expect(view.zones.length).to.eql(5);

        expect(view.leftHeaderZone.viewPort).to.eql(new Rectangle(0, 90, 300, canvas.height - 90 - view.scrollSize - view.spinnerSize.height));
        expect(view.topHeaderZone.viewPort).to.eql(new Rectangle(300, 0, canvas.width - 300 - view.scrollSize, 90));
        expect(view.bodyZone.viewPort).to.eql(new Rectangle(300, 90, canvas.width - 300 - view.scrollSize, canvas.height - 90 - view.scrollSize - view.spinnerSize.height));
        expect(view.rightScrollZone.viewPort).to.eql(new Rectangle(canvas.width - 10, 90, 10, canvas.height - 90 - view.scrollSize - view.spinnerSize.height));
        expect(view.bottomScrollZone.viewPort).to.eql(new Rectangle(300, canvas.height - 10 - view.spinnerSize.height, canvas.width - 300 - view.scrollSize, view.scrollSize));
        expect(view.spinnerZone.viewPort).to.eql(new Rectangle(canvas.width - 10 - view.spinnerSize.width, canvas.height - view.spinnerSize.height, view.spinnerSize.width, view.spinnerSize.height));
    });

    it("should return the zoneName from a point", function () {
        expect(view.zoneFromPoint(new Point(0, 0))).to.be.undefined;
        expect(view.zoneFromPoint(new Point(100, 100))).to.equal("leftHeaderZone-separator");
        expect(view.zoneFromPoint(new Point(20, 100))).to.equal("leftHeaderZone");
        expect(view.zoneFromPoint(new Point(450, 0))).to.equal("topHeaderZone-separator");
        expect(view.zoneFromPoint(new Point(470, 0))).to.equal("topHeaderZone");
        expect(view.zoneFromPoint(new Point(320, 90))).to.equal("bodyZone");
        expect(view.zoneFromPoint(new Point(490, 90))).to.equal("rightScrollZone-scrollBar");
        expect(view.zoneFromPoint(new Point(490, 559))).to.equal("rightScrollZone");
        expect(view.zoneFromPoint(new Point(320, 560))).to.equal("bottomScrollZone-scrollBar");
        expect(view.zoneFromPoint(new Point(489, 560))).to.equal("bottomScrollZone");
    });


    describe("selection", function () {
        it("should start with an empty selection", function () {
            expect(view.selection).to.eql({rows : [], columns : []});
        });

        it("should toggle selection", function () {
            view.toggleSelection({rows : [1, 2, 3], columns : [1, 5, 6]});
            expect(view.selection).to.eql({rows : [1, 2, 3], columns : [1, 5, 6]});

            view.toggleSelection({rows : [1, 5]});
            expect(view.selection).to.eql({rows : [1, 2, 3, 5], columns : [1, 5, 6]});

            view.toggleSelection({rows : [1, 5]});
            expect(view.selection).to.eql({rows : [2, 3], columns : [1, 5, 6]});

            view.toggleSelection({rows : [2, 3, 6], columns: [5, 8]});
            expect(view.selection).to.eql({rows : [2, 3, 6], columns : [1, 5, 6, 8]});
        });

        it("should always keep a order selection", function () {
            view.toggleSelection({rows : [3, 1, 2], columns : [6, 5, 1]});
            expect(view.selection).to.eql({rows : [1, 2, 3], columns : [1, 5, 6]});
        });

        it("is selection active", function () {
            view.selection = {rows : [1, 2, 3], columns : [1, 5, 6]};
            expect(view.isSelectionActive({rows : [1, 2]})).to.be.true;

            view.selection = {rows : [1, 2, 3], columns : [1, 5, 6]};
            expect(view.isSelectionActive({rows : [1, 2], columns : [5]})).to.be.true;

            view.selection = {rows : [1, 2, 3], columns : [1, 5, 6]};
            expect(view.isSelectionActive({rows : [1, 2], columns : [5, 7]})).to.be.false;
        });
    });
});
