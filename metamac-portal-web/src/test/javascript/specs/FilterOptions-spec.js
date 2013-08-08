describe("Filter Options", function () {

    var FilterOptions = App.widget.FilterOptions;
    var filterOptions;
    var metadata;

    beforeEach(function () {
        metadata = {
            getDimensionsAndRepresentations : function () {
                return [
                    {
                        id : 'id1',
                        label : 'enid1',
                        type : 'DIMENSION',
                        representations : [
                            {id : 'id1a', label : 'enid1a'},
                            {id : 'id1b', label : 'enid1b'}
                        ]
                    },
                    {
                        id : 'id2',
                        label : 'enid2',
                        type : 'GEOGRAPHIC_DIMENSION',
                        representations : [
                            {id : 'id2a', label : 'enid2a'},
                            {id : 'id2b', label : 'enid2b'}
                        ]
                    },
                    {
                        id : 'id3',
                        label : 'enid3',
                        type : 'TIME_DIMENSION',
                        representations : [
                            {id : 'id3a', label : 'enid3a', normCode : 'TIME1'},
                            {id : 'id3b', label : 'enid3b', normCode : 'TIME2'},
                            {id : 'id3c', label : 'enid3c', normCode : null}
                        ]
                    }
                ];
            },
            getDimensionsPosition : function () {
                return {top : ['id3'], left : ['id1', 'id2']};
            }
        };
        filterOptions = new FilterOptions({metadata : metadata});
    });

    var getDimensionsLength = function () {
        return _.chain(["left", "top", "fixed"])
            .map(function (zone) {
                return [zone, filterOptions._getDimensionsInZone(zone).length];
            }).object()
            .value();
    };

    it("Initialize by metadata content", function () {
        var dimensions = [
            {
                id : 'id1',
                number : 0,
                label : "enid1",
                type : 'DIMENSION',
                categories : [
                    {id : 'id1a', label : 'enid1a', number : 0, state : 1},
                    {id : 'id1b', label : 'enid1b', number : 1, state : 1}
                ]
            },
            {
                id : 'id2',
                number : 1,
                label : "enid2",
                type : 'GEOGRAPHIC_DIMENSION',
                categories : [
                    {id : 'id2a', label : 'enid2a', number : 0, state : 1},
                    {id : 'id2b', label : 'enid2b', number : 1, state : 1}
                ]
            },
            {
                id : 'id3',
                number : 2,
                label : "enid3",
                type : 'TIME_DIMENSION',
                categories : [
                    {id : 'id3a', label : 'enid3a', number : 0, normCode : 'TIME1', state : 1},
                    {id : 'id3b', label : 'enid3b', number : 1, normCode : 'TIME2', state : 1},
                    {id : 'id3c', label : 'enid3c', number : 2, normCode : null, state : 1}
                ]
            }
        ];
        expect(filterOptions.getDimensions()).to.deep.equal(dimensions);
        expect(filterOptions.getLeftDimensions()).to.deep.equal([dimensions[0], dimensions[1]]);
        expect(filterOptions.getTopDimensions()).to.deep.equal([dimensions[2]]);
        expect(filterOptions.getFixedDimensions()).to.deep.equal([]);
    });

    it('should initialize dimensions position with metadata info', function () {
        sinon.stub(metadata, 'getDimensionsPosition').returns({top : ['id1'], left : ['id3', 'id2']});
        filterOptions = new FilterOptions({metadata : metadata});

        expect(_.pluck(filterOptions.getLeftDimensions(), "id")).to.deep.equal(["id3", "id2"]);
        expect(_.pluck(filterOptions.getTopDimensions(), "id")).to.deep.equal(["id1"]);
    });

    it("should sort the dimensions by the position", function () {
        expect(_.pluck(filterOptions.getLeftDimensions(), "id")).to.deep.equal(["id1", "id2"]);
        expect(_.pluck(filterOptions.getTopDimensions(), "id")).to.deep.equal(["id3"]);

        filterOptions.changeDimensionZone("id1", 'top');
        filterOptions.changeDimensionZone("id3", 'left');

        expect(_.pluck(filterOptions.getLeftDimensions(), "id")).to.deep.equal(["id2", "id3"]);
        expect(_.pluck(filterOptions.getTopDimensions(), "id")).to.deep.equal(["id1"]);
    });

    it("get dimension", function () {
        var dimension = filterOptions.getDimension('id1');
        expect(dimension).to.deep.equal({
            id : 'id1',
            number : 0,
            label : "enid1",
            type : 'DIMENSION',
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

        expect(filterOptions.getCategories('id1')).to.deep.equal(id1Categories);
        expect(filterOptions.getCategories(0)).to.deep.equal(id1Categories);

        expect(filterOptions.getCategories()).to.deep.equal([
            [
                {id : 'id1a', label : 'enid1a', number : 0, state : 1},
                {id : 'id1b', label : 'enid1b', number : 1, state : 1}
            ],
            [
                {id : 'id2a', label : 'enid2a', number : 0, state : 1},
                {id : 'id2b', label : 'enid2b', number : 1, state : 1}
            ],
            [
                {id : 'id3a', label : 'enid3a', number : 0, normCode : 'TIME1', state : 1},
                {id : 'id3b', label : 'enid3b', number : 1, normCode : 'TIME2', state : 1},
                {id : 'id3c', label : 'enid3c', number : 2, normCode : null, state : 1}
            ]
        ]);
    });

    it("get category", function () {
        var expected = {id : 'id1b', label : 'enid1b', number : 1, state : 1};
        expect(filterOptions.getCategory('id1', 'id1b')).to.deep.equal(expected);
        expect(filterOptions.getCategory(0, 1)).to.deep.equal(expected);
    });

    describe("toggleCategoryState", function () {

        it("should toggle category state", function () {
            var selected = filterOptions.getSelectedCategories(0);
            expect(selected.length).to.deep.equal(2);

            filterOptions.toggleCategoryState(0, 0);
            selected = filterOptions.getSelectedCategories(0);
            expect(selected.length).to.deep.equal(1);

            filterOptions.toggleCategoryState(0, 0);
            selected = filterOptions.getSelectedCategories(0);
            expect(selected.length).to.deep.equal(2);
        });

        it("should trigger change event", function () {
            var changeSpy = sinon.spy();
            filterOptions.on("change", changeSpy);
            filterOptions.toggleCategoryState(0, 0);
            expect(changeSpy.callCount).to.equal(1);
        });

    });

    describe("swap dimensions", function () {

        it("should swap dimensions zone", function () {
            filterOptions.swapDimensions(0, 2);

            expect(filterOptions.getLeftDimensions()[0].number).to.deep.equal(2);
            expect(filterOptions.getLeftDimensions()[1].number).to.deep.equal(1);
            expect(filterOptions.getTopDimensions()[0].number).to.deep.equal(0);
        });

        it("should exchange restrictions", function () {
            var leftDimension = filterOptions.getLeftDimensions()[0];
            var topDimension = filterOptions.getTopDimensions()[0];

            filterOptions.setSelectedCategoriesRestriction({left : 1, top : 2});
            expect(filterOptions._getDimension(leftDimension.number).restriction._restriction).to.deep.equal(1);
            expect(filterOptions._getDimension(topDimension.number).restriction._restriction).to.deep.equal(2);

            filterOptions.swapDimensions(leftDimension.number, topDimension.number);
            expect(filterOptions._getDimension(leftDimension.number).restriction._restriction).to.deep.equal(2);
            expect(filterOptions._getDimension(topDimension.number).restriction._restriction).to.deep.equal(1);
        });

        it("should launch only one change event", function () {
            filterOptions.changeDimensionZone(0, "fixed", true);

            var changeSpy = sinon.spy();
            filterOptions.on('change', changeSpy);
            filterOptions.swapDimensions(0, 2);
            expect(changeSpy.callCount).to.equal(1);
        });

    });

    it("get zone from position", function () {
        expect(filterOptions._getZoneFromPosition(-1)).to.be.undefined;
        expect(filterOptions._getZoneFromPosition(0)).to.deep.equal("left");
        expect(filterOptions._getZoneFromPosition(19)).to.deep.equal("left");
        expect(filterOptions._getZoneFromPosition(20)).to.deep.equal("top");
        expect(filterOptions._getZoneFromPosition(39)).to.deep.equal("top");
        expect(filterOptions._getZoneFromPosition(40)).to.deep.equal("fixed");
        expect(filterOptions._getZoneFromPosition(59)).to.deep.equal("fixed");
        expect(filterOptions._getZoneFromPosition(60)).to.be.undefined;
    });

    it("removeDimensionCurrentZone", function () {
        expect(filterOptions.getLeftDimensions().length).to.deep.equal(2);
        expect(filterOptions.getTopDimensions().length).to.deep.equal(1);

        filterOptions._removeDimensionCurrentZone(filterOptions._getDimension(0));
        expect(filterOptions.getLeftDimensions().length).to.deep.equal(1);
        expect(filterOptions.getTopDimensions().length).to.deep.equal(1);
        filterOptions._removeDimensionCurrentZone(filterOptions._getDimension(1));
        expect(filterOptions.getLeftDimensions().length).to.deep.equal(0);
        expect(filterOptions.getTopDimensions().length).to.deep.equal(1);

        filterOptions.dimensions[0].position = filterOptions.positionLimit.fixed.begin;
        expect(filterOptions.getFixedDimensions().length).to.deep.equal(1);
        filterOptions._removeDimensionCurrentZone(filterOptions._getDimension(0));
        expect(filterOptions.getFixedDimensions().length).to.deep.equal(0);
    });

    describe("changeDimensionZone", function () {

        //left [0, 1], top [2]
        describe("without restrictions", function () {
            it("to top", function () {
                filterOptions.changeDimensionZone(0, "top");
                expect({left : 1, top : 2, fixed : 0}).to.eql(getDimensionsLength());
            });

            it("to left", function () {
                filterOptions.changeDimensionZone(2, "left");
                expect({left : 3, top : 0, fixed : 0}).to.eql(getDimensionsLength());
            });

            it("to fixed", function () {
                filterOptions.changeDimensionZone(0, "fixed");
                expect({left : 1, top : 1, fixed : 1}).to.eql(getDimensionsLength());
            });

        });

        describe("with restriction", function () {

            // left [id1] top [id3] fixed [id2]
            beforeEach(function () {
                filterOptions.setZoneLengthRestriction({left : 1, top : 1});
                expect({left : 1, top : 1, fixed : 1}).to.eql(getDimensionsLength());
            });

            it("to top", function () {
                filterOptions.changeDimensionZone('id1', "top");
                expect({left : 1, top : 1, fixed : 1}).to.eql(getDimensionsLength());
                expect(filterOptions.getLeftDimensions()[0].id).to.eql('id3');
                expect(filterOptions.getTopDimensions()[0].id).to.eql('id1');
            });

            it("to left", function () {
                filterOptions.changeDimensionZone('id3', "left");
                expect({left : 1, top : 1, fixed : 1}).to.eql(getDimensionsLength());
                expect(filterOptions.getLeftDimensions()[0].id).to.eql('id3');
                expect(filterOptions.getTopDimensions()[0].id).to.eql('id1');
            });

            it("to fixed", function () {
                filterOptions.changeDimensionZone('id1', "fixed");
                expect({left : 1, top : 1, fixed : 1}).to.eql(getDimensionsLength());
                expect(filterOptions.getLeftDimensions()[0].id).to.equal('id2');
                expect(filterOptions.getFixedDimensions()[0].id).to.equal('id1');
            });

        });

        it("should launch only one change event", function () {
            var changeSpy = sinon.spy();
            filterOptions.on('change', changeSpy);
            filterOptions.changeDimensionZone('id1', "fixed");
            expect(changeSpy.callCount).to.equal(1);
        });

    });

    describe("zone length restriction", function () {

        it("should change dimensions zones", function () {
            expect(filterOptions.getLeftDimensions().length).to.deep.equal(2);
            expect(filterOptions.getTopDimensions().length).to.deep.equal(1);
            expect(filterOptions.getFixedDimensions().length).to.deep.equal(0);

            filterOptions.setZoneLengthRestriction({left : 2, top : 0});
            expect(filterOptions.getLeftDimensions().length).to.deep.equal(2);
            expect(filterOptions.getTopDimensions().length).to.deep.equal(0);
            expect(filterOptions.getFixedDimensions().length).to.deep.equal(1);

            filterOptions.setZoneLengthRestriction({left : 1, top : 0});
            expect(filterOptions.getLeftDimensions().length).to.deep.equal(1);
            expect(filterOptions.getTopDimensions().length).to.deep.equal(0);
            expect(filterOptions.getFixedDimensions().length).to.deep.equal(2);
        });

        it("should use the firsts posisionts", function () {
            filterOptions.setZoneLengthRestriction({left : 1, top : 1});
            var leftDimensions = filterOptions.getLeftDimensions();
            var topDimensions = filterOptions.getTopDimensions();
            var leftDimension = filterOptions._getDimension(leftDimensions[0].number);
            var topDimension = filterOptions._getDimension(topDimensions[0].number);
            expect(leftDimensions.length).to.deep.equal(1);
            expect(topDimensions.length).to.deep.equal(1);
            expect(leftDimension.position).to.deep.equal(filterOptions.positionLimit.left.begin);
            expect(topDimension.position).to.deep.equal(filterOptions.positionLimit.top.begin);
        });

        it("from pie to bar", function () {
            filterOptions.setZoneLengthRestriction({left : 1, top : 0});
            filterOptions.setZoneLengthRestriction({left : 1, top : 1});

            var leftDimensions = filterOptions.getLeftDimensions();
            var topDimensions = filterOptions.getTopDimensions();
            var leftDimension = filterOptions._getDimension(leftDimensions[0].number);
            var topDimension = filterOptions._getDimension(topDimensions[0].number);
            expect(leftDimensions.length).to.deep.equal(1);
            expect(topDimensions.length).to.deep.equal(1);
            expect(leftDimension.position).to.deep.equal(filterOptions.positionLimit.left.begin);
            expect(topDimension.position).to.deep.equal(filterOptions.positionLimit.top.begin);
        });

        it("should set restriction with type", function () {
            filterOptions.setZoneLengthRestriction({left : {value : 1, type : "GEOGRAPHIC_DIMENSION"}, top : 0});
            var leftDimensions = filterOptions.getLeftDimensions();
            var topDimensions = filterOptions.getTopDimensions();
            var leftDimension = filterOptions._getDimension(leftDimensions[0].number);
            expect(leftDimensions.length).to.deep.equal(1);
            expect(topDimensions.length).to.deep.equal(0);
            expect(leftDimension.id).to.deep.equal("id2");
        });

        it("should set prefered restriction if has one", function () {
            filterOptions.setZoneLengthRestriction({left : {value : 1, preferedType : "GEOGRAPHIC_DIMENSION"}, top : 0});
            var leftDimensions = filterOptions.getLeftDimensions();
            var topDimensions = filterOptions.getTopDimensions();
            var leftDimension = filterOptions._getDimension(leftDimensions[0].number);
            var fixedDimensions = filterOptions.getFixedDimensions();
            expect(leftDimensions.length).to.deep.equal(1);
            expect(topDimensions.length).to.deep.equal(0);
            expect(fixedDimensions.length).to.deep.equal(2);
            expect(leftDimension.id).to.deep.equal("id2");
        });

        it("should set any type if no prefered type restriction", function () {
            filterOptions.setZoneLengthRestriction({left : 0, top : {value : 1, preferedType : "TIME_DIMENSION"}});
            var leftDimensions = filterOptions.getLeftDimensions();
            var topDimensions = filterOptions.getTopDimensions();
            var topDimension = filterOptions._getDimension(topDimensions[0].number);
            var fixedDimensions = filterOptions.getFixedDimensions();
            expect(leftDimensions.length).to.deep.equal(0);
            expect(topDimensions.length).to.deep.equal(1);
            expect(topDimension.id).to.deep.equal("id3");
            expect(fixedDimensions.length).to.deep.equal(2);
        });

    });

    describe("set selected categories restriction", function () {

        it("simple case", function () {
            expect(filterOptions.getSelectedCategories(0).length).to.deep.equal(2);
            filterOptions.setSelectedCategoriesRestriction({left : 1});
            expect(filterOptions.getSelectedCategories(0).length).to.deep.equal(1);
            filterOptions.setSelectedCategoriesRestriction({left : 50});
            expect(filterOptions.getSelectedCategories(0).length).to.deep.equal(1);
        });

        it("should select most recent value selected if dimension is temporal and it's in fixed zone", function () {
            expect(filterOptions.getSelectedCategories(2).length).to.deep.equal(3);

            filterOptions.changeDimensionZone(2, "fixed", true);

            expect(filterOptions.getSelectedCategories(2).length).to.deep.equal(1);
            var selectedCategory = filterOptions.getSelectedCategories(2)[0];
            expect(selectedCategory.normCode).to.deep.equal('TIME2');
        });

    });

    it("should clone", function () {
        filterOptions.setSelectedCategoriesRestriction({left : 2, top : 5});

        var cloned = filterOptions.clone();

        expect(cloned.dimensions).not.equal(filterOptions.dimensions);
        expect(cloned.dimensionsMap).not.equal(filterOptions.dimensionsMap);

        expect(cloned.positionLimit).to.deep.equal(filterOptions.positionLimit);
        expect(cloned.positionLimit).not.equal(filterOptions.positionLimit);

        expect(cloned.metadata).to.equal(filterOptions.metadata);

        expect(cloned._selectedCategoriesRestriction).to.deep.equal(filterOptions._selectedCategoriesRestriction);
        expect(cloned._selectedCategoriesRestriction).not.equal(filterOptions._selectedCategoriesRestriction);

        for (var i = 0; i < cloned.dimensions.length; i++) {
            var clonedDim = cloned.dimensions[i];
            var dim = filterOptions.dimensions[i];
            expect(clonedDim).not.equal(dim);

            for (var j = 0; j < clonedDim.representations.length; j++) {
                var clonedRepresentation = clonedDim.representations[j];
                var representation = dim.representations[j];
                expect(clonedRepresentation).not.equal(representation);
            }

            expect(clonedDim.restriction).not.equal(dim.restriction);
        }

        //Table Info
        expect(cloned.tableInfo).not.equal(filterOptions.tableInfo);
        _.each(["ids", "representationsValues", "representationsIds", "representationsLengths", "representationsMult"],
            function (prop) {
                expect(cloned.tableInfo.left[prop]).not.equal(filterOptions.tableInfo.left[prop]);
            }
        );

        expect(cloned).not.equal(filterOptions);

    });

    describe("selection", function () {

        var selection = {
            id1 : {
                position : 21,
                selectedCategories : ['id1a', 'id1b']
            },
            id2 : {
                position : 0,
                selectedCategories : ['id2a', 'id2b']
            },
            id3 : {
                position : 20,
                selectedCategories : ['id3a', 'id3b']
            }
        };

        it("export", function () {
            filterOptions.changeDimensionZone(0, "top");
            var selection = filterOptions.exportSelection();
            expect(selection).to.deep.equal(selection);
        });

        it("import", function () {
            filterOptions.importSelection(selection);
            expect(filterOptions.getLeftDimensions().length).to.deep.equal(1);
            expect(filterOptions.getTopDimensions().length).to.deep.equal(2);
        });

    });

    describe("should proxy events", function () {
        it("when toggleSelectedCategories", function () {
            var spy = sinon.spy();
            filterOptions.on("unselect:dimension:id1:category:id1a", spy);
            filterOptions.toggleCategoryState(0, 0);
            expect(spy.called).to.be.true;
        });
    });

});
