describe('DataSourceDataset', function () {

    var dataSource;

    var initializeDataSource = function () {
        var metadata = new App.dataset.Metadata(App.test.response.metadata);
        var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        dataSource = new App.DataSourceDataset({filterDimensions : filterDimensions});
    };

    var initializeDataSourceWithHierarchyAtLeft = function () {
        var metadata = new App.dataset.Metadata(App.test.response.metadata);
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
                '1, 2 y 3 estrellas', '  El Hierro', '  La Palma', '  La Gomera', '  Tenerife', '  Gran Canaria', '  Fuerteventura', '  Lanzarote',
                '4 y 5 Estrellas', '  El Hierro', '  La Palma', '  La Gomera', '  Tenerife', '  Gran Canaria', '  Fuerteventura', '  Lanzarote',
                'Total', '  El Hierro', '  La Palma', '  La Gomera', '  Tenerife', '  Gran Canaria', '  Fuerteventura', '  Lanzarote'
            ]];
            expect(dataSource.leftHeaderValues()).to.eql(expectedLeftHeaderValues);
        });

        it('should return dimension labels in plain mode preserving space for hierarchy', function () {
            initializeDataSourceWithHierarchyAtLeft();

            //TIME, Destino alojamiento, Categoria alojamiento

            var level2 = [
                '        1, 2 y 3 estrellas',
                '        4 y 5 Estrellas',
                '        Total'
            ];
            var level1 = [
                '      El Hierro', level2,
                '      La Palma', level2,
                '      La Gomera', level2,
                '      Tenerife', level2,
                '      Gran Canaria', level2,
                '      Fuerteventura', level2,
                '      Lanzarote', level2
            ];

            var level0 = [
                'Time 1', level1,
                'Time 2', level1,
                '  Time 2 1', level1,
                '  Time 2 2', level1,
                '    Time 2 2 1', level1,
                'Time 3', level1
            ];

            var expectedLeftHeaderValues = [_.flatten(level0)];
            var leftHeaderValues = dataSource.leftHeaderValues();

            expect(leftHeaderValues).to.eql(expectedLeftHeaderValues);
        });

    });

});