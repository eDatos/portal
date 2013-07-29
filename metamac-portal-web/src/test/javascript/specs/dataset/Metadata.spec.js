describe("Dataset Metadata", function () {

    var Metadata = App.dataset.Metadata;
    var metadata;

    beforeEach(function () {
        metadata = new Metadata(App.test.response.metadata);
    });

    it('should getIdentifier', function () {
        expect(metadata.getIdentifier()).to.eql('dataset-identifier-01');
    });

    it('should getLanguages', function () {
        expect(metadata.getLanguages()).to.eql({
            id : ['es', 'en'],
            label : {
                es : 'Español',
                en : 'Ingles'
            }
        });
    });

    it('should getProvider', function () {
        expect(metadata.getProvider()).to.eql('ISTAC');
    });

    it('should getTitle', function () {
        expect(metadata.getTitle()).to.eql('Título en español')
    });

    it('should getDescription', function () {
        expect(metadata.getDescription()).to.eql('Descripción en español');
    });

    it.skip('should getLicense', function () {
        expect(metadata.getLicense()).to.eql('Licencia en Español')
    });

    it.skip('should getLicenseUrl', function () {

    });

    it.skip('should getPublisher', function () {

    });

    it('should getUri', function () {
        expect(metadata.getUri()).to.eql('urn:siemac:org.siemac.metamac.infomodel.statisticalresources.Dataset=ISTAC:dataset01(001.000)')
    });

    it('should getDimensions', function () {
        //TODO hierarchy
        expect(metadata.getDimensions()).to.eql([
            { id : 'dimension1', label : 'dimension 1', type : "DIMENSION", hierarchy : false},
            { id : 'dimension2', label : 'dimension 2', type : "MEASURE_DIMENSION", hierarchy : false},
            { id : 'dimension3', label : 'dimension 3', type : "TIME_DIMENSION", hierarchy : false},
            { id : 'dimension4', label : 'dimension 4', type : "GEOGRAPHIC_DIMENSION", hierarchy : false}
        ]);
    });

    it('should getRepresentation', function () {
        //todo test normcode and parent
        expect(metadata.getRepresentations('dimension3')).to.eql(
            [
                {id : '2012', label : 'Año 2012'},
                {id : '2011', label : 'Año 2011'},
                {id : '2010', label : 'Año 2010'}
                //{id : 'id1b', label : 'enid1b', normCode : 'NORMCODE_2', parent : 'id1a'}
            ]
        );
    });

    it('should getDimensionsAndRepresentations', function () {
        expect(metadata.getDimensionsAndRepresentations()).to.eql([
            { id : 'dimension1', label : 'dimension 1', type : "DIMENSION", hierarchy : false, representations : []},
            { id : 'dimension2', label : 'dimension 2', type : "MEASURE_DIMENSION", hierarchy : false, representations : []},
            { id : 'dimension3', label : 'dimension 3', type : "TIME_DIMENSION", hierarchy : false,
                representations : [
                    {id : '2012', label : 'Año 2012'},
                    {id : '2011', label : 'Año 2011'},
                    {id : '2010', label : 'Año 2010'}
                ]
            },
            { id : 'dimension4', label : 'dimension 4', type : "GEOGRAPHIC_DIMENSION", hierarchy : false, representations : []}
        ]);
    });

    it.skip('should getCategories', function () {

    });

    it.skip('should getDates', function () {

    });

    it('should getMeasureDimension', function () {
        expect(metadata.getMeasureDimension()).to.eql({ id : 'dimension2', label : 'dimension 2', type : "MEASURE_DIMENSION", hierarchy : false, representations : []});
    });

    it.skip('should getTotalObservations', function () {
        expect(metadata.getTotalObservations()).to.equal(3);
    });

    it.skip('should getProviderCitation', function () {

    });

    it('should getTimeDimensions', function () {
        expect(metadata.getTimeDimensions()).to.eql([{ id : 'dimension3', label : 'dimension 3', type : "TIME_DIMENSION", hierarchy : false}]);
    });

//    it("get dimensions and representations", function () {
//        I18n.locale = 'es';
//        var metadata = new Metadata(response);
//
//        var dims = metadata.getDimensionsAndRepresentations();
//
//        expect(dims).to.eql([
//            {
//                id : 'id1',
//                label : 'enid1',
//                type : "GEOGRAPHIC_DIMENSION",
//                hierarchy : true,
//                representations : [
//                    {id : 'id1a', label : 'enid1a', normCode : 'NORMCODE_1'},
//                    {id : 'id1b', label : 'enid1b', normCode : 'NORMCODE_2', parent : 'id1a'}
//                ]
//            },
//            {
//                id : 'id2',
//                label : 'enid2',
//                type : "DIMENSION",
//                hierarchy : false,
//                representations : [
//                    {id : 'id2a', label : 'enid2a', normCode : null},
//                    {id : 'id2b', label : 'enid2b', normCode : null}
//                ]
//            }
//        ]);
//
//    });
//
//    it("get total observations", function () {
//        I18n.locale = 'es';
//        var metadata = new Metadata(response);
//
//        var total = metadata.getTotalObservations();
//        expect(total).to.deep.equal(4);
//    });
//
//    it("getCategoryByNormCode", function () {
//        I18n.locale = 'en';
//        var metadata = new Metadata(response);
//        var category = metadata.getCategoryByNormCode("id1", "NORMCODE_1");
//        expect(category).to.deep.equal({id : "id1a", label : "enid1a", normCode : "NORMCODE_1"});
//    });
//
//    describe("getTimeDimensions", function () {
//
//        it("should return the times dimensions", function () {
//            I18n.locale = 'es';
//            response.metadata.dimension.type[1] = 'TIME_DIMENSION';
//            var metadata = new Metadata(response);
//            expect(metadata.getTimeDimensions().length).to.deep.equal(1);
//        });
//
//        it("should return an empty array if it hasn't time dimensions", function () {
//            I18n.locale = 'es';
//            var metadata = new Metadata(response);
//            expect(metadata.getTimeDimensions().length).to.deep.equal(0);
//        });
//    });

});