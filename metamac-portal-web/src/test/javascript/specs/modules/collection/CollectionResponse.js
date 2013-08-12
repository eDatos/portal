App.test.response.collection = {
    "id" : "E30308A_000001",
    "urn" : "urn:siemac:org.siemac.metamac.infomodel.statisticalresources.Collection=ISTAC:E30308A_000001(001.000)",
    "selfLink" : {
        "kind" : "statisticalResources#collection",
        "href" : "http://localhost:8080/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/collections/ISTAC/E30308A_000001/001.000"
    },
    "parentLink" : {
        "kind" : "statisticalResources#collections",
        "href" : "http://localhost:8080/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/collections"
    },
    "name" : {
        "text" : [
            {
                "value" : "Colección 1",
                "lang" : "es"
            }
        ]
    },
    "description" : {
        "text" : [
            {
                "value" : "Descripcion 1",
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
                        "value" : "EspaÃ±ol",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "structuralResources#code"
        },
        "languages" : {
            "resource" : [
                {
                    "id" : "ES",
                    "urn" : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_LANGUAJES(01.000).ES",
                    "selfLink" : {
                        "kind" : "structuralResources#code",
                        "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/ISTAC/CL_LANGUAJES/01.000/codes/ES"
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "EspaÃ±ol",
                                "lang" : "es"
                            }
                        ]
                    },
                    "kind" : "structuralResources#code"
                }
            ],
            "total" : 1
        },
        "statisticalOperation" : {
            "id" : "E30308A",
            "urn" : "urn:siemac:org.siemac.metamac.infomodel.statisticaloperations.Operation=E30308A",
            "selfLink" : {
                "kind" : "statisticalOperations#operation",
                "href" : "http://estadisticas.arte-consultores.com/metamac-statistical-operations-external-web/apis/operations/latest/operations/E30308A"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "Encuesta de PoblaciÃ³n Activa",
                        "lang" : "es"
                    }
                ]
            },
            "kind" : "statisticalOperations#operation"
        },
        "keywords" : {
            "text" : [
                {
                    "value" : "CapÃ­tulo",
                    "lang" : "es"
                }
            ]
        },
        "type" : "COLLECTION",
        "lastUpdate" : "2013-08-07T08:08:06.411+01:00",
        "maintainer" : {
            "id" : "ISTAC",
            "nestedId" : "ISTAC",
            "urn" : "urn:sdmx:org.sdmx.infomodel.base.Agency=SDMX:AGENCIES(1.0).ISTAC",
            "selfLink" : {
                "kind" : "structuralResources#agency",
                "href" : "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/agencyschemes/SDMX/AGENCIES/1.0/agencies/ISTAC"
            },
            "name" : {
                "text" : [
                    {
                        "value" : "Instituto Canario de EstadÃ­stica",
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
    "data" : {
        "nodes" : {
            "node" : [
                {
                    "nodes" : {
                        "node" : [
                            {
                                "query" : {
                                    "id" : "QueryFixed",
                                    "urn" : "urn:siemac:org.siemac.metamac.infomodel.statisticalresources.Query=ISTAC:QueryFixed(001.000)",
                                    "selfLink" : {
                                        "kind" : "statisticalResources#query",
                                        "href" : "http://localhost:8080/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/queries/ISTAC/QueryFixed"
                                    },
                                    "name" : {
                                        "text" : [
                                            {
                                                "value" : "Query Fixed",
                                                "lang" : "es"
                                            }
                                        ]
                                    },
                                    "kind" : "statisticalResources#query"
                                },
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Cube 2 query fixed",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Capítulo 1",
                                "lang" : "es"
                            }
                        ]
                    },
                    "description" : {
                        "text" : [
                            {
                                "value" : "Descripción Capítulo 1",
                                "lang" : "es"
                            }
                        ]
                    }
                },
                {
                    "nodes" : {
                        "node" : [
                            {
                                "query" : {
                                    "id" : "QueryAutoincremental",
                                    "urn" : "urn:siemac:org.siemac.metamac.infomodel.statisticalresources.Query=ISTAC:QueryAutoincremental(001.000)",
                                    "selfLink" : {
                                        "kind" : "statisticalResources#query",
                                        "href" : "http://localhost:8080/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/queries/ISTAC/QueryAutoincremental"
                                    },
                                    "name" : {
                                        "text" : [
                                            {
                                                "value" : "Query autoincremental",
                                                "lang" : "es"
                                            }
                                        ]
                                    },
                                    "kind" : "statisticalResources#query"
                                },
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Cube 3 autoincremental",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "nodes" : {
                                    "node" : [
                                        {
                                            "dataset" : {
                                                "id" : "E30308A_000001",
                                                "urn" : "urn:siemac:org.siemac.metamac.infomodel.statisticalresources.Dataset=ISTAC:E30308A_000001(001.000)",
                                                "selfLink" : {
                                                    "kind" : "statisticalResources#dataset",
                                                    "href" : "http://localhost:8080/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/datasets/ISTAC/E30308A_000001/001.000"
                                                },
                                                "name" : {
                                                    "text" : [
                                                        {
                                                            "value" : "Dataset 1",
                                                            "lang" : "es"
                                                        }
                                                    ]
                                                },
                                                "kind" : "statisticalResources#dataset"
                                            },
                                            "name" : {
                                                "text" : [
                                                    {
                                                        "value" : "Cube 1 dataset",
                                                        "lang" : "es"
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                "name" : {
                                    "text" : [
                                        {
                                            "value" : "Capítulo 2A",
                                            "lang" : "es"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "name" : {
                        "text" : [
                            {
                                "value" : "Capítulo 2",
                                "lang" : "es"
                            }
                        ]
                    }
                }
            ]
        }
    },
    "kind" : "statisticalResources#collection"
};
