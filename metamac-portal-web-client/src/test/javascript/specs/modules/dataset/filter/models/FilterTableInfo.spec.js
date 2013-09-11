describe('FilterTableInfo', function () {

    var filterTableInfo, filterDimensions;

    beforeEach(function () {
        var metadata = {
            getDimensionsAndRepresentations : function () {
                return [
                    {
                        id : 'id1',
                        label : 'enid1',
                        type : 'DIMENSION',
                        representations : [
                            {id : 'id1a', label : 'enid1a'},
                            {id : 'id1b', label : 'enid1b'}
                        ]
                    },
                    {
                        id : 'id2',
                        label : 'enid2',
                        type : 'GEOGRAPHIC_DIMENSION',
                        representations : [
                            {id : 'id2a', label : 'enid2a'},
                            {id : 'id2b', label : 'enid2b'}
                        ]
                    },
                    {
                        id : 'id3',
                        label : 'enid3',
                        type : 'TIME_DIMENSION',
                        representations : [
                            {id : 'id3a', label : 'enid3a', normCode : 'TIME1'},
                            {id : 'id3b', label : 'enid3b', normCode : 'TIME2'},
                            {id : 'id3c', label : 'enid3c', normCode : null}
                        ]
                    }
                ];
            },
            getDimensionsPosition : function () {
                return {top : ['id3'], left : ['id1', 'id2']};
            }
        };
        filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        filterTableInfo = new App.modules.dataset.filter.models.FilterTableInfo({filterDimensions : filterDimensions});
    });

    it("should getTableSize", function () {
        expect(filterTableInfo.getTableSize()).to.eql({rows : 4, columns : 3});
    });

    describe('getCategoryIdsForCell', function () {
        it("should return newer categories first for a time dimension", function () {
            expect(filterTableInfo.getCategoryIdsForCell({x : 0, y : 0})).to.eql({id1 : 'id1a', id2 : 'id2a', id3 : 'id3b'});
            expect(filterTableInfo.getCategoryIdsForCell({x : 1, y : 0})).to.eql({id1 : 'id1a', id2 : 'id2a', id3 : 'id3a'});
            expect(filterTableInfo.getCategoryIdsForCell({x : 0, y : 1})).to.eql({id1 : 'id1a', id2 : 'id2b', id3 : 'id3b'});
            expect(filterTableInfo.getCategoryIdsForCell({x : 1, y : 1})).to.eql({id1 : 'id1a', id2 : 'id2b', id3 : 'id3a'});
        });
    });

    describe("getCellForCategoryIds", function () {
        it('should return categories ids for cell', function () {
            expect(filterTableInfo.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2a', id3 : 'id3b'})).to.eql({x : 0, y : 0});
            expect(filterTableInfo.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2a', id3 : 'id3a'})).to.eql({x : 1, y : 0});
            expect(filterTableInfo.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2b', id3 : 'id3b'})).to.eql({x : 0, y : 1});
            expect(filterTableInfo.getCellForCategoryIds({id1 : 'id1a', id2 : 'id2b', id3 : 'id3a'})).to.eql({x : 1, y : 1});
        });
    });

});