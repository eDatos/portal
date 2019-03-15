describe('FilterDimension', function () {

    var FilterRepresentation = App.modules.dataset.filter.models.FilterRepresentation;
    var filterDimension, representations;

    beforeEach(function () {
        var datasourceIdentificer = new App.datasource.DatasourceIdentifier(App.test.metadata.identifier);
        var datasetHelper = new App.datasource.helper.DatasetHelper();
        var metadata = new App.datasource.model.MetadataResponse({ datasourceIdentifier: datasourceIdentificer, datasourceHelper: datasetHelper, response: App.test.response.metadata});
        var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        filterDimension = filterDimensions.get('TIME_PERIOD');
        representations = filterDimension.get('representations');
    });

    describe('when filterQuery change', function () {

        it('should set visible only models that match with the query and its parents', function () {
            representations.invoke('set', { visible: true });
            filterDimension.set({ filterQuery: 'time 2' });

            var visibleModels = representations.where({ visible: true });
            expect(visibleModels.length).to.equal(4);
            expect(visibleModels[0].id).to.equal('time_2');
        });

        it('should show all models if query is empty', function () {
            representations.invoke('set', { visible: false });
            filterDimension.set({ filterQuery: 'a' });
            filterDimension.set({ filterQuery: '' });

            var visibleModels = representations.where({ visible: true });
            expect(visibleModels.length).to.equal(representations.models.length);
        });

        it('should compare labels case insensitive', function () {
            representations.invoke('set', { visible: true });
            filterDimension.set({ filterQuery: 'TIME 2' });

            var visibleModels = representations.where({ visible: true });
            expect(visibleModels.length).to.equal(4);
            expect(visibleModels[0].id).to.equal('time_2');
        });

        it('should set match index in model', function () {
            filterDimension.set({ filterQuery: '2' });
            var time1 = representations.get('time_1');
            var time2 = representations.get('time_2');

            expect(time2.get('matchIndexBegin')).to.equal(5);
            expect(time2.get('matchIndexEnd')).to.equal(6);

            expect(time1.get('matchIndexBegin')).to.be.undefined;
            expect(time1.get('matchIndexEnd')).to.be.undefined;

            var time_22 = representations.get('time_2_2');
            expect(time_22.get('matchIndexBegin')).to.equal(5);
            expect(time_22.get('matchIndexEnd')).to.equal(6);

        });

        it('should set visible all parents when a model match', function () {
            filterDimension.set({ filterQuery: 'Time 2 2 1' });

            var visibleModels = representations.where({ visible: true });
            expect(visibleModels.length).to.equal(3);
            expect(representations.get('time_2').get('visible')).to.be.true;
            expect(representations.get('time_2_2').get('visible')).to.be.true;
            expect(representations.get('time_2_2_1').get('visible')).to.be.true;
        });

        it('should reset the filterLevel', function () {
            filterDimension.set({ filterLevel: 1 });
            filterDimension.set({ filterQuery: 'randomQuery' });
            expect(filterDimension.get('filterLevel')).to.be.undefined;
        });

    });

    describe('when filterLevel change', function () {

        var expectVisible = function (id) {
            return expect(representations.get(id).get('visible'));
        };

        it('should hide representations with level lower than the selected level', function () {
            filterDimension.set({ filterLevel: 1 });

            expectVisible('time_1').to.be.false;
            expectVisible('time_2_2').to.be.true;
            expectVisible('time_2_2_1').to.be.false;
        });

        it('should collapse all visible representations', function () {
            filterDimension.set({ filterLevel: 1 });
            expect(representations.get('time_2_2').get('open')).to.be.false;
        });

        it('should show and open all elements if the new value is undefined', function () {
            filterDimension.set({ filterLevel: 1 });
            filterDimension.set({ filterLevel: undefined });
            var representations = filterDimension.get('representations');

            var openVisibleRepresentations = representations.where({ visible: true, open: true });
            expect(openVisibleRepresentations.length).to.equal(representations.length);
        });

        it('should reset the filter query', function () {
            filterDimension.set({ filterQuery: 'randomQuery' });
            filterDimension.set({ filterLevel: 1 });
            expect(filterDimension.get('filterQuery')).to.equal('');
        });

    });

    describe("when visibleLabelType change", function () {
        it('should set visibleLabelType on each filterRepresentation', function () {
            filterDimension.set("visibleLabelType", FilterRepresentation.VISIBLE_LABEL_TYPES.CODE);
            representations.each(function (representation) {
                expect(representation.get("visibleLabelType")).to.equal(FilterRepresentation.VISIBLE_LABEL_TYPES.CODE);
            });
        });
    });

});