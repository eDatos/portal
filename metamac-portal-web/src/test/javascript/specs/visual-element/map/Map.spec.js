describe("Map", function () {

    var Map = STAT4YOU.VisualElement.Map;
    var FilterOptions = STAT4YOU.widget.FilterOptions;
    var filterOptions;
    var metadata = {
        getDimensionsAndRepresentations : function () {
            return [
                {
                    id : 'id2',
                    label : 'enid2',
                    type : 'GEOGRAPHIC_DIMENSION',
                    representations : [
                        {id : 'id2a', label : 'enid2a', normCode : 'code1'},
                        {id : 'id2b', label : 'enid2b', normCode : 'code2'}
                    ]
                }
            ];
        }
    };

    beforeEach(function () {
        filterOptions = new FilterOptions({metadata : metadata});
    });

    describe("getData", function () {
        it("should extract zero value correctly", function () {
            var dataset = {
                data : {
                    getNumberDataById : function (ids) {
                        return _.values(ids)[0] === "id2a" ? 0 : 1;
                    }
                }
            };

            var map = new Map({filterOptions : filterOptions, dataset : dataset});
            var data = map._getData();
            var expectedData = {code1 : {value : 0}, code2 : {value : 1}};
            expect(data).toEqual(expectedData);
        });
    });

});