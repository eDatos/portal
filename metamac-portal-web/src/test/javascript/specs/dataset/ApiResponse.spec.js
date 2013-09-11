describe('ApiResponse', function () {

    var apiResponse;

    beforeEach(function () {
        apiResponse = new App.dataset.data.ApiResponse(App.test.response.data);
    });


    describe('should getDataById', function () {

        it('first value', function () {
            var value = apiResponse.getDataById({TIME_PERIOD : "no_emun_code_11", INDICADORES : "INDICE_OCUPACION_HABITACIONES", DESTINO_ALOJAMIENTO : "GRAN_CANARIA", CATEGORIA_ALOJAMIENTO : "TOTAL"});
            expect(value).to.eql({value : "6725.371433050962"});
        });

        it('last value', function () {
            var value = apiResponse.getDataById({TIME_PERIOD : "no_emun_code_2", INDICADORES : "INDICE_OCUPACION_PLAZAS", DESTINO_ALOJAMIENTO : "LA_PALMA", CATEGORIA_ALOJAMIENTO : "1_2_3_ESTRELLAS"});
            expect(value).to.eql({value : "7292.0959638713"});
        });

    });

    it('should getDataByPos', function () {

    });

});