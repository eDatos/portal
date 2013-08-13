describe('FilterZones', function () {

    var metadata, filterDimensions, zones;

    var indexInZone = function (dimension) {
        return dimension.get('zone').get('dimensions').indexOf(dimension);
    };

    beforeEach(function () {
        metadata = new App.dataset.Metadata();
        metadata.parse(App.test.response.metadata);
        filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        zones = filterDimensions.zones;
    });

    describe('swapDimensions', function () {

        it('should change dimensions zones', function () {
            var dim1 = filterDimensions.get('CATEGORIA_ALOJAMIENTO');
            var dim2 = filterDimensions.get('INDICADORES');

            expect(dim1.get('zone').id).equals('left');
            expect(dim2.get('zone').id).equals('top');

            zones.swapDimensions(dim1, dim2);

            expect(dim2.get('zone').id).equals('left');
            expect(dim1.get('zone').id).equals('top');
        });

        it('should swap zones position', function () {
            var dim1 = zones.get('left').get('dimensions').at(0);
            var dim2 = zones.get('top').get('dimensions').at(1);

            expect(indexInZone(dim1)).to.equal(0);
            expect(indexInZone(dim2)).to.equal(1);

            zones.swapDimensions(dim1, dim2);

            expect(dim1.get('zone').id).to.eql('top');
            expect(indexInZone(dim1)).to.equal(1);

            expect(dim2.get('zone').id).to.eql('left');
            expect(indexInZone(dim2)).to.equal(0);
        });

        it('should swap position when dimension is in the same zone', function () {
            var dim1 = zones.get('left').get('dimensions').at(0);
            var dim2 = zones.get('left').get('dimensions').at(1);

            expect(indexInZone(dim1)).to.equal(0);
            expect(indexInZone(dim2)).to.equal(1);

            zones.swapDimensions(dim1, dim2);

            expect(dim1.get('zone').id).to.eql('left');
            expect(indexInZone(dim1)).to.equal(1);

            expect(dim2.get('zone').id).to.eql('left');
            expect(indexInZone(dim2)).to.equal(0);
        });

        it('should update selected limit', function () {
            var leftZone = zones.get('left');
            var topZone = zones.get('top');

            var dim1 = leftZone.get('dimensions').at(0);
            var dim2 = topZone.get('dimensions').at(0);

            leftZone.set('selectedLimit', 1);
            topZone.set('selectedLimit', 2);

            expect(dim1.get('representations').selectedLimit).to.equal(1);
            expect(dim2.get('representations').selectedLimit).to.equal(2);

            zones.swapDimensions(dim1, dim2);

            expect(dim1.get('representations').selectedLimit).to.equal(2);
            expect(dim2.get('representations').selectedLimit).to.equal(1);
        });
        
    });

    describe('when zone limit change', function () {   
        
        it('should redistribute leftover dimensions', function () {
            zones.get('left').set('fixedSize', 1);
            expect(zones.get('left').get('dimensions').length).to.equal(1);
            expect(zones.get('top').get('dimensions').length).to.equal(3);
        });

        it("should find dimensions from other zone if zone hasn't enough dimensions ", function () {
            var leftZone = zones.get('left');
            var dim = leftZone.get('dimensions').at(0);
            zones.setDimensionZone('top', dim);

            leftZone.set('fixedSize', 2);

            expect(zones.get('left').get('dimensions').length).to.equal(2);
            expect(zones.get('top').get('dimensions').length).to.equal(2);
        });
        
    });

    describe('setDimensionsZone', function () {

        it('should change zone when zone hasnt restriction', function () {
            var dim = zones.get('left').get('dimensions').at(0);
            zones.setDimensionZone('top', dim);

            expect(dim.get('zone').id).to.equal('top');
            expect(zones.get('top').get('dimensions').indexOf(dim)).to.be.at.least(0);
        });

        it('should swap a dimensions if the src zone has restriction', function () {
            var leftZone = zones.get('left');

            leftZone.set('fixedSize', 1);

            var dim = leftZone.get('dimensions').at(0);
            zones.setDimensionZone('top', dim);

            expect(dim.get('zone').id).to.equal('top');
            expect(leftZone.get('dimensions').length).to.equal(1);
        });

        it('should swap a dimensions if the dest zone has restriction', function () {
            var leftZone = zones.get('left');
            leftZone.set('fixedSize', 1);

            var dim = zones.get('top').get('dimensions').at(0);
            zones.setDimensionZone('left', dim);

            expect(dim.get('zone').id).to.equal('left');
            expect(leftZone.get('dimensions').length).to.equal(1);
        });

    });



});