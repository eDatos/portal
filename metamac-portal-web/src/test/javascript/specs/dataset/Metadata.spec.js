describe("Dataset Metadata", function () {

    var Metadata = STAT4YOU.dataset.Metadata;

    var response;

    beforeEach(function () {
        response = {
            selectedLanguages : [
                "en", "es"
            ],
            metadata : {
                identifier : "LICENCIAS_OBRA_SUPERFICIE_CONSTRUIR_DESTINO_DESDE_",
                title : [
                    "EN Title",
                    "ES Title"
                ],
                creator : "Institut d'Estadística de les Illes Balears",
                creatorAcronym : "IBESTAT",
                modificationDate : "2012-06-30T14:38:08.000+02:00",
                providerModificationDate : "2012-06-29T14:43:00.000+02:00",
                publisher : "Stat4You",
                releaseDate : "2012-06-09T08:37:40.000+02:00",
                providerReleaseDate : "2009-08-07T09:00:00.000+02:00",
                frequency : "M",
                temporalCoverage : [],
                licenseURL : "http://www.ibestat.es/ibestat/page?f=default&p=aviso_legal",
                theme : [2],
                category : {
                    id : [
                        "3.3.3"
                    ],
                    label : {
                        "3.3.3" : ["Information society", "Sociedad de la información"]
                    }
                },
                language : {
                    id : ["en"],
                    label : {
                        en : "English"
                    }
                },
                dimension : {
                    id : ["id1", "id2"],
                    label : {
                        id1 : ["enid1", null],
                        id2 : ["enid2", null]
                    },
                    representation : {
                        id : {
                            id1 : ["id1a", "id1b"],
                            id2 : ["id2a", "id2b"]
                        },
                        label : {
                            id1 : {
                                id1a : ["enid1a", null],
                                id1b : ["enid1b"]
                            },
                            id2 : {
                                id2a : ["enid2a", null],
                                id2b : ["enid2b", null]
                            }
                        },
                        normCode : {
                            id1 : {
                                id1a : "NORMCODE_1",
                                id1b : "NORMCODE_2"
                            },
                            id2 : {
                                id2a : null,
                                id2b : null
                            }
                        },
                        hierarchy : {
                            id1 : {
                                id1b : "id1a"
                            }
                        }
                    },
                    type : [
                        "GEOGRAPHIC_DIMENSION",
                        "DIMENSION"
                    ]
                },
                attribute : { }
            }
        };
    });

    it("toJSON", function () {
        I18n.locale = 'es';
        I18n.defaultLocale = 'en';
        var metadata = new Metadata(response);
        var json = metadata.toJSON();
        expect(json).to.deep.equal({
                citation : undefined,
                provider : 'IBESTAT',
                title : 'ES Title',
                description : undefined,
                categories : [
                    { id : '3.3.3', label : 'Sociedad de la información' }
                ],
                languages : [
                    { id : 'en', label : 'n' }
                ],
                license : undefined,
                licenseUrl : undefined,
                dates : {
                    release : '2012-06-09T08:37:40.000+02:00',
                    modification : '2012-06-30T14:38:08.000+02:00',
                    providerRelease : '2009-08-07T09:00:00.000+02:00',
                    providerModification : '2012-06-29T14:43:00.000+02:00',
                    frecuency : undefined
                },
                measureDimension : undefined,
                dimensions : [
                    { id : 'id1', label : 'enid1', type : "GEOGRAPHIC_DIMENSION", hierarchy : true},
                    { id : 'id2', label : 'enid2', type : "DIMENSION", hierarchy : false}
                ]
            }
        );
    });

    it("get dimensions and representations", function () {
        I18n.locale = 'es';
        var metadata = new Metadata(response);

        var dims = metadata.getDimensionsAndRepresentations();

        expect(dims).to.eql([
            {
                id : 'id1',
                label : 'enid1',
                type : "GEOGRAPHIC_DIMENSION",
                hierarchy : true,
                representations : [
                    {id : 'id1a', label : 'enid1a', normCode : 'NORMCODE_1'},
                    {id : 'id1b', label : 'enid1b', normCode : 'NORMCODE_2', parent : 'id1a'}
                ]
            },
            {
                id : 'id2',
                label : 'enid2',
                type : "DIMENSION",
                hierarchy : false,
                representations : [
                    {id : 'id2a', label : 'enid2a', normCode : null},
                    {id : 'id2b', label : 'enid2b', normCode : null}
                ]
            }
        ]);

    });

    it("get total observations", function () {
        I18n.locale = 'es';
        var metadata = new Metadata(response);

        var total = metadata.getTotalObservations();
        expect(total).to.deep.equal(4);
    });

    it("getCategoryByNormCode", function () {
        I18n.locale = 'en';
        var metadata = new Metadata(response);
        var category = metadata.getCategoryByNormCode("id1", "NORMCODE_1");
        expect(category).to.deep.equal({id : "id1a", label : "enid1a", normCode : "NORMCODE_1"});
    });


    describe("getTimeDimensions", function () {

        it("should return the times dimensions", function () {
            I18n.locale = 'es';
            response.metadata.dimension.type[1] = 'TIME_DIMENSION';
            var metadata = new Metadata(response);
            expect(metadata.getTimeDimensions().length).to.deep.equal(1);
        });

        it("should return an empty array if it hasn't time dimensions", function () {
            I18n.locale = 'es';
            var metadata = new Metadata(response);
            expect(metadata.getTimeDimensions().length).to.deep.equal(0);
        });
    });

});