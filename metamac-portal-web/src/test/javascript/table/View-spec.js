describe("[TableCanvas] View", function () {
    "use strict";

    var View = STAT4YOU.Table.View,
        Rectangle = STAT4YOU.Table.Rectangle,
        DataSource = STAT4YOU.Table.DataSource,
        Delegate = STAT4YOU.Table.Delegate,
        Point = STAT4YOU.Table.Point;

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

        delegate = new Delegate();
        sinon.stub(delegate, "leftHeaderColumnWidth").returns(100);
        sinon.stub(delegate, "topHeaderRowHeight").returns(30);

        view = new View({canvas : canvas, dataSource : dataSource, delegate : delegate});
    });

    it("should configure the viewPort zones", function () {
        expect(view.zones.length).toEqual(5);

        expect(view.leftHeaderZone.viewPort).toEqual(new Rectangle(0, 90, 300, canvas.height - 90 - view.scrollSize - view.spinnerSize.height));
        expect(view.topHeaderZone.viewPort).toEqual(new Rectangle(300, 0, canvas.width - 300 - view.scrollSize, 90));
        expect(view.bodyZone.viewPort).toEqual(new Rectangle(300, 90, canvas.width - 300 - view.scrollSize, canvas.height - 90 - view.scrollSize - view.spinnerSize.height));
        expect(view.rightScrollZone.viewPort).toEqual(new Rectangle(canvas.width - 10, 90, 10, canvas.height - 90 - view.scrollSize - view.spinnerSize.height));
        expect(view.bottomScrollZone.viewPort).toEqual(new Rectangle(300, canvas.height - 10 - view.spinnerSize.height, canvas.width - 300 - view.scrollSize, view.scrollSize));
        expect(view.spinnerZone.viewPort).toEqual(new Rectangle(canvas.width - 10 - view.spinnerSize.width, canvas.height - view.spinnerSize.height, view.spinnerSize.width, view.spinnerSize.height));
    });

    it("should return the zoneName from a point", function () {
        expect(view.zoneFromPoint(new Point(0, 0))).toBeUndefined();
        expect(view.zoneFromPoint(new Point(0, 90))).toEqual("leftHeaderZone");
        expect(view.zoneFromPoint(new Point(300, 0))).toEqual("topHeaderZone");
        expect(view.zoneFromPoint(new Point(300, 90))).toEqual("bodyZone");
        expect(view.zoneFromPoint(new Point(490, 90))).toEqual("rightScrollZone-scrollBar");
        expect(view.zoneFromPoint(new Point(490, 559))).toEqual("rightScrollZone");
        expect(view.zoneFromPoint(new Point(300, 560))).toEqual("bottomScrollZone-scrollBar");
        expect(view.zoneFromPoint(new Point(489, 560))).toEqual("bottomScrollZone");
    });


    describe("selection", function () {
        it("should start with an empty selection", function () {
            expect(view.selection).toEqual({rows : [], columns : []});
        });

        it("should toggle selection", function () {
            view.toggleSelection({rows : [1, 2, 3], columns : [1, 5, 6]});
            expect(view.selection).toEqual({rows : [1, 2, 3], columns : [1, 5, 6]});

            view.toggleSelection({rows : [1, 5]});
            expect(view.selection).toEqual({rows : [1, 2, 3, 5], columns : [1, 5, 6]});

            view.toggleSelection({rows : [1, 5]});
            expect(view.selection).toEqual({rows : [2, 3], columns : [1, 5, 6]});

            view.toggleSelection({rows : [2, 3, 6], columns: [5, 8]});
            expect(view.selection).toEqual({rows : [2, 3, 6], columns : [1, 5, 6, 8]});
        });

        it("should always keep a order selection", function () {
            view.toggleSelection({rows : [3, 1, 2], columns : [6, 5, 1]});
            expect(view.selection).toEqual({rows : [1, 2, 3], columns : [1, 5, 6]});
        });

        it("is selection active", function () {
            view.selection = {rows : [1, 2, 3], columns : [1, 5, 6]};
            expect(view.isSelectionActive({rows : [1, 2]})).toBeTruthy();

            view.selection = {rows : [1, 2, 3], columns : [1, 5, 6]};
            expect(view.isSelectionActive({rows : [1, 2], columns : [5]})).toBeTruthy();

            view.selection = {rows : [1, 2, 3], columns : [1, 5, 6]};
            expect(view.isSelectionActive({rows : [1, 2], columns : [5, 7]})).toBeFalsy();
        });
    });
});
