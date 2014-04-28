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

    describe('should getCombinatedDimensionsAttributesByDimensionsPositions', function () {

        it('([0, 0, 0, 0])[6] should return the first value for the at12 attribute', function () {
             expect(attributes.getCombinatedDimensionsAttributesByDimensionsPositions([0, 0, 0, 0])[6]).to.eql('T1 Gran Canaria');         
        });
        
        it('([0, 0, 0, 1])[6] should return the second value for the at12 attribute', function () {
             expect(attributes.getCombinatedDimensionsAttributesByDimensionsPositions([0, 0, 0, 1])[6]).to.eql('T1 Lanzarote');         
        });

        it('([0, 28, 0, 1])[6] should return the second value for the at12 attribute', function () {
             expect(attributes.getCombinatedDimensionsAttributesByDimensionsPositions([0, 28, 0, 1])[6]).to.eql('T1 Lanzarote');         
        });

        it('([1, 0, 0, 0])[6] should return the value number 8 for the at12 attribute', function () {
             expect(attributes.getCombinatedDimensionsAttributesByDimensionsPositions([1, 0, 0, 0])[6]).to.eql('T2 Gran Canaria');         
        });

        it('([0, 0, 0, 2])[6] should return the third value for the at12 attribute, a enumerate', function () {
             expect(attributes.getCombinatedDimensionsAttributesByDimensionsPositions([0, 0, 0, 2])[6]).to.eql('Enumerado t1 fuerteventura');         
        });
    });
});