/**
 *
 */

describe("Search view", function(){

    describe("Query Model", function(){
        it("should toggle the user selectedFacets", function(){

            var queryModel = new STAT4YOU.modules.Search.QueryModel();
            queryModel.toggleFacet({fieldName : "facet1", code : "code1"});
            queryModel.toggleFacet({fieldName : "facet1", code : "code2"});

            expect(queryModel.get('facets')).toEqual({facet1 : ["code1", "code2"]});

            queryModel.toggleFacet({fieldName : "facet2", code : "code1"});
            expect(queryModel.get('facets')).toEqual({facet1 : ["code1", "code2"], facet2 : ["code1"]});

            queryModel.toggleFacet({fieldName : "facet1", code : "code1"});
            expect(queryModel.get('facets')).toEqual({facet1 : ["code2"], facet2 : ["code1"]});

            queryModel.toggleFacet({fieldName : "facet1", code : "code2"});
            expect(queryModel.get('facets')).toEqual({facet2 : ["code1"]});

            queryModel.toggleFacet({fieldName : "facet2", code : "code1"});
            expect(queryModel.get('facets')).toEqual({});
        });

        it("should prepare the url parameters", function(){
            var queryModel = new STAT4YOU.modules.Search.QueryModel({
                query : 'busqueda',
                facets : {
                    facet1 : ["code1", "code2", "code3"],
                    facet2 : ["code1"]
                }
            });

            var urlParameters = queryModel.toURLParameters();
            expect(urlParameters).toEqual({
                q : "busqueda",
                facet1 : ["code1", "code2", "code3"],
                facet2 : ["code1"]
            })
        });

        it("should trigger change on toggle facets", function(){
            var queryModel = new STAT4YOU.modules.Search.QueryModel();

            var callback = jasmine.createSpy();
            queryModel.on("change", callback);
            queryModel.toggleFacet({fieldName : "facet1", code : "code1"});
            expect(callback).toHaveBeenCalled();

            var callback2 = jasmine.createSpy();
            queryModel.on("change:facets", callback2);
            queryModel.toggleFacet({fieldName : "facet1", code : "code1"});
            expect(callback2).toHaveBeenCalled();
        });
    })

    describe("Facets Collection", function(){
        beforeEach(function(){
            this.facetsCollection = new STAT4YOU.modules.Search.FacetsCollection();
            this.callback = jasmine.createSpy();
        });

        it("should filter the selected facets", function(){
            var facetsFromServer = [
                {
                    field: "FF_FREQ_CODEDIMS",
                    locale: "es",
                    constraints: [
                        {
                            code: "2003",
                            label: "2003",
                            count: 127,
                            selected: false
                        },
                        {
                            code: "2002",
                            label: "2002",
                            count: 120,
                            selected: true
                        },
                        {
                            code: "2007",
                            label: "2007",
                            count: 114,
                            selected: true
                        }
                    ],
                    fieldName: "ff_frequent_codedims_es",
                    filterQuery: "",
                    selectedConstraints: [ ]
                }
            ];

            this.facetsCollection.setFacets(facetsFromServer)
            var selectedFacets = this.facetsCollection.selectedFacetsFromServer();

            expect(selectedFacets[0].constraints).toEqual([
                {
                    code: "2002",
                    label: "2002",
                    count: 120,
                    selected: true
                },
                {
                    code: "2007",
                    label: "2007",
                    count: 114,
                    selected: true
                }
            ]);
        })

        it("should limit the facets constraints to the default limit", function(){
            this.facetsCollection.setFacets([
                {fieldName : 'f1', constraints: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12"]},
                {fieldName : 'f2', constraints: ["c1", "c2", "c3", "c4", "c5"]}
            ]);

            var visibleFacets = this.facetsCollection.visibleFacets();
            expect(visibleFacets[0].constraints.length).toEqual(10);
            expect(visibleFacets[0].showingAll).toBeFalsy();
            expect(visibleFacets[0].limited).toBeTruthy();

            expect(visibleFacets[1].constraints.length).toEqual(5);
            expect(visibleFacets[1].showingAll).toBeTruthy();
            expect(visibleFacets[1].limited).toBeFalsy();
        });

        it("should not limit the facets contraints if the limit is -1", function(){
            this.facetsCollection.setFacets([
                {fieldName : 'f1', constraints: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12"]},
                {fieldName : 'f2', constraints: ["c1", "c2", "c3", "c4", "c5"]}
            ]);

            this.facetsCollection.showMoreFacet('f1');
            this.facetsCollection.showMoreFacet('f2');

            var visibleFacets = this.facetsCollection.visibleFacets();

            expect(visibleFacets[0].constraints.length).toEqual(12);
            expect(visibleFacets[0].showingAll).toBeTruthy();
            expect(visibleFacets[0].limited).toBeTruthy();

            expect(visibleFacets[1].constraints.length).toEqual(5);
            expect(visibleFacets[1].showingAll).toBeTruthy();
            expect(visibleFacets[1].limited).toBeFalsy();
        });

        it("should trigger change event on showMoreFacets", function(){
            this.facetsCollection.setFacets([
                {fieldName : 'f1', constraints: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12"]},
                {fieldName : 'f2', constraints: ["c1", "c2", "c3", "c4", "c5"]}
            ]);
            this.facetsCollection.on("change", this.callback);
            this.facetsCollection.showMoreFacet('f1');
            expect(this.callback).toHaveBeenCalled();
        });

        it("should trigger change event on showLessFacets", function(){
            this.facetsCollection.setFacets([
                {fieldName : 'f1', constraints: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12"]},
                {fieldName : 'f2', constraints: ["c1", "c2", "c3", "c4", "c5"]}
            ]);
            this.facetsCollection.showMoreFacet('f1');
            this.facetsCollection.on("change", this.callback);
            this.facetsCollection.showLessFacet('f1');
            expect(this.callback).toHaveBeenCalled();
        });

        it("should populate the facet label", function(){
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
            expect(facets[0].label).toEqual("F0");
            expect(facets[1].label).toEqual("F1");
        });

        it("should trigger activeProvider undefined when no facet provider selected", function(){
            this.facetsCollection.on("activeProvider", this.callback);
            this.facetsCollection.setFacets([
                {fieldName : "f1"}
            ]);
            expect(this.callback).toHaveBeenCalledWith(undefined);
        });

        it("should trigger activeProvider when a facet is selected", function(){
            this.facetsCollection.on("activeProvider", this.callback);
            this.facetsCollection.setFacets([
                {
                    field : "FF_DS_PROV_ACRONYM",
                    constraints: [
                        {
                            code: "INE",
                            selected : true
                        },
                        {
                            code: "ISTAC",
                            selected : false
                        }
                    ]
                }
            ]);
            expect(this.callback).toHaveBeenCalledWith("INE");
        });

        it("should trigger activeProvider undefined when multiple providers selected", function(){
            this.facetsCollection.on("activeProvider", this.callback);
            this.facetsCollection.setFacets([
                {
                    field : "FF_DS_PROV_ACRONYM",
                    constraints: [
                        {
                            code: "INE",
                            selected : true
                        },
                        {
                            code: "ISTAC",
                            selected : true
                        }
                    ]
                }
            ]);
            expect(this.callback).toHaveBeenCalledWith(undefined);
        });

    });

    describe("Result Collection", function(){
        it("should parse the response and call the facetsCollection reset if not filtered", function(){
            var facetsCollection = new STAT4YOU.modules.Search.FacetsCollection();

            var resultsCollection = new STAT4YOU.modules.Search.ResultsCollection([], {facetsCollection : facetsCollection});

            var callback = jasmine.createSpy();
            resultsCollection.on("change:facets", callback);

            var parsed = resultsCollection.parse({
                locale: "es",
                query: "periodo",
                numFound: 10,
                faceted : false,
                facets: [],
                results: [1, 2]
            });

            expect(callback).not.toHaveBeenCalled()

            expect(resultsCollection.numFound).toEqual(10);
            expect(parsed).toEqual([1, 2]);

            parsed = resultsCollection.parse({
                locale: "es",
                query: "periodo",
                numFound: 20,
                faceted : true,
                facets: ["f1", "f2"],
                results: [3, 4]
            });

            expect(resultsCollection.numFound).toEqual(20);
            expect(parsed).toEqual([3, 4]);

            expect(callback).toHaveBeenCalledWith(["f1", "f2"]);
        });
    });

    describe("Router", function(){

        beforeEach(function(){
            this.router = new STAT4YOU.modules.Search.Router();
        });

        it("should parse the url parameters", function(){
            var params = this.router.parseUrlParams("q=query&facet1=code1&facet1=code2&facet2=code1");
            expect(params).toEqual({
                                    query : 'query',
                                    facets : {
                                        facet1 : ['code1', 'code2'],
                                        facet2 : ['code1']
                                    }
                                   });

            var params = this.router.parseUrlParams("facet1=code1&facet1=code2&facet2=code1");
            expect(params).toEqual({
                query : '',
                facets : {
                    facet1 : ['code1', 'code2'],
                    facet2 : ['code1']
                }
            });

            var params = this.router.parseUrlParams("badurl");
            expect(params).toEqual({
                query : '',
                facets : {}
            })


        });

        it("should parse correctly query with spaces", function(){
            var params = this.router.parseUrlParams("q=periodo+anual");
            expect(params).toEqual({
                query : "periodo anual",
                facets : {}
            });
        });

    });

    describe("View", function(){



        describe("search input", function(){
            describe("isSpaceKey", function(){
                it("should detect space press on ff & webkit", function(){
                    var view = new STAT4YOU.modules.Search.View(),
                        keyEvent;

                    keyEvent = $.Event("keypress");
                    keyEvent.ctrlKey = false;

                    keyEvent.which = 32;
                    expect(view.isSpaceKey(keyEvent)).toBeTruthy();

                    keyEvent.which = 40;
                    expect(view.isSpaceKey(keyEvent)).toBeFalsy();
                });
            });
        });
    });
});