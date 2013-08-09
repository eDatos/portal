describe('FilterRepresentations', function () {

    var filterRepresentations, r1, r2, r3;

    beforeEach(function () {
        var representations = [
            {id : 'r1', label : 'Representation 1', order : 1},
            {id : 'r2', label : 'Representation 2', order : 2},
            {id : 'r3', label : 'Representation 3', order : 3},
            {id : 'r2.1', label : 'Representation 2.1', order : 1, parent : 'r2'},
            {id : 'r2.2', label : 'Representation 2.2', order : 2, parent : 'r2'},
            {id : 'r2.1.2', label : 'Representation 2.1.2', order : 1, parent : 'r2.1'}
        ];
        filterRepresentations = App.modules.dataset.filter.models.FilterRepresentations.initializeWithRepresentations(representations);
        r1 = filterRepresentations.get('r1');
        r2 = filterRepresentations.get('r2');
        r3 = filterRepresentations.get('r3');
    });

    describe('initialize', function () {

        it('should complete models with level and order by depth and level', function () {
            var levels = filterRepresentations.invoke('pick', 'id', 'level');
            expect(levels).to.eql([
                {id : 'r1', level : 0},
                {id : 'r2', level : 0},
                {id : 'r2.1', level : 1},
                {id : 'r2.1.2', level : 2},
                {id : 'r2.2', level : 1},
                {id : 'r3', level : 0}
            ]);
        });

        it('should set children of models', function () {
            expect(r1.children.length).to.equal(0);
            expect(r2.children.length).to.equal(2);
        });

        it('should initialize hasHierarchy property', function () {
            expect(filterRepresentations.hasHierarchy).to.be.true;
        });

    });

    describe('selectVisible', function () {

        it('should select all visible elements', function () {
            filterRepresentations.invoke('set', {visible : false});
            r1.set({visible : true, selected : false});

            filterRepresentations.selectVisible();
            expect(filterRepresentations.where({selected : true}).length).to.equal(filterRepresentations.length);
        });

        it('should select until reach limit', function () {
            var limit = 2;
            filterRepresentations.invoke('set', {selected : false, visible : true});
            filterRepresentations.setSelectedLimit(limit);
            filterRepresentations.selectVisible();
            expect(filterRepresentations.where({selected : true}).length).to.equal(limit);
        });

    });

    describe('deselectVisible', function () {
        it('should leave at least one model selected', function () {
            filterRepresentations.invoke('set', {selected : true, visible : true});
            filterRepresentations.deselectVisible();
            expect(filterRepresentations.where({selected : true}).length).to.equal(1);
        });

        it('should leave at least one model selected', function () {
            filterRepresentations.invoke('set', {selected : false, visible : true});
            r1.set('selected', true);
            filterRepresentations.deselectVisible();
            expect(filterRepresentations.where({selected : true}).length).to.equal(1);
        });

    });

    describe('setSelectedLimit', function () {
        it('should deselect models if there are more elements selected than the model', function () {
            var limit = 2;
            filterRepresentations.invoke('set', {selected : true});
            filterRepresentations.setSelectedLimit(limit);
            expect(filterRepresentations.where({selected : true}).length).to.equal(2);
        });
    });

    describe('toggleRepresentationsVisibleRange', function () {

        it('should toggle selected range', function () {
            r2.set('open', false);
            filterRepresentations.deselectVisible();

            filterRepresentations.toggleRepresentationsVisibleRange(0, 2, true);
            var allSelected = _.chain([r1, r2, r3]).invoke('get', 'selected').every().value();
            expect(allSelected).to.be.true;
        });

        it('should toggle deselected range', function () {
            r2.set('open', false);
            filterRepresentations.toggleRepresentationsVisibleRange(0, 2, false);
            var allSelected = _.chain([r1, r2, r3]).invoke('get', 'selected').any().value();
            expect(allSelected).to.be.false;
        });

        it('should toggle selected range until reach the selection limit', function () {
            filterRepresentations.deselectVisible();
            r2.set('open', false);
            filterRepresentations.setSelectedLimit(2);

            filterRepresentations.toggleRepresentationsVisibleRange(0, 2, true);

            var selected = _.invoke([r1, r2, r3], 'get', 'selected');
            expect(selected).to.eql([false, true, true]);
        });

    });

    describe('on models change selected', function () {

        it('should not deselect if is the last model', function () {
            filterRepresentations.deselectVisible();
            r1.set({selected : false});
            expect(r1.get('selected')).to.be.true;
        });

        it('should change a model is is over the limit', function () {
            filterRepresentations.selectVisible();
            filterRepresentations.setSelectedLimit(1);
            expect(r1.get('selected')).to.be.true;
            expect(r2.get('selected')).to.be.false;
            r2.set('selected', true);
            expect(r1.get('selected')).to.be.false;
            expect(r2.get('selected')).to.be.true;
        });

    });

    describe('on model close', function () {
        it('should hide children in all levels', function () {
            r2.set('open', false);
            expect(filterRepresentations.get('r2.1').get('visible')).to.be.false;
            expect(filterRepresentations.get('r2.1.2').get('visible')).to.be.false;
        });
    });

    describe('on model open', function () {
        it('should set visible all children', function () {
            r2.set('open', false);
            r2.set('open', true);
            expect(filterRepresentations.get('r2.1').get('visible')).to.be.true;
        });

        it('should set visible descendent if opened', function () {
            r2.set('open', false);
            r2.set('open', true);
            expect(filterRepresentations.get('r2.1').get('visible')).to.be.true;
            expect(filterRepresentations.get('r2.1.2').get('visible')).to.be.true;
        });

        it('should not set visible descendent not opened', function () {
            filterRepresentations.get('r2.1').set('open', false);
            r2.set('open', false);
            r2.set('open', true);
            expect(filterRepresentations.get('r2.1').get('visible')).to.be.true;
            expect(filterRepresentations.get('r2.1.2').get('visible')).to.be.false;
        });

    });

});