describe("FilterOptionsDimensionRestriction", function () {

    var restriction;
    var options;
    beforeEach(function () {
        options = {
            categories : ['a', 'b', 'c', 'd']
        };
        restriction = new STAT4YOU.widget.FilterOptionsDimensionRestriction(options);
    });

    it("should toggle a category", function () {
        expect(restriction.isCategorySelected('a')).toBeTruthy();
        restriction.toggleCategorySelection('a');
        expect(restriction.isCategorySelected('a')).toBeFalsy();
        restriction.toggleCategorySelection('a');
        expect(restriction.isCategorySelected('a')).toBeTruthy();
    });

    it("should have at least one element", function () {
        restriction.toggleCategorySelection('a');
        restriction.toggleCategorySelection('b');
        restriction.toggleCategorySelection('c');

        expect(restriction.count()).toEqual(1);
        restriction.toggleCategorySelection('d');
        expect(restriction.count()).toEqual(1);
    });

    it("should apply the restriction when restriction update", function () {
        expect(restriction.isCategorySelected('a')).toBeTruthy();
        expect(restriction.isCategorySelected('b')).toBeTruthy();
        expect(restriction.isCategorySelected('c')).toBeTruthy();
        expect(restriction.isCategorySelected('d')).toBeTruthy();
        restriction.setRestriction(1);
        expect(restriction.isCategorySelected('a')).toBeTruthy();
        expect(restriction.isCategorySelected('b')).toBeFalsy();
        expect(restriction.isCategorySelected('c')).toBeFalsy();
        expect(restriction.isCategorySelected('d')).toBeFalsy();
    });

    it("should deselect in order when toggle", function () {
        restriction.setRestriction(1);
        expect(restriction.isCategorySelected('a')).toBeTruthy();
        restriction.toggleCategorySelection('b');
        expect(restriction.isCategorySelected('b')).toBeTruthy();
        expect(restriction.isCategorySelected('a')).toBeFalsy();
        restriction.toggleCategorySelection('c');
        expect(restriction.isCategorySelected('c')).toBeTruthy();
        expect(restriction.isCategorySelected('b')).toBeFalsy();
    });

    it("should clone", function () {
        var cloned = restriction.clone();
        expect(cloned).toEqual(restriction);
        expect(cloned._selectedCategories).not.toBe(restriction._selectedCategories);
        expect(cloned._categories).not.toBe(restriction._categories);
    });

    it("should select all and unselect all", function () {
        expect(restriction.count()).toEqual(4);
        restriction.unselectAll();
        expect(restriction.count()).toEqual(1);
        restriction.selectAll();
        expect(restriction.count()).toEqual(4);

        restriction.setRestriction(2);
        expect(restriction.count()).toEqual(2);
        restriction.selectAll();
        expect(restriction.count()).toEqual(2);
    });

    it("should know if all categories are selected", function () {
        expect(restriction.areAllSelected()).toBeTruthy();
        restriction.unselectAll();
        expect(restriction.areAllSelected()).toBeFalsy();
        restriction.selectAll();
        expect(restriction.areAllSelected()).toBeTruthy();

        restriction.setRestriction(2);
        expect(restriction.areAllSelected()).toBeTruthy();
        restriction.unselectAll();
        expect(restriction.areAllSelected()).toBeFalsy();

        restriction.setRestriction(200);
        restriction.selectAll();
        expect(restriction.areAllSelected()).toBeTruthy();
    });
});
