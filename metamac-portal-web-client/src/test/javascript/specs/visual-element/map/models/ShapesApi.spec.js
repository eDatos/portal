describe("ShapesApi", function () {
    var ShapesApi = App.Map.ShapesApi;
    var GeoJsonConverter = App.Map.GeoJsonConverter;
    var shapesApi = new ShapesApi();
    var codes;
    var ajaxStub;

    beforeEach(function () {
        codes = ["TERRITORIO.CODE1", "TERRITORIO.CODE2"];
        ajaxStub = sinon.stub($, "ajax");
        App.endpoints.srm = "http://srm.com";
    });

    afterEach(function () {
        ajaxStub.restore();
    });

    var ajaxStubReturns = function (data) {
        var response = new $.Deferred();
        response.resolve(data);
        ajaxStub.returns(response);
    };

    it('should make the correct api request for getShapes', function (done) {
        ajaxStubReturns(geoJson);
        shapesApi.getShapes(codes, function () {
            var ajaxParams = ajaxStub.getCall(0).args[0];
            expect(ajaxParams.url).to.eql(App.endpoints.srm + "/variables/TERRITORIO/variableelements/~all/geoinfo");
            expect(ajaxParams.data.query).to.equal("ID IN ('CODE1', 'CODE2')")
            done();
        });
    });

    it("should transform the returned geoJson into shapeList", function (done) {
        ajaxStubReturns(geoJson);

        shapesApi.getShapes(codes, function (err, response) {
            expect(response).to.eql([
                {"normCode":"TERRITORIO.CODE1","geometryType":"Polygon","shape":[[1,2],[3,4]],"hierarchy":1},
                {"normCode":"TERRITORIO.CODE2","geometryType":"MultiPolygon","shape":[[[5,6],[7,8]]],"hierarchy":1}
            ]);
            done();
        });
    });

    it('should get lastUpdateDate', function (done) {
        var lastUpdateResponse = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    id: "LA_GOMERA",
                    properties: {
                        urn: "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO.LA_GOMERA",
                        lastUpdatedDate: "2013-09-05T00:00:00.000+01:00"
                    }
                }
            ]
        };
        ajaxStubReturns(lastUpdateResponse);
        shapesApi.getLastUpdatedDate(codes, function (err, lastUpdateDate) {
            expect(lastUpdateDate).to.eql(new Date("2013-09-05T00:00:00.000+01:00"));
            expect(ajaxStub.firstCall.args[0].url).to.eql("http://srm.com/variables/TERRITORIO/variableelements/CODE1/geoinfo.json?fields=-geographicalGranularity,-geometry,-point");
            done();
        });
    });

    it('should extract variable id from normcodes', function () {
        expect(shapesApi.extractVariableId(["TERRITORIO.CODE1", "TERRITORIO.CODE2"])).to.equal("TERRITORIO");
    });

    it('should extract codes from normcodes', function () {
        expect(shapesApi.extractCodes(["TERRITORIO.CODE1", "TERRITORIO.CODE2"])).to.eql(["CODE1", "CODE2"]);
    });

    it('should extract normCode from urn', function () {
        var urn = "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO_MUNDO.MUNDO";
        var normCode = "TERRITORIO_MUNDO.MUNDO";
        expect(shapesApi.extractNormCodeFromUrn(urn)).to.eql(normCode);
    });
    
    var geoJson = {
        type : "FeatureCollection",
        features : [
            {
                type : "Feature",
                id : "CODE1",
                geometry : {
                    type : "Polygon",
                    coordinates : [
                        [1, 2],
                        [3, 4]
                    ]
                }
            },
            {
                type : "Feature",
                id : "CODE2",
                geometry : {
                    type : "MultiPolygon",
                    coordinates : [
                        [
                            [5, 6],
                            [7, 8]
                        ]
                    ]
                }
            }
        ]
    };

});