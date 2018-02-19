<%@page import="org.siemac.metamac.portal.web.diffusion.SwaggerUtils"%>
<%@page pageEncoding="UTF-8"%>
{
  "swagger": "2.0",
  "info": {
    "description": "Realizar exportaciones de los recursos estadísticos resulta una tarea común y de gran utilidad para poder tratar en el día a día con los datos manejados por el organismo. Esta API nos provee la funcionalidad necesaria para poder exportar los recursos estadísticos en diferentes formatos.",
    "version": "1.0",
    "title": "API de Exportaciones v1.0"
  },
  "host": "<%=SwaggerUtils.getExportApiBaseURLForSwagger()%>",
  "schemes": [],
  "tags": [
    {
      "name": "Exportaciones a ficheros PC-Axis",
      "description": ""
    },
    {
      "name": "Exportaciones a ficheros de texto plano",
      "description": ""
    },
    {
      "name": "Exportaciones a ficheros Excel",
      "description": ""
    },
    {
      "name": "Exportaciones a imágenes",
      "description": ""
    }
  ],
  "definitions": {
    "CaptchaImage1": {
      "type": "object",
      "title": "CaptchaImage1 (Anonymous)",
      "allOf": [
        {
          "properties": {
            "fFontSize": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "number"
            },
            "nHeight": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "number"
            },
            "nWidth": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "number"
            },
            "sFontName": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "string"
            },
            "sKeyword": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    },
    "CaptchaImage1Response": {
      "type": "object",
      "title": "CaptchaImage1Response (Anonymous)",
      "allOf": [
        {
          "properties": {
            "CaptchaImage1Result": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    },
    "CaptchaImage2": {
      "type": "object",
      "title": "CaptchaImage2 (Anonymous)",
      "allOf": [
        {
          "properties": {
            "nHeight": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "number"
            },
            "nWidth": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "number"
            },
            "sKeyword": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    },
    "CaptchaImage2Response": {
      "type": "object",
      "title": "CaptchaImage2Response (Anonymous)",
      "allOf": [
        {
          "properties": {
            "CaptchaImage2Result": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    },
    "CaptchaImageString": {
      "type": "object",
      "title": "CaptchaImageString (Anonymous)",
      "allOf": [
        {
          "properties": {
            "fFontSize": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "number"
            },
            "nHeight": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "number"
            },
            "nWidth": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "number"
            },
            "sFontName": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "string"
            },
            "sKeyword": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    },
    "CaptchaImageStringResponse": {
      "type": "object",
      "title": "CaptchaImageStringResponse (Anonymous)",
      "allOf": [
        {
          "properties": {
            "CaptchaImageStringResult": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    },
    "GetFontNames": {
      "type": "object",
      "title": "GetFontNames (Anonymous)",
      "allOf": [
        {}
      ],
      "description": ""
    },
    "GetFontNamesResponse": {
      "type": "object",
      "title": "GetFontNamesResponse (Anonymous)",
      "allOf": [
        {
          "properties": {
            "GetFontNamesResult": {
              "xml": {
                "namespace": "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    },
    "DatasetSelection": {
      "type": "object",
      "title": "DatasetSelection",
      "allOf": [
        {
          "properties": {
            "attributes": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelectionAttributes"
            },
            "dimensions": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelectionDimensions"
            }
          }
        }
      ],
      "description": ""
    },
    "DatasetSelectionAttribute": {
      "type": "object",
      "title": "DatasetSelectionAttribute",
      "allOf": [
        {
          "properties": {
            "attributeId": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "type": "string"
            },
            "labelVisualisationMode": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/LabelVisualisationMode"
            }
          }
        }
      ],
      "description": ""
    },
    "DatasetSelectionAttributes": {
      "type": "object",
      "title": "DatasetSelectionAttributes",
      "allOf": [
        {
          "$ref": "#/definitions/ListBase"
        },
        {
          "properties": {
            "attribute": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelectionAttribute"
            }
          }
        }
      ],
      "description": ""
    },
    "DatasetSelectionDimension": {
      "type": "object",
      "title": "DatasetSelectionDimension",
      "allOf": [
        {
          "properties": {
            "dimensionId": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "type": "string"
            },
            "dimensionValues": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DimensionValues"
            },
            "labelVisualisationMode": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/LabelVisualisationMode"
            },
            "position": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "type": "number"
            }
          }
        }
      ],
      "description": ""
    },
    "DatasetSelectionDimensions": {
      "type": "object",
      "title": "DatasetSelectionDimensions",
      "allOf": [
        {
          "$ref": "#/definitions/ListBase"
        },
        {
          "properties": {
            "dimension": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelectionDimension"
            }
          }
        }
      ],
      "description": ""
    },
    "DimensionValues": {
      "type": "object",
      "title": "DimensionValues",
      "allOf": [
        {
          "$ref": "#/definitions/ListBase"
        },
        {
          "properties": {
            "dimensionValue": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    },
    "ExcelExportation": {
      "type": "object",
      "title": "ExcelExportation",
      "allOf": [
        {
          "properties": {
            "datasetSelection": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelection"
            }
          }
        }
      ],
      "description": ""
    },
    "LabelVisualisationMode": {
      "type": "string",
      "title": "LabelVisualisationMode",
      "enum": [
        "CODE",
        "LABEL",
        "CODE_AND_LABEL"
      ],
      "description": ""
    },
    "PlainTextExportation": {
      "type": "object",
      "title": "PlainTextExportation",
      "allOf": [
        {
          "properties": {
            "datasetSelection": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelection"
            }
          }
        }
      ],
      "description": ""
    },
    "PxExportation": {
      "type": "object",
      "title": "PxExportation",
      "allOf": [
        {
          "properties": {
            "datasetSelection": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelection"
            }
          }
        }
      ],
      "description": ""
    },
    "ListBase": {
      "type": "object",
      "title": "ListBase",
      "allOf": [
        {
          "properties": {
            "firstLink": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "kind": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "lastLink": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "limit": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "number"
            },
            "nextLink": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "offset": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "number"
            },
            "previousLink": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "selfLink": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "total": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "number"
            }
          }
        }
      ],
      "description": ""
    },
    "ResourceLink": {
      "type": "object",
      "title": "ResourceLink",
      "allOf": [
        {
          "properties": {
            "href": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "kind": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    }
  },
  "paths": {
    "/v1.0/csv_comma/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros de texto plano"
        ],
        "description": "Permite realizar la exportación de un dataset en fichero CSV separado por comas.",
        "operationId": "resource__v1.0_csv_comma__agencyID___resourceID___version__exportDatasetToCsvComma_POST",
        "produces": [
          "application/xml"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Ejemplo: {\"datasetSelection\":{\"dimensions\":{\"dimension\":[{\"dimensionId\":\"TIME_PERIOD\",\"labelVisualisationMode\":\"LABEL\",\"position\":21,\"dimensionValues\":{\"dimensionValue\":[\"2013\",\"2013-M03\"]}},{\"dimensionId\":\"INDICADORES\",\"labelVisualisationMode\":\"LABEL\",\"position\":20,\"dimensionValues\":{\"dimensionValue\":[\"INDICE_OCUPACION_PLAZAS\"]}},{\"dimensionId\":\"CATEGORIA_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":0,\"dimensionValues\":{\"dimensionValue\":[\"TOTAL\"]}},{\"dimensionId\":\"DESTINO_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":1,\"dimensionValues\":{\"dimensionValue\":[\"EL_HIERRO\",\"LA_PALMA\",\"LA_GOMERA\",\"TENERIFE\",\"GRAN_CANARIA\",\"FUERTEVENTURA\",\"LANZAROTE\"]}}]}}}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "Versión del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/csv_semicolon/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros de texto plano"
        ],
        "description": "Permite realizar la exportación de un dataset en fichero CSV separado por puntos y comas.",
        "operationId": "resource__v1.0_csv_semicolon__agencyID___resourceID___version__exportDatasetToCsvSemicolon_POST",
        "produces": [
          "application/xml"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Ejemplo: {\"datasetSelection\":{\"dimensions\":{\"dimension\":[{\"dimensionId\":\"TIME_PERIOD\",\"labelVisualisationMode\":\"LABEL\",\"position\":21,\"dimensionValues\":{\"dimensionValue\":[\"2013\",\"2013-M03\"]}},{\"dimensionId\":\"INDICADORES\",\"labelVisualisationMode\":\"LABEL\",\"position\":20,\"dimensionValues\":{\"dimensionValue\":[\"INDICE_OCUPACION_PLAZAS\"]}},{\"dimensionId\":\"CATEGORIA_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":0,\"dimensionValues\":{\"dimensionValue\":[\"TOTAL\"]}},{\"dimensionId\":\"DESTINO_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":1,\"dimensionValues\":{\"dimensionValue\":[\"EL_HIERRO\",\"LA_PALMA\",\"LA_GOMERA\",\"TENERIFE\",\"GRAN_CANARIA\",\"FUERTEVENTURA\",\"LANZAROTE\"]}}]}}}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "Versión del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },   
    "/v1.0/excel/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros Excel"
        ],
        "description": "Permite realizar la exportación de un dataset en fichero Excel.",
        "operationId": "resource__v1.0_excel__datasets__agencyID___resourceID___version__exportDatasetToExcelForm_POST",
        "produces": [
          "application/xml"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Ejemplo: {\"datasetSelection\":{\"dimensions\":{\"dimension\":[{\"dimensionId\":\"TIME_PERIOD\",\"labelVisualisationMode\":\"LABEL\",\"position\":21,\"dimensionValues\":{\"dimensionValue\":[\"2013\",\"2013-M03\"]}},{\"dimensionId\":\"INDICADORES\",\"labelVisualisationMode\":\"LABEL\",\"position\":20,\"dimensionValues\":{\"dimensionValue\":[\"INDICE_OCUPACION_PLAZAS\"]}},{\"dimensionId\":\"CATEGORIA_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":0,\"dimensionValues\":{\"dimensionValue\":[\"TOTAL\"]}},{\"dimensionId\":\"DESTINO_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":1,\"dimensionValues\":{\"dimensionValue\":[\"EL_HIERRO\",\"LA_PALMA\",\"LA_GOMERA\",\"TENERIFE\",\"GRAN_CANARIA\",\"FUERTEVENTURA\",\"LANZAROTE\"]}}]}}}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "Versión del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
     "/v1.0/excel/indicators/{resourceID}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros Excel"
        ],
        "description": "Permite realizar la exportación de un indicador en fichero Excel.",
        "operationId": "resource__v1.0_excel__indicators__agencyID___resourceID___version__exportDatasetToExcelForm_POST",
        "produces": [
          "application/xml"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Ejemplo: {\"datasetSelection\":{\"dimensions\":{\"dimension\":[{\"dimensionId\":\"TIME_PERIOD\",\"labelVisualisationMode\":\"LABEL\",\"position\":21,\"dimensionValues\":{\"dimensionValue\":[\"2013\",\"2013-M03\"]}},{\"dimensionId\":\"INDICADORES\",\"labelVisualisationMode\":\"LABEL\",\"position\":20,\"dimensionValues\":{\"dimensionValue\":[\"INDICE_OCUPACION_PLAZAS\"]}},{\"dimensionId\":\"CATEGORIA_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":0,\"dimensionValues\":{\"dimensionValue\":[\"TOTAL\"]}},{\"dimensionId\":\"DESTINO_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":1,\"dimensionValues\":{\"dimensionValue\":[\"EL_HIERRO\",\"LA_PALMA\",\"LA_GOMERA\",\"TENERIFE\",\"GRAN_CANARIA\",\"FUERTEVENTURA\",\"LANZAROTE\"]}}]}}}"
          },         
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },         
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/image": {
      "post": {
        "tags": [
          "Exportaciones a imágenes"
        ],
        "description": "Permite realizar una exportación a una imagen SVG.",
        "operationId": "resource__v1.0_image_exportSvgToImageForm_POST",
        "produces": [
          "application/xml"
        ],
        "parameters": [
          {
            "name": "svg",
            "in": "formData",
            "type": "string",
            "description": ""
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "type",
            "in": "query",
            "type": "string",
            "description": ""
          },
          {
            "name": "width",
            "in": "query",
            "type": "string",
            "description": ""
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/px/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros PC-Axis"
        ],
        "description": "Permite realizar la exportación de un dataset en fichero PC-Axis (.px).",
        "operationId": "resource__v1.0_px__agencyID___resourceID___version__exportDatasetToPxForm_POST",
        "produces": [
          "application/xml"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Ejemplo: {\"datasetSelection\":{\"dimensions\":{\"dimension\":[{\"dimensionId\":\"TIME_PERIOD\",\"labelVisualisationMode\":\"LABEL\",\"position\":21,\"dimensionValues\":{\"dimensionValue\":[\"2013\",\"2013-M03\"]}},{\"dimensionId\":\"INDICADORES\",\"labelVisualisationMode\":\"LABEL\",\"position\":20,\"dimensionValues\":{\"dimensionValue\":[\"INDICE_OCUPACION_PLAZAS\"]}},{\"dimensionId\":\"CATEGORIA_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":0,\"dimensionValues\":{\"dimensionValue\":[\"TOTAL\"]}},{\"dimensionId\":\"DESTINO_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":1,\"dimensionValues\":{\"dimensionValue\":[\"EL_HIERRO\",\"LA_PALMA\",\"LA_GOMERA\",\"TENERIFE\",\"GRAN_CANARIA\",\"FUERTEVENTURA\",\"LANZAROTE\"]}}]}}}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "Versión del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/tsv/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros de texto plano"
        ],
        "description": "Permite realizar la exportación de un dataset en fichero separado por tabuladores.",
        "operationId": "resource__v1.0_tsv__agencyID___resourceID___version__exportDatasetToTsv_POST",
        "produces": [
          "application/xml"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Ejemplo: {\"datasetSelection\":{\"dimensions\":{\"dimension\":[{\"dimensionId\":\"TIME_PERIOD\",\"labelVisualisationMode\":\"LABEL\",\"position\":21,\"dimensionValues\":{\"dimensionValue\":[\"2013\",\"2013-M03\"]}},{\"dimensionId\":\"INDICADORES\",\"labelVisualisationMode\":\"LABEL\",\"position\":20,\"dimensionValues\":{\"dimensionValue\":[\"INDICE_OCUPACION_PLAZAS\"]}},{\"dimensionId\":\"CATEGORIA_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":0,\"dimensionValues\":{\"dimensionValue\":[\"TOTAL\"]}},{\"dimensionId\":\"DESTINO_ALOJAMIENTO\",\"labelVisualisationMode\":\"LABEL\",\"position\":1,\"dimensionValues\":{\"dimensionValue\":[\"EL_HIERRO\",\"LA_PALMA\",\"LA_GOMERA\",\"TENERIFE\",\"GRAN_CANARIA\",\"FUERTEVENTURA\",\"LANZAROTE\"]}}]}}}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "Versión del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    }
  }
}