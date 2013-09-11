/**
 *
 */

describe("Search view", function () {

    "use strict";

    describe("Query Model", function () {
        it("should toggle the user selectedFacets", function () {

            var queryModel = new App.modules.search.SearchQueryModel();
            queryModel.toggleFacet({fieldName : "facet1", code : "code1"});
            queryModel.toggleFacet({fieldName : "facet1", code : "code2"});

            expect(queryModel.get('facets')).to.deep.equal({facet1 : ["code1", "code2"]});

            queryModel.toggleFacet({fieldName : "facet2", code : "code1"});
            expect(queryModel.get('facets')).to.deep.equal({facet1 : ["code1", "code2"], facet2 : ["code1"]});

            queryModel.toggleFacet({fieldName : "facet1", code : "code1"});
            expect(queryModel.get('facets')).to.deep.equal({facet1 : ["code2"], facet2 : ["code1"]});

            queryModel.toggleFacet({fieldName : "facet1", code : "code2"});
            expect(queryModel.get('facets')).to.deep.equal({facet2 : ["code1"]});

            queryModel.toggleFacet({fieldName : "facet2", code : "code1"});
            expect(queryModel.get('facets')).to.deep.equal({});
        });

        it("should prepare the url parameters", function () {
            var queryModel = new App.modules.search.SearchQueryModel({
                query : 'busqueda',
                facets : {
                    facet1 : ["code1", "code2", "code3"],
                    facet2 : ["code1"]
                }
            });

            var urlParameters = queryModel.toURLParameters();
            expect(urlParameters).to.deep.equal({
                query : "busqueda",
                facet1 : ["code1", "code2", "code3"],
                facet2 : ["code1"]
            });
        });

        it("should trigger change on toggle facets", function () {
            var queryModel = new App.modules.search.SearchQueryModel();

            var callback = sinon.spy();
            queryModel.on("change", callback);
            queryModel.toggleFacet({fieldName : "facet1", code : "code1"});
            expect(callback.called).to.be.true;

            var callback2 = sinon.spy();
            queryModel.on("change:facets", callback2);
            queryModel.toggleFacet({fieldName : "facet1", code : "code1"});
            expect(callback2.called).to.be.true;
        });
    });

    describe("Facets Collection", function () {
        beforeEach(function () {
            this.facetsCollection = new App.modules.search.SearchFacetsCollection();
            this.callback = sinon.spy();
        });

        it("should filter the selected facets", function () {
            var facetsFromServer = [
                {
                    field : "FF_FREQ_CODEDIMS",
                    locale : "es",
                    constraints : [
                        {
                            code : "2003",
                            label : "2003",
                            count : 127,
                            selected : false
                        },
                        {
                            code : "2002",
                            label : "2002",
                            count : 120,
                            selected : true
                        },
                        {
                            code : "2007",
                            label : "2007",
                            count : 114,
                            selected : true
                        }
                    ],
                    fieldName : "ff_frequent_codedims_es",
                    filterQuery : "",
                    selectedConstraints : [ ]
                }
            ];

            this.facetsCollection.setFacets(facetsFromServer);
            var selectedFacets = this.facetsCollection.selectedFacetsFromServer();

            expect(selectedFacets[0].constraints).to.deep.equal([
                {
                    code : "2002",
                    label : "2002",
                    count : 120,
                    selected : true
                },
                {
                    code : "2007",
                    label : "2007",
                    count : 114,
                    selected : true
                }
            ]);
        });

        it("should limit the facets constraints to the default limit", function () {
            this.facetsCollection.setFacets([
                {fieldName : 'f1', constraints : ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12"]},
                {fieldName : 'f2', constraints : ["c1", "c2", "c3", "c4", "c5"]}
            ]);

            var visibleFacets = this.facetsCollection.visibleFacets();
            expect(visibleFacets[0].constraints.length).to.deep.equal(10);
            expect(visibleFacets[0].showingAll).to.be.undefined;
            expect(visibleFacets[0].limited).to.be.true;

            expect(visibleFacets[1].constraints.length).to.deep.equal(5);
            expect(visibleFacets[1].showingAll).to.be.true;
            expect(visibleFacets[1].limited).to.be.false;
        });

        it("should not limit the facets contraints if the limit is -1", function () {
            this.facetsCollection.setFacets([
                {fieldName : 'f1', constraints : ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12"]},
                {fieldName : 'f2', constraints : ["c1", "c2", "c3", "c4", "c5"]}
            ]);

            this.facetsCollection.showMoreFacet('f1');
            this.facetsCollection.showMoreFacet('f2');

            var visibleFacets = this.facetsCollection.visibleFacets();

            expect(visibleFacets[0].constraints.length).to.deep.equal(12);
            expect(visibleFacets[0].showingAll).to.be.true;
            expect(visibleFacets[0].limited).to.be.true;

            expect(visibleFacets[1].constraints.length).to.deep.equal(5);
            expect(visibleFacets[1].showingAll).to.be.true;
            expect(visibleFacets[1].limited).to.be.false;
        });

        it("should trigger change event on showMoreFacets", function () {
            this.facetsCollection.setFacets([
                {fieldName : 'f1', constraints : ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12"]},
                {fieldName : 'f2', constraints : ["c1", "c2", "c3", "c4", "c5"]}
            ]);
            this.facetsCollection.on("change", this.callback);
            this.facetsCollection.showMoreFacet('f1');
            expect(this.callback.called).to.be.true;
        });

        it("should trigger change event on showLessFacets", function () {
            this.facetsCollection.setFacets([
                {fieldName : 'f1', constraints : ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12"]},
                {fieldName : 'f2', constraints : ["c1", "c2", "c3", "c4", "c5"]}
            ]);
            this.facetsCollection.showMoreFacet('f1');
            this.facetsCollection.on("change", this.callback);
            this.facetsCollection.showLessFacet('f1');
            expect(this.callback.called).to.be.true;
        });

        it("should populate the facet label", function () {
            I18n.locale = 'es';
            I18n.translations = {
                es : {
                    idxmanager : {
                        facet : {
                            f0 : 'F0',
                            f1 : 'F1'
                        }
                    }
                }
            };

            this.facetsCollection.setFacets([
                {field : 'f0'},
                {field : 'f1'}
            ]);
            var facets = this.facetsCollection.facetsWithLabels();
            expect(facets[0].label).to.deep.equal("F0");
            expect(facets[1].label).to.deep.equal("F1");
        });

        it("should trigger activeProvider undefined when no facet provider selected", function () {
            this.facetsCollection.on("activeProvider", this.callback);
            this.facetsCollection.setFacets([
                {fieldName : "f1"}
            ]);
            expect(this.callback.calledWith(undefined)).to.be.true;
        });

        it("should trigger activeProvider when a facet is selected", function () {
            this.facetsCollection.on("activeProvider", this.callback);
            this.facetsCollection.setFacets([
                {
                    field : "FF_DS_PROV_ACRONYM",
                    constraints : [
                        {
                            code : "INE",
                            selected : true
                        },
                        {
                            code : "ISTAC",
                            selected : false
                        }
                    ]
                }
            ]);
            expect(this.callback.calledWith("INE")).to.be.true;
        });

        it("should trigger activeProvider undefined when multiple providers selected", function () {
            this.facetsCollection.on("activeProvider", this.callback);
            this.facetsCollection.setFacets([
                {
                    field : "FF_DS_PROV_ACRONYM",
                    constraints : [
                        {
                            code : "INE",
                            selected : true
                        },
                        {
                            code : "ISTAC",
                            selected : true
                        }
                    ]
                }
            ]);
            expect(this.callback.calledWith(undefined)).to.be.true;
        });

    });

    describe("Result Collection", function () {
        it("should parse the response and call the facetsCollection reset if not filtered", function () {
            var facetsCollection = new App.modules.search.SearchFacetsCollection();

            var resultsCollection = new App.modules.search.SearchResultsCollection([], {facetsCollection : facetsCollection});

            var callback = sinon.spy();
            resultsCollection.on("change:facets", callback);

            var parsed = resultsCollection.parse({
                locale : "es",
                query : "periodo",
                total : 10,
                faceted : false,
                facets : [],
                items : [1, 2]
            });

            expect(callback.called).to.be.false;

            expect(resultsCollection.total).to.deep.equal(10);
            expect(parsed).to.deep.equal([1, 2]);

            parsed = resultsCollection.parse({
                locale : "es",
                query : "periodo",
                total : 20,
                faceted : true,
                facets : ["f1", "f2"],
                items : [3, 4]
            });

            expect(resultsCollection.total).to.deep.equal(20);
            expect(parsed).to.deep.equal([3, 4]);

            expect(callback.calledWith(["f1", "f2"])).to.be.true;
        });
    });

});