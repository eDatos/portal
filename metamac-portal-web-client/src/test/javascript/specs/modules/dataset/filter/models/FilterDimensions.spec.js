describe('FilterDimensions', function () {
    var metadata;
    var filterDimensions;

    beforeEach(function () {
        var datasourceIdentificer = new App.datasource.DatasourceIdentifier(App.test.metadata.identifier);
        var datasetHelper = new App.datasource.helper.DatasetHelper();
        metadata = new App.datasource.model.MetadataResponse({ datasourceIdentifier: datasourceIdentificer, datasourceHelper: datasetHelper, response: App.test.response.metadata});
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
                left: ['CATEGORIA_ALOJAMIENTO', 'DESTINO_ALOJAMIENTO'],
                top: ['INDICADORES', 'TIME_PERIOD'],
                fixed: []
            });
        });

        it('should be initialize with the first dimension open', function () {
            expect(filterDimensions.at(0).get('open')).to.be.true;
        });

        it('should set no visible representations if a node is not open', function () {
            var visible = filterDimensions.get('TIME_PERIOD').get('representations').get('time_2_2_1').get('visible');
            expect(visible).to.be.false;
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
            filterDimensions.each(function (filterDimension) {
                filterDimension.get('representations').on("change:selected", spy);
            });
            filterDimensions.at(0).get('representations').at(0).toggle('selected');
            expect(spy.called).to.be.true;
        });

        it('should trigger change event when a representation change the drawable state', function () {
            var spy = sinon.spy();
            filterDimensions.each(function (filterDimension) {
                filterDimension.get('representations').on("change:drawable", spy);
            });
            filterDimensions.at(0).get('representations').at(0).toggle('drawable');
            expect(spy.called).to.be.true;
        });

        it("should trigger change event when a representations update drawables", function () {
            var spy = sinon.spy();
            filterDimensions.each(function (filterDimension) {
                filterDimension.get('representations').on("change:drawable", spy);
            });
            filterDimensions.get('TIME_PERIOD').get('representations')._updateDrawables();
            expect(spy.called).to.be.true;
        });

    });

    describe('exportJSONSelection', function () {

        var exportedJSON, dim, dimId;

        beforeEach(function () {
            dimId = 'INDICADORES';
            dim = filterDimensions.get(dimId);
            filterDimensions.zones.setDimensionZone('fixed', dim);
            exportedJSON = filterDimensions.exportJSONSelection();
        });

        it('should export all dimensions', function () {
            expect(_.keys(exportedJSON).length).to.equal(4); //4 dimensions
        });

        it('should export selected categories', function () {
            var selectedRepresentationId = dim.get('representations').findWhere({ selected: true }).id;
            // After the change on the fixed dimensions limit regarding the drawable attribute, the selected number are no longer affected
            expect(exportedJSON[dimId].categories.length).to.equal(2);
            expect(exportedJSON[dimId].categories[0].id).to.equal(selectedRepresentationId);
        });

        it('should export positions', function () {
            expect(exportedJSON['CATEGORIA_ALOJAMIENTO'].position).to.equal(0);
            expect(exportedJSON['DESTINO_ALOJAMIENTO'].position).to.equal(1);
            expect(exportedJSON['TIME_PERIOD'].position).to.equal(20);
            expect(exportedJSON['INDICADORES'].position).to.equal(40);
        });

    });

    describe('importJSONSelection', function () {

        var selectedRepresentationsIdsInDimension = function (dimensionId) {
            var dimension = filterDimensions.get(dimensionId);
            return _.pluck(dimension.get('representations').where({ selected: true }), 'id');
        };

        var expectDimensionsInZone = function (zone, expectedDimensions) {
            var currentDimensions = filterDimensions.zones.get(zone).get('dimensions').pluck('id');
            expect(currentDimensions).to.eql(expectedDimensions);
        };

        var visibleLabelTypeForDimension = function (dimensionId) {
            var dimension = filterDimensions.get(dimensionId);
            return dimension.get('visibleLabelType');
        };

        beforeEach(function () {
            var exportedJSON = {
                "TIME_PERIOD": {
                    "position": 21,
                    "categories": [
                        {
                            id: "time_1",
                            selected: true,
                            drawable: true
                        },
                        {
                           id: "time_2",
                           selected: true,
                           drawable: true
                        },
                        {
                           id: "time_2_1",
                           selected: false,
                           drawable: false
                        },
                        {
                           id: "time_2_2",
                           selected: false,
                           drawable: false
                        },
                        {
                           id: "time_2_2_1",
                           selected: false,
                           drawable: false
                        },
                        {
                           id: "time_3",
                           selected: false,
                           drawable: false
                        }
                    ],
                    "visibleLabelType": "LABEL",
                },
                "INDICADORES": {
                    "position": 0,
                    "categories": [
                        {
                            id: "INDICE_OCUPACION_PLAZAS",
                            selected: true,
                            drawable: true
                        },
                        {
                            id: "INDICE_OCUPACION_HABITACIONES",
                            selected: false,
                            drawable: false
                        }
                    ],
                    "visibleLabelType": "LABEL_AND_CODE",
                },
                "CATEGORIA_ALOJAMIENTO": {
                    "position": 20,
                    "categories": [
                        {
                            id: "1_2_3_ESTRELLAS",
                            selected: true,
                            drawable: true
                        },
                        {
                           id: "4_5_ESTRELLAS",
                           selected: false,
                           drawable: false
                        },
                        {
                           id: "TOTAL",
                           selected: false,
                           drawable: false
                        }
                    ],
                    "visibleLabelType": "CODE",
                },
                "DESTINO_ALOJAMIENTO": {
                    "position": 40,
                    "categories": [
                        {
                            id: "EL_HIERRO",
                            selected: true,
                            drawable: true
                        },
                        {
                           id: "LA_PALMA",
                           selected: false,
                           drawable: false
                        },
                        {
                           id: "LA_GOMERA",
                           selected: false,
                           drawable: false
                        },
                        {
                           id: "TENERIFE",
                           selected: false,
                           drawable: false
                        },
                        {
                           id: "GRAN_CANARIA",
                           selected: false,
                           drawable: false
                        },
                        {
                           id: "FUERTEVENTURA",
                           selected: false,
                           drawable: false
                        },
                        {
                           id: "LANZAROTE",
                           selected: false,
                           drawable: false
                        }
                    ]
                }
            };
            filterDimensions.importJSONSelection(exportedJSON);
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

        it('should import correctly the visibleLabelType', function () {
            expect(visibleLabelTypeForDimension('TIME_PERIOD')).to.eql('LABEL');
            expect(visibleLabelTypeForDimension('INDICADORES')).to.eql('LABEL_AND_CODE');
            expect(visibleLabelTypeForDimension('CATEGORIA_ALOJAMIENTO')).to.eql('CODE');
            expect(visibleLabelTypeForDimension('DESTINO_ALOJAMIENTO')).to.be.undefined;
        });

    });

});