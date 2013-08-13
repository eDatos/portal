describe("Dataset Metadata", function () {

    var metadata;
    var MEASURE_DIMENSION;
    var MEASURE_DIMENSION_REPRESENTATIONS;


    beforeEach(function () {
        metadata = new App.dataset.Metadata();
        metadata.parse(App.test.response.metadata);


        MEASURE_DIMENSION = {"id" : "INDICADORES", "label" : "Indicadores", "type" : "MEASURE_DIMENSION", "hierarchy" : false};
        MEASURE_DIMENSION_REPRESENTATIONS = [
            {id : 'INDICE_OCUPACION_HABITACIONES', label : 'Índice de ocupación de habitaciones', decimals : 6, open : true},
            {id : 'INDICE_OCUPACION_PLAZAS', label : 'Índice de ocupación de plazas', decimals : 4, open : false}
        ];
    });

    it('should getIdentifier', function () {
        expect(metadata.getIdentifier()).to.eql('C00025A_000001');
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
        expect(metadata.getLicense()).to.eql('Licencia en Español');
    });

    it.skip('should getLicenseUrl', function () {

    });

    it.skip('should getPublisher', function () {

    });

    it('should getUri', function () {
        expect(metadata.getUri()).to.eql('urn:siemac:org.siemac.metamac.infomodel.statisticalresources.Dataset=ISTAC:C00025A_000001(001.000)');
    });

    it('should getDimensions', function () {
        expect(metadata.getDimensions()).to.eql([
            {"id" : "TIME_PERIOD", "label" : "Periodo de tiempo", "type" : "TIME_DIMENSION", "hierarchy" : true},
            MEASURE_DIMENSION,
            {"id" : "CATEGORIA_ALOJAMIENTO", "label" : "Categoría del alojamiento", "type" : "DIMENSION", "hierarchy" : false},
            {"id" : "DESTINO_ALOJAMIENTO", "label" : "Destino del alojamiento", "type" : "GEOGRAPHIC_DIMENSION", "hierarchy" : false}
        ]);
    });

    describe('getRepresentation', function () {

        it('hierarchy dimension', function () {
            expect(metadata.getRepresentations('TIME_PERIOD')).to.eql([
                {id : 'time_1', label : 'Time 1'},
                {id : 'time_2', label : 'Time 2'},
                {id : 'time_2_1', label : 'Time 2 1', parent : 'time_2'},
                {id : 'time_2_2', label : 'Time 2 2', parent : 'time_2'},
                {id : 'time_2_2_1', label : 'Time 2 2 1', parent : 'time_2_2'},
                {id : 'time_3', label : 'Time 3'}
            ]);
        });

        it('should order dimensionValues by order field', function () {
            expect(metadata.getRepresentations('INDICADORES')).to.eql(MEASURE_DIMENSION_REPRESENTATIONS);
        });

    });

    it('should getDimensionsAndRepresentations', function () {
        var dimensionsAndRepresentations = metadata.getDimensionsAndRepresentations();
        expect(_.pluck(dimensionsAndRepresentations, 'id')).to.eql(['TIME_PERIOD', 'INDICADORES', 'CATEGORIA_ALOJAMIENTO', 'DESTINO_ALOJAMIENTO']);
        expect(dimensionsAndRepresentations[1].representations).to.eql(MEASURE_DIMENSION_REPRESENTATIONS);
    });

    it.skip('should getCategories', function () {

    });

    it.skip('should getDates', function () {

    });

    it('should getMeasureDimension', function () {
        MEASURE_DIMENSION.representations = MEASURE_DIMENSION_REPRESENTATIONS;
        expect(metadata.getMeasureDimension()).to.eql(MEASURE_DIMENSION);
    });

    describe('decimalsForSelection', function () {

        it('should use dimensionValue decimal if defined', function () {
            var selection = {INDICADORES : 'INDICE_OCUPACION_PLAZAS'};
            expect(metadata.decimalsForSelection(selection)).to.equal(4);
        });

        it('should use relatedDsd decimal value if dimensionValue is not defined', function () {
            var selection = {INDICADORES : 'INDICE_OCUPACION_HABITACIONES'};
            expect(metadata.decimalsForSelection(selection)).to.equal(6);
        });

        it('should return default number of decimals if not measure dimension value defined', function () {
            var selection = {};
            expect(metadata.decimalsForSelection(selection)).to.equal(2);
        });

    });

    it.skip('should getTotalObservations', function () {
        expect(metadata.getTotalObservations()).to.equal(3);
    });

    it.skip('should getProviderCitation', function () {

    });

    it('should getTimeDimensions', function () {
        expect(metadata.getTimeDimensions()).to.eql([
            {"id" : "TIME_PERIOD", "label" : "Periodo de tiempo", "type" : "TIME_DIMENSION", "hierarchy" : true}
        ]);
    });

    it('should getPositions', function () {
        var positions = metadata.getDimensionsPosition();
        expect(positions).to.eql({
            top : ["INDICADORES", "TIME_PERIOD"],
            left : ["CATEGORIA_ALOJAMIENTO", "DESTINO_ALOJAMIENTO"]
        });
    });

    it('should getAutoOpen', function () {
        expect(metadata.getAutoOpen()).to.be.true;
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