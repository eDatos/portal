{
  "swagger": "2.0",
  "info" : {
    "description" : "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis\n\t\tdis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec\n\t\tpede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede\n\t\tmollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat\n\t\tvitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.\n\t\tAenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum\n\t\trhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio\n\t\tet ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed\n\t\tfringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,",
    "version" : "2.1.2-SNAPSHOT",
    "title" : "Metamac Portal: Export API"
  },
  "host" : "<%=org.siemac.metamac.portal.web.WebUtils.getExportApiBaseURL()%>",
  "schemes" : [],
  "tags" : [
    {
      "name" : "\/v1.0/csv_comma/{agencyID}/{resourceID}/{version}",
      "description" : ""
    }
    ,
    {
      "name" : "\/v1.0/csv_semicolon/{agencyID}/{resourceID}/{version}",
      "description" : ""
    }
    ,
    {
      "name" : "\/v1.0/excel/{agencyID}/{resourceID}/{version}",
      "description" : ""
    }
    ,
    {
      "name" : "\/v1.0/image",
      "description" : "Exports svg to image"
    }
    ,
    {
      "name" : "\/v1.0/px/{agencyID}/{resourceID}/{version}",
      "description" : ""
    }
    ,
    {
      "name" : "\/v1.0/tsv/{agencyID}/{resourceID}/{version}",
      "description" : ""
    }
  ],
  "definitions" : {
    "xml_ns3_anonymous_CaptchaImage1" : {
      "type" : "object",
      "title" : "CaptchaImage1 (Anonymous)",
      "allOf" : [
        {
          "properties" : {
            "fFontSize" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
			"description" : "",
			"type" : "number"
            },
            "nHeight" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
			"description" : "",
			"type" : "number"
            },
            "nWidth" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
			"description" : "",
			"type" : "number"
            },
            "sFontName" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
			"description" : "",
			"type" : "string"
            },
            "sKeyword" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
			"description" : "",
			"type" : "string"
            }
          }
        }
      ],
      "description" : "<p>Java class for anonymous complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType>\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"nWidth\" type=\"{http://www.w3.org/2001/XMLSchema}int\"/>\r\n         &lt;element name=\"nHeight\" type=\"{http://www.w3.org/2001/XMLSchema}int\"/>\r\n         &lt;element name=\"sKeyword\" type=\"{http://www.w3.org/2001/XMLSchema}string\" minOccurs=\"0\"/>\r\n         &lt;element name=\"sFontName\" type=\"{http://www.w3.org/2001/XMLSchema}string\" minOccurs=\"0\"/>\r\n         &lt;element name=\"fFontSize\" type=\"{http://www.w3.org/2001/XMLSchema}float\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns3_anonymous_CaptchaImage1Response" : {
      "type" : "object",
      "title" : "CaptchaImage1Response (Anonymous)",
      "allOf" : [
        {
          "properties" : {
            "CaptchaImage1Result" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "string"
            }
          }
        }
      ],
      "description" : "<p>Java class for anonymous complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType>\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"CaptchaImage1Result\" type=\"{http://www.w3.org/2001/XMLSchema}base64Binary\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns3_anonymous_CaptchaImage2" : {
      "type" : "object",
      "title" : "CaptchaImage2 (Anonymous)",
      "allOf" : [
        {
          "properties" : {
            "nHeight" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "number"
            },
            "nWidth" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "number"
            },
            "sKeyword" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "string"
            }
          }
        }
      ],
      "description" : "<p>Java class for anonymous complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType>\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"nWidth\" type=\"{http://www.w3.org/2001/XMLSchema}int\"/>\r\n         &lt;element name=\"nHeight\" type=\"{http://www.w3.org/2001/XMLSchema}int\"/>\r\n         &lt;element name=\"sKeyword\" type=\"{http://www.w3.org/2001/XMLSchema}string\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns3_anonymous_CaptchaImage2Response" : {
      "type" : "object",
      "title" : "CaptchaImage2Response (Anonymous)",
      "allOf" : [
        {
          "properties" : {
            "CaptchaImage2Result" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "string"
            }
          }
        }
      ],
      "description" : "<p>Java class for anonymous complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType>\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"CaptchaImage2Result\" type=\"{http://www.w3.org/2001/XMLSchema}base64Binary\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns3_anonymous_CaptchaImageString" : {
      "type" : "object",
      "title" : "CaptchaImageString (Anonymous)",
      "allOf" : [
        {
          "properties" : {
            "fFontSize" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "number"
            },
            "nHeight" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "number"
            },
            "nWidth" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "number"
            },
            "sFontName" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "string"
            },
            "sKeyword" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "string"
            }
          }
        }
      ],
      "description" : "<p>Java class for anonymous complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType>\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"nWidth\" type=\"{http://www.w3.org/2001/XMLSchema}int\"/>\r\n         &lt;element name=\"nHeight\" type=\"{http://www.w3.org/2001/XMLSchema}int\"/>\r\n         &lt;element name=\"sKeyword\" type=\"{http://www.w3.org/2001/XMLSchema}string\" minOccurs=\"0\"/>\r\n         &lt;element name=\"sFontName\" type=\"{http://www.w3.org/2001/XMLSchema}string\" minOccurs=\"0\"/>\r\n         &lt;element name=\"fFontSize\" type=\"{http://www.w3.org/2001/XMLSchema}float\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns3_anonymous_CaptchaImageStringResponse" : {
      "type" : "object",
      "title" : "CaptchaImageStringResponse (Anonymous)",
      "allOf" : [
        {
          "properties" : {
            "CaptchaImageStringResult" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "string"
            }
          }
        }
      ],
      "description" : "<p>Java class for anonymous complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType>\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"CaptchaImageStringResult\" type=\"{http://www.w3.org/2001/XMLSchema}string\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns3_anonymous_GetFontNames" : {
      "type" : "object",
      "title" : "GetFontNames (Anonymous)",
      "allOf" : [
        {
        }
      ],
      "description" : "<p>Java class for anonymous complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType>\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns3_anonymous_GetFontNamesResponse" : {
      "type" : "object",
      "title" : "GetFontNamesResponse (Anonymous)",
      "allOf" : [
        {
          "properties" : {
            "GetFontNamesResult" : {
              "xml" : {
                "namespace" : "https://www.gobiernodecanarias.org/ws/WSCaptcha/Service.asmx"
              },
"description" : "",
"type" : "string"
            }
          }
        }
      ],
      "description" : "<p>Java class for anonymous complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType>\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"GetFontNamesResult\" type=\"{http://www.w3.org/2001/XMLSchema}string\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns2_DatasetSelection" : {
      "type" : "object",
      "title" : "DatasetSelection",
      "allOf" : [
        {
          "properties" : {
            "attributes" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"$ref" : "#/definitions/xml_ns2_DatasetSelectionAttributes"
            },
            "dimensions" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"$ref" : "#/definitions/xml_ns2_DatasetSelectionDimensions"
            }
          }
        }
      ],
      "description" : "<p>Java class for DatasetSelection complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType name=\"DatasetSelection\">\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"dimensions\" type=\"{http://www.siemac.org/metamac/rest/export/v1.0/domain}DatasetSelectionDimensions\"/>\r\n         &lt;element name=\"attributes\" type=\"{http://www.siemac.org/metamac/rest/export/v1.0/domain}DatasetSelectionAttributes\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns2_DatasetSelectionAttribute" : {
      "type" : "object",
      "title" : "DatasetSelectionAttribute",
      "allOf" : [
        {
          "properties" : {
            "attributeId" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"type" : "string"
            },
            "labelVisualisationMode" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"$ref" : "#/definitions/xml_ns2_LabelVisualisationMode"
            }
          }
        }
      ],
      "description" : "<p>Java class for DatasetSelectionAttribute complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType name=\"DatasetSelectionAttribute\">\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"attributeId\" type=\"{http://www.w3.org/2001/XMLSchema}string\"/>\r\n         &lt;element name=\"labelVisualisationMode\" type=\"{http://www.siemac.org/metamac/rest/export/v1.0/domain}LabelVisualisationMode\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns2_DatasetSelectionAttributes" : {
      "type" : "object",
      "title" : "DatasetSelectionAttributes",
      "allOf" : [
        {
          "$ref" : "#/definitions/xml_cdomain_ListBase"
        },
        {
          "properties" : {
            "attribute" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"$ref" : "#/definitions/xml_ns2_DatasetSelectionAttribute"
            }
          }
        }
      ],
      "description" : "<p>Java class for DatasetSelectionAttributes complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType name=\"DatasetSelectionAttributes\">\r\n   &lt;complexContent>\r\n     &lt;extension base=\"{http://www.siemac.org/metamac/rest/common/v1.0/domain}ListBase\">\r\n       &lt;sequence>\r\n         &lt;element name=\"attribute\" type=\"{http://www.siemac.org/metamac/rest/export/v1.0/domain}DatasetSelectionAttribute\" maxOccurs=\"unbounded\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/extension>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns2_DatasetSelectionDimension" : {
      "type" : "object",
      "title" : "DatasetSelectionDimension",
      "allOf" : [
        {
          "properties" : {
            "dimensionId" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"type" : "string"
            },
            "dimensionValues" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"$ref" : "#/definitions/xml_ns2_DimensionValues"
            },
            "labelVisualisationMode" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"$ref" : "#/definitions/xml_ns2_LabelVisualisationMode"
            },
            "position" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"type" : "number"
            }
          }
        }
      ],
      "description" : "<p>Java class for DatasetSelectionDimension complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType name=\"DatasetSelectionDimension\">\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"dimensionId\" type=\"{http://www.w3.org/2001/XMLSchema}string\"/>\r\n         &lt;element name=\"dimensionValues\" type=\"{http://www.siemac.org/metamac/rest/export/v1.0/domain}DimensionValues\" minOccurs=\"0\"/>\r\n         &lt;element name=\"labelVisualisationMode\" type=\"{http://www.siemac.org/metamac/rest/export/v1.0/domain}LabelVisualisationMode\" minOccurs=\"0\"/>\r\n         &lt;element name=\"position\" type=\"{http://www.w3.org/2001/XMLSchema}int\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns2_DatasetSelectionDimensions" : {
      "type" : "object",
      "title" : "DatasetSelectionDimensions",
      "allOf" : [
        {
          "$ref" : "#/definitions/xml_cdomain_ListBase"
        },
        {
          "properties" : {
            "dimension" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"$ref" : "#/definitions/xml_ns2_DatasetSelectionDimension"
            }
          }
        }
      ],
      "description" : "<p>Java class for DatasetSelectionDimensions complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType name=\"DatasetSelectionDimensions\">\r\n   &lt;complexContent>\r\n     &lt;extension base=\"{http://www.siemac.org/metamac/rest/common/v1.0/domain}ListBase\">\r\n       &lt;sequence>\r\n         &lt;element name=\"dimension\" type=\"{http://www.siemac.org/metamac/rest/export/v1.0/domain}DatasetSelectionDimension\" maxOccurs=\"unbounded\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/extension>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns2_DimensionValues" : {
      "type" : "object",
      "title" : "DimensionValues",
      "allOf" : [
        {
          "$ref" : "#/definitions/xml_cdomain_ListBase"
        },
        {
          "properties" : {
            "dimensionValue" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"type" : "string"
            }
          }
        }
      ],
      "description" : "<p>Java class for DimensionValues complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType name=\"DimensionValues\">\r\n   &lt;complexContent>\r\n     &lt;extension base=\"{http://www.siemac.org/metamac/rest/common/v1.0/domain}ListBase\">\r\n       &lt;sequence>\r\n         &lt;element name=\"dimensionValue\" type=\"{http://www.w3.org/2001/XMLSchema}string\" maxOccurs=\"unbounded\" minOccurs=\"0\"/>\r\n       &lt;/sequence>\r\n     &lt;/extension>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns2_ExcelExportation" : {
      "type" : "object",
      "title" : "ExcelExportation",
      "allOf" : [
        {
          "properties" : {
            "datasetSelection" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"$ref" : "#/definitions/xml_ns2_DatasetSelection"
            }
          }
        }
      ],
      "description" : "<p>Java class for ExcelExportation complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType name=\"ExcelExportation\">\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"datasetSelection\" type=\"{http://www.siemac.org/metamac/rest/export/v1.0/domain}DatasetSelection\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns2_LabelVisualisationMode" : {
      "type" : "string",
      "title" : "LabelVisualisationMode",
          "enum" : [
            "CODE",
            "LABEL",
            "CODE_AND_LABEL"
          ],
      "description" : "<p>Java class for LabelVisualisationMode.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n<p>\r\n<pre>\r\n &lt;simpleType name=\"LabelVisualisationMode\">\r\n   &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}token\">\r\n     &lt;enumeration value=\"CODE\"/>\r\n     &lt;enumeration value=\"LABEL\"/>\r\n     &lt;enumeration value=\"CODE_AND_LABEL\"/>\r\n   &lt;/restriction>\r\n &lt;/simpleType>\r\n <\/pre>"
    }
    ,
    "xml_ns2_PlainTextExportation" : {
      "type" : "object",
      "title" : "PlainTextExportation",
      "allOf" : [
        {
          "properties" : {
            "datasetSelection" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
"description" : "",
"$ref" : "#/definitions/xml_ns2_DatasetSelection"
            }
          }
        }
      ],
      "description" : "<p>Java class for PlainTextExportation complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType name=\"PlainTextExportation\">\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"datasetSelection\" type=\"{http://www.siemac.org/metamac/rest/export/v1.0/domain}DatasetSelection\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_ns2_PxExportation" : {
      "type" : "object",
      "title" : "PxExportation",
      "allOf" : [
        {
          "properties" : {
            "datasetSelection" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
			"description" : "",
			"$ref" : "#/definitions/xml_ns2_DatasetSelection"
            }
          }
        }
      ],
      "description" : "<p>Java class for PxExportation complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType name=\"PxExportation\">\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"datasetSelection\" type=\"{http://www.siemac.org/metamac/rest/export/v1.0/domain}DatasetSelection\"/>\r\n       &lt;/sequence>\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
    }
    ,
    "xml_cdomain_ListBase" : {
      "type" : "object",
      "title" : "ListBase",
      "allOf" : [
        {
          "properties" : {
            "firstLink" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "string"
            },
            "kind" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "string"
            },
            "lastLink" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "string"
            },
            "limit" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "number"
            },
            "nextLink" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "string"
            },
            "offset" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "number"
            },
            "previousLink" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "string"
            },
            "selfLink" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "string"
            },
            "total" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "number"
            }
          }
        }
      ],
      "description" : ""
    }
    ,
    "xml_cdomain_ResourceLink" : {
      "type" : "object",
      "title" : "ResourceLink",
      "allOf" : [
        {
          "properties" : {
            "href" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "string"
            },
            "kind" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
			"description" : "",
			"type" : "string"
            }
          }
        }
      ],
      "description" : ""
    }
  },
  "paths": {
    "/v1.0/csv_comma/{agencyID}/{resourceID}/{version}" : {
      "post" : {
        "tags" : [ "\/v1.0/csv_comma/{agencyID}/{resourceID}/{version}" ],
        "description" : "Exports a dataset to csv comma separated. Returns a zip containing two tsv files: one file with observations and attributes with observation attachment level and another one with attributes\r\nwith dataset\r\nand dimension attachment level",
        "operationId" : "resource__v1.0_csv_comma__agencyID___resourceID___version__exportDatasetToCsvComma_POST",
        "consumes" : [ "application/json", "application/xml" ],
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "agencyID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "resourceID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "version",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "lang",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "body",
            "in" : "body",
            "schema" : {
              "type" : "object"
            },
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
      ,
      "post" : {
        "tags" : [ "\/v1.0/csv_comma/{agencyID}/{resourceID}/{version}" ],
        "description" : "",
        "operationId" : "resource__v1.0_csv_comma__agencyID___resourceID___version__exportDatasetToCsvComma_POST",
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "jsonBody",
            "in" : "formData",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "agencyID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "resourceID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "version",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "lang",
            "in" : "query",
            "type" : "string",
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
    }
    ,
    "/v1.0/csv_semicolon/{agencyID}/{resourceID}/{version}" : {
      "post" : {
        "tags" : [ "\/v1.0/csv_semicolon/{agencyID}/{resourceID}/{version}" ],
        "description" : "Exports a dataset to tsv. Returns a zip containing two tsv files: one file with observations and attributes with observation attachment level and another one with attributes with dataset\r\nand dimension attachment level",
        "operationId" : "resource__v1.0_csv_semicolon__agencyID___resourceID___version__exportDatasetToCsvSemicolon_POST",
        "consumes" : [ "application/json", "application/xml" ],
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "agencyID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "resourceID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "version",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "lang",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "body",
            "in" : "body",
            "schema" : {
              "type" : "object"
            },
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
      ,
      "post" : {
        "tags" : [ "\/v1.0/csv_semicolon/{agencyID}/{resourceID}/{version}" ],
        "description" : "",
        "operationId" : "resource__v1.0_csv_semicolon__agencyID___resourceID___version__exportDatasetToCsvSemicolon_POST",
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "jsonBody",
            "in" : "formData",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "agencyID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "resourceID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "version",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "lang",
            "in" : "query",
            "type" : "string",
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
    }
    ,
    "/v1.0/excel/{agencyID}/{resourceID}/{version}" : {
      "post" : {
        "tags" : [ "\/v1.0/excel/{agencyID}/{resourceID}/{version}" ],
        "description" : "Exports a dataset to excel",
        "operationId" : "resource__v1.0_excel__agencyID___resourceID___version__exportDatasetToExcel_POST",
        "consumes" : [ "application/json", "application/xml" ],
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "agencyID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "resourceID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "version",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "lang",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "body",
            "in" : "body",
            "schema" : {
              "type" : "object"
            },
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
      ,
      "post" : {
        "tags" : [ "\/v1.0/excel/{agencyID}/{resourceID}/{version}" ],
        "description" : "",
        "operationId" : "resource__v1.0_excel__agencyID___resourceID___version__exportDatasetToExcelForm_POST",
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "jsonBody",
            "in" : "formData",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "agencyID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "resourceID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "version",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "lang",
            "in" : "query",
            "type" : "string",
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
    }
    ,
    "/v1.0/image" : {
      "post" : {
        "tags" : [ "\/v1.0/image" ],
        "description" : "Exports svg to image",
        "operationId" : "resource__v1.0_image_exportSvgToImage_POST",
        "consumes" : [ "application/xml" ],
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "type",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "width",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "body",
            "in" : "body",
            "schema" : {
			"description" : "",
			"type" : "string"
            },
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
      ,
      "post" : {
        "tags" : [ "\/v1.0/image" ],
        "description" : "Exports svg to image",
        "operationId" : "resource__v1.0_image_exportSvgToImageForm_POST",
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "svg",
            "in" : "formData",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "type",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "width",
            "in" : "query",
            "type" : "string",
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
    }
    ,
    "/v1.0/px/{agencyID}/{resourceID}/{version}" : {
      "post" : {
        "tags" : [ "\/v1.0/px/{agencyID}/{resourceID}/{version}" ],
        "description" : "Exports a dataset to px",
        "operationId" : "resource__v1.0_px__agencyID___resourceID___version__exportDatasetToPx_POST",
        "consumes" : [ "application/json", "application/xml" ],
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "agencyID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "resourceID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "version",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "lang",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "body",
            "in" : "body",
            "schema" : {
              "type" : "object"
            },
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
      ,
      "post" : {
        "tags" : [ "\/v1.0/px/{agencyID}/{resourceID}/{version}" ],
        "description" : "",
        "operationId" : "resource__v1.0_px__agencyID___resourceID___version__exportDatasetToPxForm_POST",
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "jsonBody",
            "in" : "formData",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "agencyID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "resourceID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "version",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "lang",
            "in" : "query",
            "type" : "string",
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
    }
    ,
    "/v1.0/tsv/{agencyID}/{resourceID}/{version}" : {
      "post" : {
        "tags" : [ "\/v1.0/tsv/{agencyID}/{resourceID}/{version}" ],
        "description" : "Exports a dataset to tsv. Returns a zip containing two tsv files: one file with observations and attributes with observation attachment level and another one with attributes with dataset\r\nand dimension attachment level",
        "operationId" : "resource__v1.0_tsv__agencyID___resourceID___version__exportDatasetToTsv_POST",
        "consumes" : [ "application/json", "application/xml" ],
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "agencyID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "resourceID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "version",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "lang",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "body",
            "in" : "body",
            "schema" : {
              "type" : "object"
            },
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
      ,
      "post" : {
        "tags" : [ "\/v1.0/tsv/{agencyID}/{resourceID}/{version}" ],
        "description" : "",
        "operationId" : "resource__v1.0_tsv__agencyID___resourceID___version__exportDatasetToTsv_POST",
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "jsonBody",
            "in" : "formData",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "agencyID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "resourceID",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "version",
            "in" : "path",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "filename",
            "in" : "query",
            "type" : "string",
            "description" : ""
          },
          {
            "name" : "lang",
            "in" : "query",
            "type" : "string",
            "description" : ""
          }
        ],
        "responses" : {
          "201" : {
            "schema" : {
			"description" : "",
			"type" : "object"
            },
            "headers" : {
            },
            "description" : "Success"
          },
          "default" : {
            "description" : "Unexpected error."
          }
        }
      }
    }
  }
}
