describe('DataResponse', function () {

    var dataResponse;

    beforeEach(function () {
        dataResponse = new App.datasource.model.DataResponse(App.test.response.data, undefined, new App.datasource.helper.DatasetHelper(), undefined);
    });


    describe('should getDataById', function () {
        var emptyAttributes = {
            dimensionsAttributes: [],
            primaryMeasureAttributes: [],
            combinatedDimensionsAttributes: []
        }

        it('first value', function () {
            var value = dataResponse.getDataById({ TIME_PERIOD: "no_emun_code_11", INDICADORES: "INDICE_OCUPACION_HABITACIONES", DESTINO_ALOJAMIENTO: "GRAN_CANARIA", CATEGORIA_ALOJAMIENTO: "TOTAL" });
            expect(value).to.eql({ value: "6725.371433050962", attributes: emptyAttributes });
        });

        it('last value', function () {
            var value = dataResponse.getDataById({ TIME_PERIOD: "no_emun_code_2", INDICADORES: "INDICE_OCUPACION_PLAZAS", DESTINO_ALOJAMIENTO: "LA_PALMA", CATEGORIA_ALOJAMIENTO: "1_2_3_ESTRELLAS" });
            expect(value).to.eql({ value: "7292.0959638713", attributes: emptyAttributes });
        });

    });

});