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

        it('should set childrenSelected to true if a children is selected', function () {
            child1.set({selected : false, childrenSelected : false});
            child1.set({selected : true, childrenSelected : false});
            expect(filterRepresentation.get('childrenSelected')).to.be.true;
        });

        it('should set childrenSelected to false if all children are not selected', function () {
            child1.set({selected : false, childrenSelected : false});
            child2.set({selected : false, childrenSelected : false});
            expect(filterRepresentation.get('childrenSelected')).to.be.false;
        });

        it('should set childrenSelected to true if any child has childrenSelected', function () {
            child1.set({selected : false, childrenSelected : false});
            child2.set({selected : false, childrenSelected : true});

            expect(filterRepresentation.get('childrenSelected')).to.be.true;
        });

    });

});