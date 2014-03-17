describe("ShapesApi", function () {
    var ShapesApi = App.Map.ShapesApi;
    var GeoJsonConverter = App.Map.GeoJsonConverter;
    var shapesApi = new ShapesApi();
    var codes;
    var ajaxStub;

    beforeEach(function () {
        codes = ["TERRITORIO.CODE1", "TERRITORIO.CODE2"];
        ajaxStub = sinon.stub($, "ajax");
        App.endpoints["structural-resources"] = "http://srm.com";
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
        ajaxStubReturns(geoJSONResponse);
        shapesApi.getShapes(codes, function () {
            var ajaxParams = ajaxStub.getCall(0).args[0];
            expect(ajaxParams.url).to.eql(App.endpoints["structural-resources"] + "/variables/TERRITORIO/variableelements/~all/geoinfo.json");
            expect(ajaxParams.data.query).to.equal("ID IN ('CODE1', 'CODE2')")
            done();
        });
    });

    it("should transform the returned geoJson into shapeList", function (done) {
        var expected = [
            {"normCode" : "TERRITORIO.CODE1", "geometryType" : "Polygon", "shape" : [
                [1, 2],
                [3, 4]
            ], "granularity" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ADM-LEVEL3"},
            {"normCode" : "TERRITORIO.CODE2", "geometryType" : "MultiPolygon", "shape" : [
                [
                    [5, 6],
                    [7, 8]
                ]
            ], "granularity" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ADM-LEVEL3"}
        ];

        ajaxStubReturns(geoJSONResponse);

        shapesApi.getShapes(codes, function (err, response) {
            expect(response).to.eql(expected);
            done();
        });
    });

    it('should get lastUpdateDate', function (done) {
        var lastUpdateResponse = {
            type : "FeatureCollection",
            features : [
                {
                    type : "Feature",
                    id : "LA_GOMERA",
                    properties : {
                        urn : "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO.LA_GOMERA",
                        lastUpdatedDate : "2013-09-05T00:00:00.000+01:00"
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

    it('should get granularity order', function (done) {
        ajaxStubReturns(geoGranularityResponse);
        shapesApi.getGranularityOrder(function (err, granularityOrder) {

            expect(granularityOrder).to.eql([
                {
                    id : "COUNTRIES",
                    order : 1,
                    urn : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).COUNTRIES"
                },
                {
                    id : "ISLANDS",
                    order : 2,
                    urn : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ISLANDS"
                },
                {
                    id : "MUNICIPALITIES",
                    order : 3,
                    urn : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).MUNICIPALITIES"
                },
                {
                    id : "PROVINCES",
                    order : 4,
                    urn : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).PROVINCES"
                },
                {
                    id : "REGIONS",
                    order : 5,
                    urn : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).REGIONS"
                }
            ]);
            done();
        })
    });


    it('should extract variable id from normcodes', function () {
        expect(shapesApi._extractVariableId(["TERRITORIO.CODE1", "TERRITORIO.CODE2"])).to.equal("TERRITORIO");
    });

    it('should extract codes from normcodes', function () {
        expect(shapesApi._extractCodes(["TERRITORIO.CODE1", "TERRITORIO.CODE2"])).to.eql(["CODE1", "CODE2"]);
    });

    it('should extract normCode from urn', function () {
        var urn = "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO_MUNDO.MUNDO";
        var normCode = "TERRITORIO_MUNDO.MUNDO";
        expect(shapesApi._extractNormCodeFromUrn(urn)).to.eql(normCode);
    });

    var geoJSONResponse = {
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
                },
                properties : {
                    geographicalGranularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ADM-LEVEL3"
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
                },
                properties : {
                    geographicalGranularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ADM-LEVEL3"
                }
            }
        ]
    };

    var geoGranularityResponse = {"code" : [
        {"order" : 1, "open" : true, "id" : "COUNTRIES", "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).COUNTRIES", "selfLink" : {"kind" : "structuralResources#code", "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_GEO_GRANULARITIES/01.001/codes/COUNTRIES"}, "name" : {"text" : [
            {"value" : "PaÃ­ses", "lang" : "es"}
        ]}, "kind" : "structuralResources#code", "managementAppLink" : "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/codelists/codelist;id=ISTAC:CL_GEO_GRANULARITIES(01.001)/code;id=COUNTRIES"},
        {"order" : 2, "open" : true, "id" : "ISLANDS", "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ISLANDS", "selfLink" : {"kind" : "structuralResources#code", "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_GEO_GRANULARITIES/01.001/codes/ISLANDS"}, "name" : {"text" : [
            {"value" : "Islas", "lang" : "es"}
        ]}, "kind" : "structuralResources#code", "managementAppLink" : "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/codelists/codelist;id=ISTAC:CL_GEO_GRANULARITIES(01.001)/code;id=ISLANDS"},
        {"order" : 3, "open" : true, "id" : "MUNICIPALITIES", "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).MUNICIPALITIES", "selfLink" : {"kind" : "structuralResources#code", "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_GEO_GRANULARITIES/01.001/codes/MUNICIPALITIES"}, "name" : {"text" : [
            {"value" : "Municipios", "lang" : "es"}
        ]}, "kind" : "structuralResources#code", "managementAppLink" : "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/codelists/codelist;id=ISTAC:CL_GEO_GRANULARITIES(01.001)/code;id=MUNICIPALITIES"},
        {"order" : 4, "open" : true, "id" : "PROVINCES", "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).PROVINCES", "selfLink" : {"kind" : "structuralResources#code", "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_GEO_GRANULARITIES/01.001/codes/PROVINCES"}, "name" : {"text" : [
            {"value" : "Provincias", "lang" : "es"}
        ]}, "kind" : "structuralResources#code", "managementAppLink" : "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/codelists/codelist;id=ISTAC:CL_GEO_GRANULARITIES(01.001)/code;id=PROVINCES"},
        {"order" : 5, "open" : true, "id" : "REGIONS", "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).REGIONS", "selfLink" : {"kind" : "structuralResources#code", "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_GEO_GRANULARITIES/01.001/codes/REGIONS"}, "name" : {"text" : [
            {"value" : "Comunidades AutÃ³nomas", "lang" : "es"}
        ]}, "kind" : "structuralResources#code", "managementAppLink" : "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/codelists/codelist;id=ISTAC:CL_GEO_GRANULARITIES(01.001)/code;id=REGIONS"}
    ], "kind" : "structuralResources#codes", "total" : 5, "selfLink" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_GEO_GRANULARITIES/01.001/codes"}
});