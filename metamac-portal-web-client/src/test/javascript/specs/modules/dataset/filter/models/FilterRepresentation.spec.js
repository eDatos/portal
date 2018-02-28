var FilterRepresentation = App.modules.dataset.filter.models.FilterRepresentation;

describe('FilterRepresentation', function () {

    var filterRepresentation, child1, child2;

    beforeEach(function () {
        child1 = new FilterRepresentation();
        child2 = new FilterRepresentation();
        filterRepresentation = new FilterRepresentation({id : "id1", label : "label1"});
        filterRepresentation.children.reset([child1, child2]);
    });

    describe('_updateChildrenSelected', function () {

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

    describe("visibleLabelType", function () {

        it('should configure visibleLabel on initialize to default value -> label', function () {
            expect(filterRepresentation.get("visibleLabel")).to.equal("label1");
        });

        describe('should change visibleLabel when change visibleLabelType', function () {
            it('to id', function () {
                filterRepresentation.set("visibleLabelType", FilterRepresentation.VISIBLE_LABEL_TYPES.CODE);
                expect(filterRepresentation.get("visibleLabel")).to.equal("id1");
            });

            it('to label', function () {
                filterRepresentation.set("visibleLabelType", FilterRepresentation.VISIBLE_LABEL_TYPES.LABEL);
                expect(filterRepresentation.get("visibleLabel")).to.equal("label1");
            });

            it('to idLabel', function () {
                filterRepresentation.set("visibleLabelType", FilterRepresentation.VISIBLE_LABEL_TYPES.CODE_AND_LABEL);
                expect(filterRepresentation.get("visibleLabel")).to.equal("id1 - label1");
            });

        });
    });

    describe('toggleMeAndMyChildren', function () {

        it('should deselect filterRepresentation and his children', function () {
            filterRepresentation.set("selected", false);
            child1.set("selected", true);
            child2.set("selected", false);

            filterRepresentation.toggleMeAndMyChildren("selected");

            expect(filterRepresentation.get("selected")).to.be.true;
            expect(child1.get("selected")).to.be.true;
            expect(child2.get("selected")).to.be.true;
        });

    });

});