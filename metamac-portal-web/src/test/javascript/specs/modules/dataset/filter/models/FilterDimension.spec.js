describe('FilterDimension', function () {

    var filterDimension;

    beforeEach(function () {
        var metadata = new App.dataset.Metadata(App.test.response.metadata);
        var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        filterDimension = filterDimensions.at(0);
    });

    describe('filterQuery', function () {

        it('onChange it should call representations setVisibleQuery', function () {
            var spy = sinon.spy();
            filterDimension.get('representations').setVisibleQuery = spy;
            var query = "query";
            filterDimension.set('filterQuery', query);
            expect(spy.calledWith(query)).to.be.true;
        });

    });

});