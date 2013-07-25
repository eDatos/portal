describe("SelectableCollection", function () {

    var selectableCollection;

    beforeEach(function () {
        var TestCollection = Backbone.Collection.extend({});
        _.extend(TestCollection.prototype, App.mixins.SelectableCollection);
        selectableCollection = new TestCollection([{name : "luke"}, {name : "yoda"}]);
    });


    it("should select all models", function () {
        selectableCollection.selectAll();
        expect(selectableCollection.areAllSelected()).to.be.true;
    });

    it("should select all models", function () {
        selectableCollection.selectAll();
        selectableCollection.unselectAll();
        expect(selectableCollection.areAllSelected()).to.be.false;
    });

    it("should toggle all selection", function () {
        selectableCollection.selectAll();
        selectableCollection.toggleAllSelection();
        expect(selectableCollection.areAllSelected()).to.be.false;
        selectableCollection.toggleAllSelection();
        expect(selectableCollection.areAllSelected()).to.be.true;
    });

});