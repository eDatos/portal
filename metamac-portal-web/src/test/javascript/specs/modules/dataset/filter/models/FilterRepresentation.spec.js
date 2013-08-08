var FilterRepresentation = App.modules.dataset.filter.models.FilterRepresentation;

describe('FilterRepresentation', function () {

    describe('_updateChildrenSelected', function () {

        var filterRepresentation, child1, child2;

        beforeEach(function () {
            child1 = new FilterRepresentation();
            child2 = new FilterRepresentation();
            filterRepresentation = new FilterRepresentation();
            filterRepresentation.children.reset([child1, child2]);
        });

        it('should set childrenSelected to true if all children are selected', function () {
            filterRepresentation._updateChildrenSelected();
            expect(filterRepresentation.get('childrenSelected')).to.be.true;
        });

        it('should set childrenSelected to false if any child is not selected', function () {
            child1.set('selected', false);
            expect(filterRepresentation.get('childrenSelected')).to.be.false;
        });

        it('should set childrenSelected to false if any child hasnt all children selected ', function () {
            child1.set('childrenSelected', false);
            expect(filterRepresentation.get('childrenSelected')).to.be.false;
        });

    });

});