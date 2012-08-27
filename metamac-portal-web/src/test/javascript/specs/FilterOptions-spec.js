describe("Filter Options", function () {

    var FilterOptions = STAT4YOU.widget.FilterOptions;
    var filterOptions;
    var metadata = {
        getDimensionsAndRepresentations : function () {
            return [
                {
                    id : 'id1',
                    label : 'enid1',
                    representations : [
                        {id : 'id1a', label : 'enid1a'},
                        {id : 'id1b', label : 'enid1b'}
                    ]
                },
                {
                    id : 'id2',
                    label : 'enid2',
                    representations : [
                        {id : 'id2a', label : 'enid2a'},
                        {id : 'id2b', label : 'enid2b'}
                    ]
                },
                {
                    id : 'id3',
                    label : 'enid3',
                    representations : [
                        {id : 'id3a', label : 'enid3a'},
                        {id : 'id3b', label : 'enid3b'}
                    ]
                }
            ];
        }
    };

    beforeEach(function () {
        filterOptions = new FilterOptions({metadata : metadata});
    });

    it("Initialize by metadata content", function () {
        var dimensions = [
            {
                id : 'id1',
                number : 0,
                label : "enid1",
                categories : [
                    {id : 'id1a', label : 'enid1a', number : 0, state : 1},
                    {id : 'id1b', label : 'enid1b', number : 1, state : 1}
                ]
            },
            {
                id : 'id2',
                number : 1,
                label : "enid2",
                categories : [
                    {id : 'id2a', label : 'enid2a', number : 0, state : 1},
                    {id : 'id2b', label : 'enid2b', number : 1, state : 1}
                ]
            },
            {
                id : 'id3',
                number : 2,
                label : "enid3",
                categories : [
                    {id : 'id3a', label : 'enid3a', number : 0, state : 1},
                    {id : 'id3b', label : 'enid3b', number : 1, state : 1}
                ]
            }
        ];
        expect(filterOptions.getDimensions()).toEqual(dimensions);
        expect(filterOptions.getLeftDimensions()).toEqual([dimensions[0], dimensions[1]]);
        expect(filterOptions.getTopDimensions()).toEqual([dimensions[2]]);
        expect(filterOptions.getFixedDimensions()).toEqual([]);
    });

    it("should sort the dimensions by the position", function () {

        expect(_.pluck(filterOptions.getLeftDimensions(), "id")).toEqual(["id1", "id2"]);
        expect(_.pluck(filterOptions.getTopDimensions(), "id")).toEqual(["id3"]);

        filterOptions.changeDimensionZone("id1", 'top');
        filterOptions.changeDimensionZone("id3", 'left');

        expect(_.pluck(filterOptions.getLeftDimensions(), "id")).toEqual(["id2", "id3"]);
        expect(_.pluck(filterOptions.getTopDimensions(), "id")).toEqual(["id1"]);
    });

    it("get dimension", function () {
        var dimension = filterOptions.getDimension('id1');
        expect(dimension).toEqual({
            id : 'id1',
            number : 0,
            label : "enid1",
            categories : [
                {id : 'id1a', label : 'enid1a', number : 0, state : 1},
                {id : 'id1b', label : 'enid1b', number : 1, state : 1}
            ]
        });
    });

    it("get categories", function () {

        var id1Categories = [
            {id : 'id1a', label : 'enid1a', number : 0, state : 1},
            {id : 'id1b', label : 'enid1b', number : 1, state : 1}
        ];

        expect(filterOptions.getCategories('id1')).toEqual(id1Categories);
        expect(filterOptions.getCategories(0)).toEqual(id1Categories);

        expect(filterOptions.getCategories()).toEqual([
            [
                {id : 'id1a', label : 'enid1a', number : 0, state : 1},
                {id : 'id1b', label : 'enid1b', number : 1, state : 1}
            ],
            [
                {id : 'id2a', label : 'enid2a', number : 0, state : 1},
                {id : 'id2b', label : 'enid2b', number : 1, state : 1}
            ],
            [
                {id : 'id3a', label : 'enid3a', number : 0, state : 1},
                {id : 'id3b', label : 'enid3b', number : 1, state : 1}
            ]
        ]);
    });

    it("get category", function () {
        var expected = {id : 'id1b', label : 'enid1b', number : 1, state : 1};
        expect(filterOptions.getCategory('id1', 'id1b')).toEqual(expected);
        expect(filterOptions.getCategory(0, 1)).toEqual(expected);
    });

    it("toggle categories", function () {
        var selected = filterOptions.getSelectedCategories(0);
        expect(selected.length).toEqual(2);

        filterOptions.toggleCategoryState(0, 0);
        selected = filterOptions.getSelectedCategories(0);
        expect(selected.length).toEqual(1);

        filterOptions.toggleCategoryState(0, 0);
        selected = filterOptions.getSelectedCategories(0);
        expect(selected.length).toEqual(2);
    });

    it("swap dimensions", function () {

        expect(filterOptions.getLeftDimensions()[0].number).toEqual(0);
        expect(filterOptions.getLeftDimensions()[1].number).toEqual(1);
        expect(filterOptions.getTopDimensions()[0].number).toEqual(2);

        filterOptions.swapDimensions(0, 2);

        expect(filterOptions.getLeftDimensions()[0].number).toEqual(2);
        expect(filterOptions.getLeftDimensions()[1].number).toEqual(1);
        expect(filterOptions.getTopDimensions()[0].number).toEqual(0);
    });

    it("should exchange restriction when swap dimensions", function () {
        var leftDimension = filterOptions.getLeftDimensions()[0];
        var topDimension = filterOptions.getTopDimensions()[0];

        filterOptions.setSelectedCategoriesRestriction({left : 1, top : 2});
        expect(filterOptions._getDimension(leftDimension.number).restriction._restriction).toEqual(1);
        expect(filterOptions._getDimension(topDimension.number).restriction._restriction).toEqual(2);

        filterOptions.swapDimensions(leftDimension.number, topDimension.number);
        expect(filterOptions._getDimension(leftDimension.number).restriction._restriction).toEqual(2);
        expect(filterOptions._getDimension(topDimension.number).restriction._restriction).toEqual(1);
    });

    it("get table size", function () {
        var tableSize = filterOptions.getTableSize();
        expect(tableSize).toEqual({rows : 4, columns : 2});
    });

    it("get zone from position", function () {
        expect(filterOptions._getZoneFromPosition(-1)).toBeUndefined();
        expect(filterOptions._getZoneFromPosition(0)).toEqual("left");
        expect(filterOptions._getZoneFromPosition(19)).toEqual("left");
        expect(filterOptions._getZoneFromPosition(20)).toEqual("top");
        expect(filterOptions._getZoneFromPosition(39)).toEqual("top");
        expect(filterOptions._getZoneFromPosition(40)).toEqual("fixed");
        expect(filterOptions._getZoneFromPosition(59)).toEqual("fixed");
        expect(filterOptions._getZoneFromPosition(60)).toBeUndefined();
    });

    it("removeDimensionCurrentZone", function () {
        expect(filterOptions.getLeftDimensions().length).toEqual(2);
        expect(filterOptions.getTopDimensions().length).toEqual(1);

        filterOptions._removeDimensionCurrentZone(filterOptions._getDimension(0));
        expect(filterOptions.getLeftDimensions().length).toEqual(1);
        expect(filterOptions.getTopDimensions().length).toEqual(1);
        filterOptions._removeDimensionCurrentZone(filterOptions._getDimension(1));
        expect(filterOptions.getLeftDimensions().length).toEqual(0);
        expect(filterOptions.getTopDimensions().length).toEqual(1);

        filterOptions.dimensions[0].position = filterOptions.positionLimit.fixed.begin;
        expect(filterOptions.getFixedDimensions().length).toEqual(1);
        filterOptions._removeDimensionCurrentZone(filterOptions._getDimension(0));
        expect(filterOptions.getFixedDimensions().length).toEqual(0);
    });

    it("changeDimensionZone", function () {
        expect(filterOptions.getLeftDimensions().length).toEqual(2);
        expect(filterOptions.getTopDimensions().length).toEqual(1);
        expect(filterOptions.getFixedDimensions().length).toEqual(0);

        filterOptions.changeDimensionZone(0, "top");
        expect(filterOptions.getLeftDimensions().length).toEqual(1);
        expect(filterOptions.getTopDimensions().length).toEqual(2);
        expect(filterOptions.getFixedDimensions().length).toEqual(0);

        filterOptions.changeDimensionZone(2, "left");
        expect(filterOptions.getLeftDimensions().length).toEqual(2);
        expect(filterOptions.getTopDimensions().length).toEqual(1);
        expect(filterOptions.getFixedDimensions().length).toEqual(0);

        filterOptions.changeDimensionZone(1, "fixed");
        expect(filterOptions.getLeftDimensions().length).toEqual(1);
        expect(filterOptions.getTopDimensions().length).toEqual(1);
        expect(filterOptions.getFixedDimensions().length).toEqual(1);
    });


    describe("zone length restriction", function () {
        it("should change dimensions zones", function () {
            expect(filterOptions.getLeftDimensions().length).toEqual(2);
            expect(filterOptions.getTopDimensions().length).toEqual(1);
            expect(filterOptions.getFixedDimensions().length).toEqual(0);

            filterOptions.setZoneLengthRestriction({left : 2, top : 0});
            expect(filterOptions.getLeftDimensions().length).toEqual(2);
            expect(filterOptions.getTopDimensions().length).toEqual(0);
            expect(filterOptions.getFixedDimensions().length).toEqual(1);

            filterOptions.setZoneLengthRestriction({left : 1, top : 0});
            expect(filterOptions.getLeftDimensions().length).toEqual(1);
            expect(filterOptions.getTopDimensions().length).toEqual(0);
            expect(filterOptions.getFixedDimensions().length).toEqual(2);
        });

        it("should use the firsts posisionts", function () {
            filterOptions.setZoneLengthRestriction({left : 1, top : 1});
            var leftDimensions = filterOptions.getLeftDimensions();
            var topDimensions = filterOptions.getTopDimensions();
            var leftDimension = filterOptions._getDimension(leftDimensions[0].number);
            var topDimension = filterOptions._getDimension(topDimensions[0].number);
            expect(leftDimensions.length).toEqual(1);
            expect(topDimensions.length).toEqual(1);
            expect(leftDimension.position).toEqual(filterOptions.positionLimit.left.begin);
            expect(topDimension.position).toEqual(filterOptions.positionLimit.top.begin);
        });

        it("from pie to bar", function () {
            filterOptions.setZoneLengthRestriction({left : 1, top : 0});
            filterOptions.setZoneLengthRestriction({left : 1, top : 1});

            var leftDimensions = filterOptions.getLeftDimensions();
            var topDimensions = filterOptions.getTopDimensions();
            var leftDimension = filterOptions._getDimension(leftDimensions[0].number);
            var topDimension = filterOptions._getDimension(topDimensions[0].number);
            expect(leftDimensions.length).toEqual(1);
            expect(topDimensions.length).toEqual(1);
            expect(leftDimension.position).toEqual(filterOptions.positionLimit.left.begin);
            expect(topDimension.position).toEqual(filterOptions.positionLimit.top.begin);
        });

    });



    it("set selected categories restriction", function () {
        expect(filterOptions.getSelectedCategories(0).length).toEqual(2);
        filterOptions.setSelectedCategoriesRestriction({left : 1});
        expect(filterOptions.getSelectedCategories(0).length).toEqual(1);
        filterOptions.setSelectedCategoriesRestriction({left : 50});
        expect(filterOptions.getSelectedCategories(0).length).toEqual(1);
    });





    it("getCategoryIdsForCell", function () {
        expect(filterOptions.getCategoryIdsForCell({x : 0, y : 0})).toEqual({id1 : 'id1a', id2 : 'id2a', id3 : 'id3a'});
        expect(filterOptions.getCategoryIdsForCell({x : 1, y : 0})).toEqual({id1 : 'id1a', id2 : 'id2a', id3 : 'id3b'});
        expect(filterOptions.getCategoryIdsForCell({x : 0, y : 1})).toEqual({id1 : 'id1a', id2 : 'id2b', id3 : 'id3a'});
        expect(filterOptions.getCategoryIdsForCell({x : 1, y : 1})).toEqual({id1 : 'id1a', id2 : 'id2b', id3 : 'id3b'});

        filterOptions.changeDimensionZone(0, "fixed");

        expect(filterOptions.getCategoryIdsForCell({x : 0, y : 0})).toEqual({id1 : 'id1a', id2 : 'id2a', id3 : 'id3a'});
        expect(filterOptions.getCategoryIdsForCell({x : 1, y : 0})).toEqual({id1 : 'id1a', id2 : 'id2a', id3 : 'id3b'});
    });

    it("getCellForCategoryIds", function () {
        expect(filterOptions.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2a', id3 : 'id3a'}))
            .toEqual({x : 0, y : 0});
        expect(filterOptions.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2a', id3 : 'id3b'}))
            .toEqual({x : 1, y : 0});
        expect(filterOptions.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2b', id3 : 'id3a'}))
            .toEqual({x : 0, y : 1});
        expect(filterOptions.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2b', id3 : 'id3b'}))
            .toEqual({x : 1, y : 1});

        filterOptions.changeDimensionZone(0, "top");
        expect(filterOptions.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2a', id3 : 'id3a'}))
            .toEqual({x : 0, y : 0});
        expect(filterOptions.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2a', id3 : 'id3b'}))
            .toEqual({x : 2, y : 0});
        expect(filterOptions.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2b', id3 : 'id3a'}))
            .toEqual({x : 0, y : 1});
        expect(filterOptions.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2b', id3 : 'id3b'}))
            .toEqual({x : 2, y : 1});
    });

    it("should clone", function () {
        filterOptions.setSelectedCategoriesRestriction({left : 2, top: 5});

        var cloned = filterOptions.clone();

        expect(cloned.dimensions).toEqual(filterOptions.dimensions);
        expect(cloned.dimensions).not.toBe(filterOptions.dimensions);

        expect(cloned.dimensionsMap).toEqual(filterOptions.dimensionsMap);
        expect(cloned.dimensionsMap).not.toBe(filterOptions.dimensionsMap);

        expect(cloned.positionLimit).toEqual(filterOptions.positionLimit);
        expect(cloned.positionLimit).not.toBe(filterOptions.positionLimit);

        expect(cloned.metadata).toBe(filterOptions.metadata);

        expect(cloned._selectedCategoriesRestriction).toEqual(filterOptions._selectedCategoriesRestriction);
        expect(cloned._selectedCategoriesRestriction).not.toBe(filterOptions._selectedCategoriesRestriction);

        for (var i = 0; i < cloned.dimensions.length; i++) {
            var clonedDim = cloned.dimensions[i];
            var dim = filterOptions.dimensions[i];
            expect(clonedDim).not.toBe(dim);

            for (var j = 0; j < clonedDim.representations.length; j++) {
                var clonedRepresentation = clonedDim.representations[j];
                var representation = dim.representations[j];
                expect(clonedRepresentation).not.toBe(representation);
            }

            expect(clonedDim.restriction).not.toBe(dim.restriction);
        }

        //Table Info
        expect(cloned.tableInfo).not.toBe(filterOptions.tableInfo);
        _.each(["ids", "representationsValues", "representationsIds", "representationsLengths", "representationsMult"],
            function (prop) {
                expect(cloned.tableInfo.left[prop]).not.toBe(filterOptions.tableInfo.left[prop]);
            }
        );

        expect(cloned).toEqual(filterOptions);
        expect(cloned).not.toBe(filterOptions);

    });

});
