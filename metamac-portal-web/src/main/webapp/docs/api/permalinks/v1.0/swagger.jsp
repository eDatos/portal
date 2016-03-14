{
  "swagger": "2.0",
  "info" : {
    "description" : "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis\n\t\tdis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec\n\t\tpede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede\n\t\tmollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat\n\t\tvitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.\n\t\tAenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum\n\t\trhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio\n\t\tet ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed\n\t\tfringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,",
    "version" : "2.1.2-SNAPSHOT",
    "title" : "Metamac Portal: Permalinks API"
  },
  "host" : "<%=org.siemac.metamac.portal.web.WebUtils.getPermalinksApiBaseURL()%>",
  "schemes" : [],
  "tags" : [
    {
      "name" : "\/v1.0/permalinks",
      "description" : "Create new permalink"
    }
    ,
    {
      "name" : "\/v1.0/permalinks/{id}",
      "description" : ""
    }
  ],
  "definitions" : {
    "xml_ns1_Permalink" : {
      "type" : "object",
      "title" : "Permalink",
      "allOf" : [
        {
          "properties" : {
            "kind" : {
              "xml" : {
                "attribute" : true,
                "namespace" : ""
              },
              "description" : "",
              "type" : "string"
            },
            "content" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/permalinks/v1.0/domain"
              },
              "description" : "",
              "type" : "string"
            },
            "id" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/permalinks/v1.0/domain"
              },
              "description" : "",
              "type" : "string"
            },
            "selfLink" : {
              "xml" : {
                "namespace" : "http://www.siemac.org/metamac/rest/permalinks/v1.0/domain"
              },
              "description" : "",
              "$ref" : "#/definitions/xml_cdomain_ResourceLink"
            }
          }
        }
      ],
      "description" : "<p>Java class for Permalink complex type.\r\n\r\n<p>The following schema fragment specifies the expected content contained within this class.\r\n\r\n<pre>\r\n &lt;complexType name=\"Permalink\">\r\n   &lt;complexContent>\r\n     &lt;restriction base=\"{http://www.w3.org/2001/XMLSchema}anyType\">\r\n       &lt;sequence>\r\n         &lt;element name=\"id\" type=\"{http://www.w3.org/2001/XMLSchema}string\"/>\r\n         &lt;element name=\"content\" type=\"{http://www.w3.org/2001/XMLSchema}string\"/>\r\n         &lt;element name=\"selfLink\" type=\"{http://www.siemac.org/metamac/rest/common/v1.0/domain}ResourceLink\"/>\r\n       &lt;/sequence>\r\n       &lt;attribute name=\"kind\" use=\"required\" type=\"{http://www.w3.org/2001/XMLSchema}string\" />\r\n     &lt;/restriction>\r\n   &lt;/complexContent>\r\n &lt;/complexType>\r\n <\/pre>"
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
    "/v1.0/permalinks" : {
      "post" : {
        "tags" : [ "\/v1.0/permalinks" ],
        "description" : "Create new permalink",
        "operationId" : "resource__v1.0_permalinks_createPermalink_POST",
        "consumes" : [ "application/json", "application/xml" ],
        "produces" : [ "application/json", "application/xml" ],
        "parameters" : [
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
    "/v1.0/permalinks/{id}" : {
      "get" : {
        "tags" : [ "\/v1.0/permalinks/{id}" ],
        "description" : "Retrieve permalink by id",
        "operationId" : "resource__v1.0_permalinks__id__retrievePermalinkByIdXml_GET",
        "produces" : [ "application/xml" ],
        "parameters" : [
          {
            "name" : "id",
            "in" : "path",
            "type" : "string",
            "description" : "Id"
          }
        ],
        "responses" : {
          "200" : {
            "schema" : {
"description" : "",
"$ref" : "#/definitions/xml_ns1_Permalink"
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
      "get" : {
        "tags" : [ "\/v1.0/permalinks/{id}" ],
        "description" : "Retrieve content of permalink by id",
        "operationId" : "resource__v1.0_permalinks__id__retrievePermalinkByIdJson_GET",
        "produces" : [ "application/json" ],
        "parameters" : [
          {
            "name" : "id",
            "in" : "path",
            "type" : "string",
            "description" : "Id"
          }
        ],
        "responses" : {
          "200" : {
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
