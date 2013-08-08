describe('FilterDimensions', function () {
    var metadata;
    var filterDimensions;

    beforeEach(function () {
        metadata = new App.dataset.Metadata(App.test.response.metadata);
        filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
    });

    var idsAtZone = function (zone) {
        return filterDimensions.dimensionsAtZone(zone).pluck('id');
    };

    var expectZonesIdsEql = function (zonesId) {
        expect(idsAtZone('left')).eql(zonesId.left);
        expect(idsAtZone('top')).eql(zonesId.top);
        expect(idsAtZone('fixed')).eql(zonesId.fixed);
    };

    describe('initialize', function () {

        it('should initialize with same dimensions', function () {
            expect(filterDimensions.length).to.equal(metadata.getDimensions().length);
        });

        it('should initialize zones using metadata information', function () {
            expectZonesIdsEql({
                left : ['CATEGORIA_ALOJAMIENTO', 'DESTINO_ALOJAMIENTO'],
                top : ['INDICADORES', 'TIME_PERIOD'],
                fixed : []
            });
        });

        it('should be initialize with the first dimension open', function () {
            expect(filterDimensions.at(0).get('open')).to.be.true;
        });

    });

    describe('when a dimension is open', function () {

        it('should close other filterDimension if is opened', function () {
            var dim0 = filterDimensions.at(0);
            dim0.set('open', true);
            var dim1 = filterDimensions.at(1);
            dim1.set('open', true);

            expect(dim0.get('open')).to.be.false;
            expect(dim1.get('open')).to.be.true;
        });

    });

    describe('events propagation', function () {

        it('should trigger change event when a representation change the state', function () {
            var spy = sinon.spy();
            filterDimensions.on('change:selected', spy);
            filterDimensions.at(0).get('representations').at(0).toggle('selected');
            expect(spy.called).to.be.true;
        });

    });

    describe('exportJSON', function () {

        var exportedJSON, dim, dimId;

        beforeEach(function () {
            dimId = 'INDICADORES';
            dim = filterDimensions.get(dimId);
            filterDimensions.zones.setDimensionZone('fixed', dim);
            exportedJSON = filterDimensions.exportJSON();
        });

        it('should export all dimensions', function () {
            expect(_.keys(exportedJSON).length).to.equal(4); //4 dimensions
        });

        it('should export selected categories', function () {
            var selectedRepresentationId = dim.get('representations').findWhere({selected : true}).id;
            expect(exportedJSON[dimId].selectedCategories.length).to.equal(1);
            expect(exportedJSON[dimId].selectedCategories[0]).to.equal(selectedRepresentationId);
        });

        it('should export positions', function () {
            expect(exportedJSON['CATEGORIA_ALOJAMIENTO'].position).to.equal(0);
            expect(exportedJSON['DESTINO_ALOJAMIENTO'].position).to.equal(1);
            expect(exportedJSON['TIME_PERIOD'].position).to.equal(20);
            expect(exportedJSON['INDICADORES'].position).to.equal(40);
        });

    });

    describe('importJSON', function () {

        var selectedRepresentationsIdsInDimension = function (dimensionId) {
            var dimension = filterDimensions.get(dimensionId);
            return _.pluck(dimension.get('representations').where({selected : true}), 'id');
        };

        var expectDimensionsInZone = function (zone, expectedDimensions) {
            var currentDimensions = filterDimensions.zones.get(zone).get('dimensions').pluck('id');
            expect(currentDimensions).to.eql(expectedDimensions);
        };

        beforeEach(function () {
            var exportedJSON = {
                "TIME_PERIOD" : {
                    "position" : 21,
                    "selectedCategories" : ["time_1", "time_2"]
                },
                "INDICADORES" : {
                    "position" : 0,
                    "selectedCategories" : ["INDICE_OCUPACION_PLAZAS"]
                },
                "CATEGORIA_ALOJAMIENTO" : {
                    "position" : 20,
                    "selectedCategories" : [ "1_2_3_ESTRELLAS"]
                },
                "DESTINO_ALOJAMIENTO" : {
                    "position" : 40,
                    "selectedCategories" : ["EL_HIERRO"]
                }
            };
            filterDimensions.importJSON(exportedJSON);
        });

        it('should import selected categories', function () {
            expect(selectedRepresentationsIdsInDimension('TIME_PERIOD')).to.eql(['time_1', 'time_2']);
            expect(selectedRepresentationsIdsInDimension('INDICADORES')).to.eql(['INDICE_OCUPACION_PLAZAS']);
            expect(selectedRepresentationsIdsInDimension('CATEGORIA_ALOJAMIENTO')).to.eql(['1_2_3_ESTRELLAS']);
            expect(selectedRepresentationsIdsInDimension('DESTINO_ALOJAMIENTO')).to.eql(["EL_HIERRO"]);
        });

        it('should assign correct zones', function () {
            expectDimensionsInZone('left', ['INDICADORES']);
            expectDimensionsInZone('top', ['CATEGORIA_ALOJAMIENTO', 'TIME_PERIOD']);
            expectDimensionsInZone('fixed', ['DESTINO_ALOJAMIENTO']);
        });

    });

});