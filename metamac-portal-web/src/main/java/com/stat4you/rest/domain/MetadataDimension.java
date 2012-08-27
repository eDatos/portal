package com.stat4you.rest.domain;

import java.util.List;
import java.util.Map;

import org.codehaus.jackson.annotate.JsonPropertyOrder;

@JsonPropertyOrder({
    "id",
    "label",
    "representation"
})
public class MetadataDimension {
    
//    MIRAR COMO QUEDA EL JSON DE INDICADORES PARA ACTUALIZAR ESTA PARTE
//
//    
//    "dimension": {
//        "GEOGRAPHICAL": {
//        "code": "GEOGRAPHICAL",
//        "granularity": [
//        {
//        "code": "COUNTRIES",
//        "title": {
//        "en": "Countries",
//        "es": "Países"
//        }
//        }
//        ],
//        "representation": [
//        {
//        "code": "FR",
//        "title": {
//        "en": "France",
//        "es": "Francia"
//        },
//        "latitude": 12.5656233,
//        "longitude": -15.46464565
//        }
//        ]
//        },
//        "TIME": {
//        "code": "TIME",
//        "granularity": [
//        {
//        "code": "YEARLY"
//        }
//        ],
//        "representation": [
//        {
//        "code": "2006"
//        }
//        ]
//        },
//        "MEASURE": {
//        "code": "MEASURE",
//        "representation": [
//        {
//        "code": "ABSOLUTE"
//        },
//        {
//        "code": "ANNUAL_PERCENTAGE_RATE"
//        },
//        {
//        "code": "ANNUAL_PUNTUAL_RATE"
//        },
//        {
//        "code": "INTERPERIOD_PERCENTAGE_RATE"
//        },
//        {
//        "code": "INTERPERIOD_PUNTUAL_RATE"
//        }
//        ]
//        }
//        },
    
    private List<String>              id             = null;
    private Map<String, List<String>> label          = null;
    private MetadataRepresentation    representation = null;

    public List<String> getId() {
        return id;
    }

    public void setId(List<String> id) {
        this.id = id;
    }

    public Map<String, List<String>> getLabel() {
        return label;
    }

    public void setLabel(Map<String, List<String>> label) {
        this.label = label;
    }

    public MetadataRepresentation getRepresentation() {
        return representation;
    }

    public void setRepresentation(MetadataRepresentation representation) {
        this.representation = representation;
    }

}
