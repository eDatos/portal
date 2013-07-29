describe('Dataset Data', function () {

    beforeEach(function () {
        SpecUtils.configureI18n('es');
    });

    describe('getDataById', function () {

        it('should format using the defined number of decimals on the measure dimension', function () {
            var metadata = new App.dataset.Metadata(App.test.response.metadata);
            var data = new App.dataset.data.Data({metadata : metadata});
            data.apiResponse = new App.dataset.data.ApiResponse(App.test.response.data);
            var dataById = data.getDataById({TIME_PERIOD : "no_emun_code_11", INDICADORES : "INDICE_OCUPACION_HABITACIONES", DESTINO_ALOJAMIENTO : "GRAN_CANARIA", CATEGORIA_ALOJAMIENTO : "TOTAL"});
            expect(dataById).to.equal('6.725,371433'); //6 decimals
        });

    });
});