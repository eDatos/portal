describe("Dataset Attributes", function () {

    var attributes;
    var metadata;
    var apiResponse;

    beforeEach(function () {

        metadata = new App.dataset.Metadata();
        metadata.parse(App.test.response.metadata);
        apiResponse = new App.dataset.data.ApiResponse(App.test.response.data, metadata);

        attributes = apiResponse.attributes;
    });

    it('should hasAttributes', function () {
        expect(attributes.hasAttributes()).to.eql(true);
    });

    it('getDatasetAttributes should return the correct number of dataset attributes', function () {
        expect(attributes.getDatasetAttributes().length).to.eql(2);
    });

});