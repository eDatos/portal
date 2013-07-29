App.namespace('App.test.response.metadata');


App.test.response.metadata = {
    "id" : "dataset-identifier-01",
    "urn" : "urn:siemac:org.siemac.metamac.infomodel.statisticalresources.Dataset=ISTAC:dataset01(001.000)",
    "selfLink" : {
        "kind" : "statisticalResources#dataset",
        "href" : "http://localhost:8080/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/datasets/ISTAC/dataset01/001.000"
    },
    "parentLink" : {
        "kind" : "statisticalResources#datasets",
        "href" : "http://localhost:8080/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/datasets"
    },
    "name" : {
        "text" : [
            {
                "value" : "Título en español",
                "lang" : "es"
            }
        ]
    },
    "description" : {
        "text" : [
            {
                "value" : "Descripción en español",
                "lang" : "es"
            }
        ]
    },
    "selectedLanguages" : {
        "language" : [
            "es"
        ],
        "total" : 1
    },
    "metadata" : {
        "geographicCoverages" : {
            "resource" : [
                {
                    "id" : "code-01",
                    "urn" : "urn:uuidcode-01",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/e61da99a-0c15-4b2d-a91d-d8e5b1e20662"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Code 01",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "code-02",
                    "urn" : "urn:uuidcode-02",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/ae0080f2-4169-4d2f-81b9-d94217ab52af"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Code 02",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "code-03",
                    "urn" : "urn:uuidcode-03",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/7ec173bd-f3fc-4638-b221-b20e23b8783c"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Code 03",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                }
            ],
            "total" : 3
        },
        "temporalCoverages" : {
            "item" : [
                {
                    "id" : "2010",
                    "name" : {
                        "text" : [
                            {
                                "value" : "2010",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "2011",
                    "name" : {
                        "text" : [
                            {
                                "value" : "2011",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "2012",
                    "name" : {
                        "text" : [
                            {
                                "value" : "2012",
                                "lang" : "es"
                            }
                        ]
                    }
                }
            ],
            "total" : 3
        },
        "measureCoverages" : {
            "resource" : [
                {
                    "id" : "concept-01",
                    "urn" : "urn:uuidconcept-01",
                    "selfLink" : {
                        "kind" : "structuralResources#concept",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/4b82eb4f-b46f-4f27-960d-1db0170e0901"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Concept 01",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#concept"
                },
                {
                    "id" : "concept-02",
                    "urn" : "urn:uuidconcept-02",
                    "selfLink" : {
                        "kind" : "structuralResources#concept",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/132d6633-6a95-4a69-8c8a-50256421d66b"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Concept 02",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#concept"
                },
                {
                    "id" : "concept-03",
                    "urn" : "urn:uuidconcept-03",
                    "selfLink" : {
                        "kind" : "structuralResources#concept",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/760cf96b-8f2f-454f-b1c1-67361167e8ac"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Concept 03",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#concept"
                }
            ],
            "total" : 3
        },
        "geographicGranularities" : {
            "resource" : [
                {
                    "id" : "oDYtjaNy",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=MaintainerMock:CodelistMock(1.0).oDYtjaNy",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/oDYtjaNy"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "title-oDYtjaNy en Espanol",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                }
            ],
            "total" : 1
        },
        "temporalGranularities" : {
            "resource" : [
                {
                    "id" : "8xREIORf",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=MaintainerMock:CodelistMock(1.0).8xREIORf",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/8xREIORf"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "title-8xREIORf en Espanol",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                }
            ],
            "total" : 1
        },
        "relatedDsd" : {
            "showDecimals" : 3,
            "heading" : {
                "dimensionId" : [
                    "TIME_PERIOD",
                    "dimension1"
                ],
                "total" : 2
            },
            "stub" : {
                "dimensionId" : [
                    "measure01",
                    "espatial"
                ],
                "total" : 2
            },
            "id" : "DSD01",
            "urn" : "urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ISTAC:DSD01(01.000)",
            "selfLink" : {
                "kind" : "structuralResources#dataStructure",
                "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/XFddli0E"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "title-XFddli0E en Espanol",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#dataStructure"
        },
        "dimensions" : {
            "dimension" : [
                {
                    "id" : "dimension1",
                    "name" : {
                        "text" : [
                            {
                                "value" : "dimension 1",
                                "lang" : "es"
                            }
                        ]
                    },
                    "type" : "DIMENSION"
                },
                {
                    "id" : "dimension2",
                    "name" : {
                        "text" : [
                            {
                                "value" : "dimension 2",
                                "lang" : "es"
                            }
                        ]
                    },
                    "type" : "MEASURE_DIMENSION",
                    "dimensionValues" : {
                        "value" : [
                            {
                                "showDecimalsPrecision" : 4,
                                "id" : "measure01-conceptScheme01-concept01",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=agency01:measure01-conceptScheme01(01.000).measure01-conceptScheme01-concept01",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "measure01-conceptScheme01-concept01 en Español",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "parent" : "measure01-conceptScheme01-concept01",
                                "id" : "measure01-conceptScheme01-concept02",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=agency01:measure01-conceptScheme01(01.000).measure01-conceptScheme01-concept02",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "measure01-conceptScheme01-concept02 en Español",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "showDecimalsPrecision" : 1,
                                "id" : "measure01-conceptScheme01-concept05",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=agency01:measure01-conceptScheme01(01.000).measure01-conceptScheme01-concept05",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "measure01-conceptScheme01-concept05 en Español",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total" : 0
                    }
                },
                {
                    "id" : "dimension3",
                    "name" : {
                        "text" : [
                            {
                                "value" : "dimension 3",
                                "lang" : "es"
                            }
                        ]
                    },
                    "type" : "TIME_DIMENSION",
                    "dimensionValues" : {
                        "value" : [
                            {
                                "id" : "2012",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Año 2012",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "2011",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Año 2011",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "2010",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Año 2010",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total" : 3
                    }
                },
                {
                    "id" : "dimension4",
                    "name" : {
                        "text" : [
                            {
                                "value" : "dimension 4",
                                "lang" : "es"
                            }
                        ]
                    },
                    "type" : "GEOGRAPHIC_DIMENSION"
                }
            ],
            "total" : 4
        },
        "formatExtentDimensions" : 3,
        "dateNextUpdate" : "2013-08-02T12:21:40.294+01:00",
        "updateFrequency" : {
            "id" : "42Myt9cZ",
            "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=MaintainerMock:CodelistMock(1.0).42Myt9cZ",
            "selfLink" : {
                "kind" : "structuralResources#code",
                "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/42Myt9cZ"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "title-42Myt9cZ en Espanol",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#code"
        },
        "statisticOfficiality" : {
            "id" : "officiality",
            "name" : {
                "text" : [
                    {
                        "value" : "statisticOfficiality-officiality en Espanol",
                        "lang" : "es"
                    }
                ]
            }
        },
        "language" : {
            "id" : "yy8Sn6rx",
            "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=MaintainerMock:CodelistMock(1.0).yy8Sn6rx",
            "selfLink" : {
                "kind" : "structuralResources#code",
                "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/yy8Sn6rx"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "title-yy8Sn6rx en Espanol",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#code"
        },
        "languages" : {
            "resource" : [
                {
                    "id" : "es",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=MaintainerMock:CodelistMock(1.0).x3CUQjJX",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/x3CUQjJX"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Español",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "en",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=MaintainerMock:CodelistMock(1.0).036ty5Ku",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/036ty5Ku"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Ingles",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                }
            ],
            "total" : 2
        },
        "statisticalOperation" : {
            "id" : "YmYhCH24",
            "urn" : "urn:siemac:org.siemac.metamac.infomodel.statisticaloperations.Operation=YmYhCH24",
            "selfLink" : {
                "kind" : "statisticalOperations#operation",
                "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/YmYhCH24"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "title-YmYhCH24 en Espanol",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "statisticalOperations#operation"
        },
        "keywords" : {
            "text" : [
                {
                    "value" : "9ua8cN23j5 Espanol h5StSDjd5t",
                    "lang" : "es"
                }
            ]
        },
        "type" : "DATASET",
        "creator" : {
            "id" : "WIpbkNUb",
            "urn" : "urn:sdmx:org.sdmx.infomodel.base.OrganisationUnit=MaintainerMock:OrganizationUnitMock(1.0).WIpbkNUb",
            "selfLink" : {
                "kind" : "structuralResources#organisationUnit",
                "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/WIpbkNUb"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "title-WIpbkNUb en Espanol",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#organisationUnit"
        },
        "lastUpdate" : "2013-07-23T12:11:40.255+01:00",
        "publishers" : {
            "resource" : [
                {
                    "id" : "jUUizPuz",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.base.OrganisationUnit=MaintainerMock:OrganizationUnitMock(1.0).jUUizPuz",
                    "selfLink" : {
                        "kind" : "structuralResources#organisationUnit",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/jUUizPuz"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "title-jUUizPuz en Espanol",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#organisationUnit"
                }
            ],
            "total" : 1
        },
        "rightsHolder" : {
            "id" : "VeIxYyo6",
            "urn" : "urn:sdmx:org.sdmx.infomodel.base.OrganisationUnit=MaintainerMock:OrganizationUnitMock(1.0).VeIxYyo6",
            "selfLink" : {
                "kind" : "structuralResources#organisationUnit",
                "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/VeIxYyo6"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "title-VeIxYyo6 en Espanol",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#organisationUnit"
        },
        "license" : {
            "text" : [
                {
                    "value" : "Licencia en Español",
                    "lang" : "es"
                }
            ]
        },
        "maintainer" : {
            "id" : "ISTAC",
            "nestedId" : "ISTAC",
            "urn" : "urn:sdmx:org.sdmx.infomodel.base.Agency=SDMX:AGENCIES(1.0).ISTAC",
            "selfLink" : {
                "kind" : "structuralResources#agency",
                "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/ISTAC"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "ISTAC",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#agency"
        },
        "version" : "001.000",
        "versionRationaleTypes" : {
            "versionRationaleType" : [
                "MAJOR_NEW_RESOURCE"
            ],
            "total" : 1
        }
    },
    "kind" : "statisticalResources#dataset"
};

App.test.response.metadata = {
    "id" : "C00025A_000001",
    "urn" : "urn:siemac:org.siemac.metamac.infomodel.statisticalresources.Dataset=ISTAC:C00025A_000001(001.000)",
    "selfLink" : {
        "kind" : "statisticalResources#dataset",
        "href" : "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/datasets/ISTAC/C00025A_000001/001.000"
    },
    "parentLink" : {
        "kind" : "statisticalResources#datasets",
        "href" : "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/datasets"
    },
    "name" : {
        "text" : [
            {
                "value" : "Título en español",
                "lang" : "es"
            }
        ]
    },
    "description" : {
        "text" : [
            {
                "value" : "Descripción en español",
                "lang" : "es"
            }
        ]
    },
    "selectedLanguages" : {
        "language" : [
            "es"
        ],
        "total" : 1
    },
    "metadata" : {
        "geographicCoverages" : {
            "resource" : [
                {
                    "id" : "EL_HIERRO",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).EL_HIERRO",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_ISLAS_CANARIAS/01.001/codes/EL_HIERRO"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "El Hierro",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "LA_PALMA",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).LA_PALMA",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_ISLAS_CANARIAS/01.001/codes/LA_PALMA"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "La Palma",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "LA_GOMERA",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).LA_GOMERA",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_ISLAS_CANARIAS/01.001/codes/LA_GOMERA"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "La Gomera",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "TENERIFE",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).TENERIFE",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_ISLAS_CANARIAS/01.001/codes/TENERIFE"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Tenerife",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "GRAN_CANARIA",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).GRAN_CANARIA",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_ISLAS_CANARIAS/01.001/codes/GRAN_CANARIA"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Gran Canaria",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "FUERTEVENTURA",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).FUERTEVENTURA",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_ISLAS_CANARIAS/01.001/codes/FUERTEVENTURA"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Fuerteventura",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "LANZAROTE",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).LANZAROTE",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_ISLAS_CANARIAS/01.001/codes/LANZAROTE"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Lanzarote",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                }
            ],
            "total" : 7
        },
        "temporalCoverages" : {
            "item" : [
                {
                    "id" : "no_emun_code_11",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_11",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_9",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_9",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_0",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_0",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_7",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_7",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_13",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_13",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_3",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_3",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_4",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_4",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_5",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_5",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_6",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_6",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_1",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_1",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_14",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_14",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_8",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_8",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_10",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_10",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_12",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_12",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "id" : "no_emun_code_2",
                    "name" : {
                        "text" : [
                            {
                                "value" : "no_emun_code_2",
                                "lang" : "es"
                            }
                        ]
                    }
                }
            ],
            "total" : 15
        },
        "measureCoverages" : {
            "resource" : [
                {
                    "id" : "INDICE_OCUPACION_PLAZAS",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ISTAC:INDICES_CENSALES_OCUPACION_HOTELERA(01.000).INDICE_OCUPACION_PLAZAS",
                    "selfLink" : {
                        "kind" : "structuralResources#concept",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/conceptschemes/ISTAC/INDICES_CENSALES_OCUPACION_HOTELERA/01.000/concepts/INDICE_OCUPACION_PLAZAS"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Índice de ocupación de plazas",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#concept"
                },
                {
                    "id" : "INDICE_OCUPACION_HABITACIONES",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ISTAC:INDICES_CENSALES_OCUPACION_HOTELERA(01.000).INDICE_OCUPACION_HABITACIONES",
                    "selfLink" : {
                        "kind" : "structuralResources#concept",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/conceptschemes/ISTAC/INDICES_CENSALES_OCUPACION_HOTELERA/01.000/concepts/INDICE_OCUPACION_HABITACIONES"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Índice de ocupación de habitaciones",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#concept"
                }
            ],
            "total" : 2
        },
        "geographicGranularities" : {
            "resource" : [
                {
                    "id" : "COUNTRIES",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.000).COUNTRIES",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/ISTAC/CL_GEO_GRANULARITIES/01.000/codes/COUNTRIES"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Países",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "MUNICIPALITIES",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.000).MUNICIPALITIES",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/ISTAC/CL_GEO_GRANULARITIES/01.000/codes/MUNICIPALITIES"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Municipios",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "PROVINCES",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.000).PROVINCES",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/ISTAC/CL_GEO_GRANULARITIES/01.000/codes/PROVINCES"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Provincias",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "REGIONS",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.000).REGIONS",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/ISTAC/CL_GEO_GRANULARITIES/01.000/codes/REGIONS"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Comunidades Autónomas",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                }
            ],
            "total" : 4
        },
        "temporalGranularities" : {
            "resource" : [
                {
                    "id" : "A",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=SDMX:CL_FREQ(1.0).A",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/SDMX/CL_FREQ/1.0/codes/A"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Anual",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                }
            ],
            "total" : 1
        },
        "relatedDsd" : {
            "showDecimals" : 4,
            "heading" : {
                "dimensionId" : [
                    "INDICADORES",
                    "TIME_PERIOD"
                ],
                "total" : 2
            },
            "stub" : {
                "dimensionId" : [
                    "CATEGORIA_ALOJAMIENTO",
                    "DESTINO_ALOJAMIENTO"
                ],
                "total" : 2
            },
            "id" : "DSD_INDICE_OCUPACION",
            "urn" : "urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ISTAC:DSD_INDICE_OCUPACION(01.000)",
            "selfLink" : {
                "kind" : "structuralResources#dataStructure",
                "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/datastructures/ISTAC/DSD_INDICE_OCUPACION/01.000"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "Índice censal de ocupación por plazas o por habitaciones según categorías por municipios de alojamiento y periodos.",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#dataStructure"
        },
        "dimensions" : {
            "dimension" : [
                {
                    "id" : "TIME_PERIOD",
                    "name" : {
                        "text" : [
                            {
                                "value" : "Periodo de tiempo",
                                "lang" : "es"
                            }
                        ]
                    },
                    "type" : "TIME_DIMENSION",
                    "dimensionValues" : {
                        "value" : [
                            {
                                "id" : "no_emun_code_10",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_10",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_12",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_12",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_11",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_11",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_14",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_14",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_13",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_13",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_0",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_0",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_1",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_1",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_5",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_5",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_4",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_4",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_3",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_3",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_2",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_2",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_9",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_9",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_8",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_8",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_7",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_7",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "no_emun_code_6",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "no_emun_code_6",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total" : 15
                    }
                },
                {
                    "id" : "INDICADORES",
                    "name" : {
                        "text" : [
                            {
                                "value" : "Indicadores",
                                "lang" : "es"
                            }
                        ]
                    },
                    "type" : "MEASURE_DIMENSION",
                    "dimensionValues" : {
                        "value" : [
                            {
                                "id" : "INDICE_OCUPACION_PLAZAS",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ISTAC:INDICES_CENSALES_OCUPACION_HOTELERA(01.000).INDICE_OCUPACION_PLAZAS",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Índice de ocupación de plazas",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "showDecimalsPrecision" : 6,
                                "id" : "INDICE_OCUPACION_HABITACIONES",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ISTAC:INDICES_CENSALES_OCUPACION_HOTELERA(01.000).INDICE_OCUPACION_HABITACIONES",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Índice de ocupación de habitaciones",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total" : 2
                    }
                },
                {
                    "id" : "CATEGORIA_ALOJAMIENTO",
                    "name" : {
                        "text" : [
                            {
                                "value" : "Categoría del alojamiento",
                                "lang" : "es"
                            }
                        ]
                    },
                    "type" : "DIMENSION",
                    "dimensionValues" : {
                        "value" : [
                            {
                                "id" : "1_2_3_ESTRELLAS",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_CATEGORIA_ESTABLECIMIENTO_HOTELERO(01.000).1_2_3_ESTRELLAS",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "1, 2 y 3 estrellas",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "4_5_ESTRELLAS",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_CATEGORIA_ESTABLECIMIENTO_HOTELERO(01.000).4_5_ESTRELLAS",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "4 y 5 Estrellas",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "TOTAL",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_CATEGORIA_ESTABLECIMIENTO_HOTELERO(01.000).TOTAL",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Total",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total" : 3
                    }
                },
                {
                    "id" : "DESTINO_ALOJAMIENTO",
                    "name" : {
                        "text" : [
                            {
                                "value" : "Destino del alojamiento",
                                "lang" : "es"
                            }
                        ]
                    },
                    "type" : "GEOGRAPHIC_DIMENSION",
                    "dimensionValues" : {
                        "value" : [
                            {
                                "id" : "EL_HIERRO",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).EL_HIERRO",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "El Hierro",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "LA_PALMA",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).LA_PALMA",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "La Palma",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "LA_GOMERA",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).LA_GOMERA",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "La Gomera",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "TENERIFE",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).TENERIFE",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Tenerife",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "GRAN_CANARIA",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).GRAN_CANARIA",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Gran Canaria",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "FUERTEVENTURA",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).FUERTEVENTURA",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Fuerteventura",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id" : "LANZAROTE",
                                "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).LANZAROTE",
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Lanzarote",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total" : 7
                    }
                }
            ],
            "total" : 4
        },
        "formatExtentDimensions" : 4,
        "dateNextUpdate" : "2013-07-30T12:00:00+01:00",
        "updateFrequency" : {
            "id" : "M",
            "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=SDMX:CL_FREQ(1.0).M",
            "selfLink" : {
                "kind" : "structuralResources#code",
                "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/SDMX/CL_FREQ/1.0/codes/M"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "Mensual",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#code"
        },
        "statisticOfficiality" : {
            "id" : "STAT_OFF_0001",
            "name" : {
                "text" : [
                    {
                        "value" : "Oficialidad",
                        "lang" : "es"
                    }
                ]
            }
        },
        "language" : {
            "id" : "ES",
            "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_LANGUAJES(01.000).ES",
            "selfLink" : {
                "kind" : "structuralResources#code",
                "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/ISTAC/CL_LANGUAJES/01.000/codes/ES"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "Español",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#code"
        },
        "languages" : {
            "resource" : [
                {
                    "id" : "es",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=MaintainerMock:CodelistMock(1.0).x3CUQjJX",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/x3CUQjJX"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Español",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                },
                {
                    "id" : "en",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=MaintainerMock:CodelistMock(1.0).036ty5Ku",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/036ty5Ku"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Ingles",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                }
            ],
            "total" : 2
        },
        "statisticalOperation" : {
            "id" : "C00025A",
            "urn" : "urn:siemac:org.siemac.metamac.infomodel.statisticaloperations.Operation=C00025A",
            "selfLink" : {
                "kind" : "statisticalOperations#operation",
                "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/operations/C00025A"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "Estadística de la Evolución Histórica de la Población",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "statisticalOperations#operation"
        },
        "type" : "DATASET",
        "creator" : {
            "id" : "ISTAC",
            "urn" : "urn:sdmx:org.sdmx.infomodel.base.OrganisationUnit=ISTAC:UNIDADES_GOBCAN(02.000).ISTAC",
            "selfLink" : {
                "kind" : "structuralResources#organisationUnit",
                "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/organisationunitschemes/ISTAC/UNIDADES_GOBCAN/02.000/organisationunits/ISTAC"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "Instituto Canario de Estadística",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#organisationUnit"
        },
        "lastUpdate" : "2013-07-26T10:48:29.072+01:00",
        "publishers" : {
            "resource" : [
                {
                    "id" : "ISTAC",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.base.OrganisationUnit=ISTAC:UNIDADES_GOBCAN(02.000).ISTAC",
                    "selfLink" : {
                        "kind" : "structuralResources#organisationUnit",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/organisationunitschemes/ISTAC/UNIDADES_GOBCAN/02.000/organisationunits/ISTAC"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Instituto Canario de Estadística",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#organisationUnit"
                }
            ],
            "total" : 1
        },
        "maintainer" : {
            "id" : "ISTAC",
            "nestedId" : "ISTAC",
            "urn" : "urn:sdmx:org.sdmx.infomodel.base.Agency=SDMX:AGENCIES(1.0).ISTAC",
            "selfLink" : {
                "kind" : "structuralResources#agency",
                "href" : "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/ISTAC"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "ISTAC",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#agency"
        },
        "version" : "001.000",
        "versionRationaleTypes" : {
            "versionRationaleType" : [
                "MAJOR_NEW_RESOURCE"
            ],
            "total" : 1
        }
    },
    "kind" : "statisticalResources#dataset"
};