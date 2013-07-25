describe("SearchIndexRouter", function () {

    var router;

    beforeEach(function () {
        router = new STAT4YOU.modules.search.SearchIndexRouter();
    });

    describe("parseQueryParams", function () {

        var mockQueryParams = function (queryParams) {
            sinon.stub(router, "_locationSearch").returns(queryParams);
        }

        it("should parse requests with query and facets", function () {
            mockQueryParams("?query=query&facet1=code1&facet1=code2&facet2=code1");
            var params = router.parseQueryParams();
            expect(params).to.eql({
                query : 'query',
                facets : {
                    facet1 : ['code1', 'code2'],
                    facet2 : ['code1']
                }
            });
        });

        it("should parse requests without query", function () {
            mockQueryParams("?facet1=code1&facet1=code2&facet2=code1");
            var params = router.parseQueryParams();
            expect(params).to.eql({
                query : '',
                facets : {
                    facet1 : ['code1', 'code2'],
                    facet2 : ['code1']
                }
            });
        });

        it("should parse bad requests", function () {
            mockQueryParams("?badurl");
            var params = router.parseQueryParams();
            expect(params).to.eql({
                query : '',
                facets : {}
            });
        });


        it("should parse requests with spaces in query", function () {
            mockQueryParams("?query=periodo+anual");
            var params = router.parseQueryParams();
            expect(params).to.eql({
                query : "periodo anual",
                facets : {}
            });
        });

    });
});