describe('DataSourceDataset', function () {

    var dataSource;

    var initializeDataSource = function () {
        var datasourceIdentificer = new App.datasource.DatasourceIdentifier(App.test.metadata.identifier);
        var datasetHelper = new App.datasource.helper.DatasetHelper();
        var metadata = new App.datasource.model.MetadataResponse({ datasourceIdentifier: datasourceIdentificer, datasourceHelper: datasetHelper, response: App.test.response.metadata});
        var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        dataSource = new App.DataSourceDataset({filterDimensions : filterDimensions});
    };

    var initializeDataSourceWithHierarchyAtLeft = function () {
        var datasourceIdentificer = new App.datasource.DatasourceIdentifier(App.test.metadata.identifier);
        var datasetHelper = new App.datasource.helper.DatasetHelper();
        var metadata = new App.datasource.model.MetadataResponse({ datasourceIdentifier: datasourceIdentificer, datasourceHelper: datasetHelper, response: App.test.response.metadata});
        var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        filterDimensions.zones.setDimensionZone('left', filterDimensions.get('TIME_PERIOD'));
        filterDimensions.zones.swapDimensions(filterDimensions.get('TIME_PERIOD'), filterDimensions.get('CATEGORIA_ALOJAMIENTO'));
        dataSource = new App.DataSourceDataset({filterDimensions : filterDimensions});
    };


    describe('leftHeaderColumns', function () {

        it('should return 1 because of plain visualization', function () {
            initializeDataSource();
            expect(dataSource.leftHeaderColumns()).to.equal(1);
        });

    });

    describe('leftHeaderValues', function () {

        it('should return dimension labels in plain mode', function () {
            initializeDataSource();

            var expectedLeftHeaderValues = [[
                { label : '1, 2 y 3 estrellas', level : 0 },
                    { label : '  El Hierro', level : 1 },
                    { label : '  La Palma', level : 1 },
                    { label : '  La Gomera', level : 1 },
                    { label : '  Tenerife', level : 1 },
                    { label : '  Gran Canaria', level : 1 },
                    { label : '  Fuerteventura', level : 1 },
                    { label : '  Lanzarote', level : 1 },
                { label : '4 y 5 Estrellas', level : 0 },
                    { label : '  El Hierro', level : 1 },
                    { label : '  La Palma', level : 1 },
                    { label : '  La Gomera', level : 1 },
                    { label : '  Tenerife', level : 1 },
                    { label : '  Gran Canaria', level : 1 },
                    { label : '  Fuerteventura', level : 1 },
                    { label : '  Lanzarote', level : 1 },
                { label : 'Total', level : 0 },
                    { label : '  El Hierro', level : 1 },
                    { label : '  La Palma', level : 1 },
                    { label : '  La Gomera', level : 1 },
                    { label : '  Tenerife', level : 1 },
                    { label : '  Gran Canaria', level : 1 },
                    { label : '  Fuerteventura', level : 1 },
                    { label : '  Lanzarote', level: 1 }
            ]];
            expect(dataSource.leftHeaderValues()).to.eql(expectedLeftHeaderValues);
        });

        it('should return dimension labels in plain mode preserving space for hierarchy', function () {
            initializeDataSourceWithHierarchyAtLeft();

            //TIME, Destino alojamiento, Categoria alojamiento

            var subsublevel = [
                { label : '        1, 2 y 3 estrellas', level : 4 },
                { label : '        4 y 5 Estrellas', level : 4 },
                { label : '        Total', level : 4 }
            ];

            var sublevel = [
                { label : '      El Hierro' , level : 3 }, subsublevel,
                { label : '      La Palma' , level : 3 }, subsublevel,
                { label : '      La Gomera' , level : 3 }, subsublevel,
                { label : '      Tenerife' , level : 3 }, subsublevel,
                { label : '      Gran Canaria' , level : 3 }, subsublevel,
                { label : '      Fuerteventura' , level : 3 }, subsublevel,
                { label : '      Lanzarote' , level : 3 }, subsublevel
            ];         

            var level0 = [
                { label : 'Time 1', level : 0 }, sublevel,
                { label : 'Time 2', level : 0 }, sublevel,
                { label : '  Time 2 1', level : 1 }, sublevel,
                { label : '  Time 2 2', level : 1 }, sublevel,
                { label : '    Time 2 2 1', level : 2 }, sublevel,
                { label : 'Time 3', level : 0 }, sublevel
            ];

            var expectedLeftHeaderValues = [_.flatten(level0)];
            var leftHeaderValues = dataSource.leftHeaderValues();

            expect(leftHeaderValues).to.eql(expectedLeftHeaderValues);
        });

    });

});