describe("FilterOptionsDimensionRestriction", function () {

    var restriction;
    var options;
    beforeEach(function () {
        options = {
            categories : ['a', 'b', 'c', 'd']
        };
        restriction = new App.widget.FilterOptionsDimensionRestriction(options);
    });

    it("should toggle a category", function () {
        expect(restriction.isCategorySelected('a')).to.be.true;
        restriction.toggleCategorySelection('a');
        expect(restriction.isCategorySelected('a')).to.be.false;
        restriction.toggleCategorySelection('a');
        expect(restriction.isCategorySelected('a')).to.be.true;
    });

    it("should have at least one element", function () {
        restriction.toggleCategorySelection('a');
        restriction.toggleCategorySelection('b');
        restriction.toggleCategorySelection('c');

        expect(restriction.count()).to.equal(1);
        restriction.toggleCategorySelection('d');
        expect(restriction.count()).to.equal(1);
    });

    it("should apply the restriction when restriction update", function () {
        expect(restriction.isCategorySelected('a')).to.be.true;
        expect(restriction.isCategorySelected('b')).to.be.true;
        expect(restriction.isCategorySelected('c')).to.be.true;
        expect(restriction.isCategorySelected('d')).to.be.true;
        restriction.setRestriction(1);
        expect(restriction.isCategorySelected('a')).to.be.true;
        expect(restriction.isCategorySelected('b')).to.be.false;
        expect(restriction.isCategorySelected('c')).to.be.false;
        expect(restriction.isCategorySelected('d')).to.be.false;
    });

    it("should deselect in order when toggle", function () {
        restriction.setRestriction(1);
        expect(restriction.isCategorySelected('a')).to.be.true;
        restriction.toggleCategorySelection('b');
        expect(restriction.isCategorySelected('b')).to.be.true;
        expect(restriction.isCategorySelected('a')).to.be.false;
        restriction.toggleCategorySelection('c');
        expect(restriction.isCategorySelected('c')).to.be.true;
        expect(restriction.isCategorySelected('b')).to.be.false;
    });

    it("should clone", function () {
        var cloned = restriction.clone();
        expect(cloned._selectedCategories).to.deep.equal(restriction._selectedCategories);
        expect(cloned._selectedCategories).not.equal(restriction._selectedCategories);
        expect(cloned._categories).to.deep.equal(restriction._selectedCategories);
        expect(cloned._categories).not.equal(restriction._categories);
    });

    it("should select all and unselect all", function () {
        expect(restriction.count()).to.equal(4);
        restriction.unselectAll();
        expect(restriction.count()).to.equal(1);
        restriction.selectAll();
        expect(restriction.count()).to.equal(4);

        restriction.setRestriction(2);
        expect(restriction.count()).to.equal(2);
        restriction.selectAll();
        expect(restriction.count()).to.equal(2);
    });

    it("should know if all categories are selected", function () {
        expect(restriction.areAllSelected()).to.be.true;
        restriction.unselectAll();
        expect(restriction.areAllSelected()).to.be.false;
        restriction.selectAll();
        expect(restriction.areAllSelected()).to.be.true;

        restriction.setRestriction(2);
        expect(restriction.areAllSelected()).to.be.true;
        restriction.unselectAll();
        expect(restriction.areAllSelected()).to.be.false;

        restriction.setRestriction(200);
        restriction.selectAll();
        expect(restriction.areAllSelected()).to.be.true;
    });

    it("should set restriction with priority order", function () {
        restriction.setRestrictionWithPriorityOrder(1, ['b', 'd']);
        expect(restriction.count()).to.equal(1);
        expect(restriction.isCategorySelected('d')).to.be.true;
    });

    it("should select a list of categories", function () {
        restriction.unselectAll();
        expect(restriction.getSelectedCategories()).to.eql(['a']);
        restriction.select(['a', 'b']);
        expect(restriction.getSelectedCategories()).to.eql(['a', 'b']);
    });

    describe("should unselect a list of categories", function () {
        it("when there is more elements selected", function () {
            restriction.unselect(['b', 'c']);
            expect(restriction.getSelectedCategories()).to.eql(['a', 'd']);
        });

        it("but let at least one element in the list", function () {
            restriction.unselect(['b', 'c', 'a', 'd']);
            expect(restriction.getSelectedCategories()).to.eql(['a']);
        });

    });

    describe("should trigger events when", function () {

        describe("set selected categories", function () {
            it("select", function () {
                var spy = new sinon.spy();
                restriction.unselectAll();
                restriction.on("select:c", spy);
                restriction.setSelectedCategories(['a', 'c']);
                expect(spy.called).to.be.true;
            });

            it("unselect", function () {
                var spy = new sinon.spy();
                restriction.setSelectedCategories(['a', 'c']);
                restriction.on("unselect:a", spy);
                restriction.setSelectedCategories(['c']);
                expect(spy.called).to.be.true;
            });
        });

        describe("set restriction", function () {
            it("unselect", function () {
                var spy = new sinon.spy();
                restriction.on("unselect:c", spy);
                restriction.setRestriction(1);
                expect(spy.called).to.be.true;
            });
        });

        describe("set restriction with priority order", function () {
            it("unselect", function () {
                var spy = new sinon.spy();
                restriction.on("unselect:b", spy);
                restriction.setRestrictionWithPriorityOrder(1, ['b', 'd']);
                expect(restriction.count()).to.equal(1);
                expect(restriction.isCategorySelected('d')).to.be.true;
            });
        });

        describe("toggleCategorySelection", function () {
            it("select", function () {
                var spy = new sinon.spy();
                restriction.toggleCategorySelection('a');
                restriction.on("select:a", spy);
                restriction.toggleCategorySelection('a');
                expect(spy.called).to.be.true;
            });

            it("unselect", function () {
                var spy = new sinon.spy();
                restriction.on("unselect:a", spy);
                restriction.toggleCategorySelection('a');
                expect(spy.called).to.be.true;
            });
        });


        describe("unselectAll", function () {

            it("should unselect all", function () {
                restriction.unselectAll();
                expect(restriction.getSelectedCategories()).to.eql(['a']);
            });

            it("if the dimension is temporal should keep the most recent value", function () {
                restriction.unselectAll(true);
                expect(restriction.getSelectedCategories()).to.eql(['d']);
            });

            it("should trigger event for unselected categories", function () {
                var spy = new sinon.spy();
                restriction.on("unselect:b", spy);
                restriction.unselectAll();
                expect(spy.called).to.be.true;
            });

        });

        it("select all", function () {
            var spy = new sinon.spy();
            restriction.unselectAll();
            restriction.on("select:b", spy);
            restriction.selectAll();
            expect(spy.called).to.be.true;
        });

    });

});
