package com.stat4you.rest.domain;

import java.util.List;
import java.util.Map;

import org.codehaus.jackson.annotate.JsonPropertyOrder;

@JsonPropertyOrder({
        "attribute",
        "observation",
        "observationAttributes",
        "format",
        "dimension"})
public class Data {
//    
//    ACTUALIZAR DATA EN TAL Y COMO SE HIZO EN INDICADORES, HAY QUE CABIAR EL JAVASCRIPT QUE GESTIONA LOS DATOS.
//    Sería interesante crear un javascript sólo para los datos y no para los datos y los metadatos.
//    
//    {
//        "format": [
//        "GEOGRAPHICAL",
//        "TIME",
//        "MEASURE"
//        ],
//        "dimension": {
//        "GEOGRAPHICAL": {
//        "representation": {
//        "size": 1,
//        "index": {
//        "FR": 0
//        }
//        }
//        },
//        "TIME": {
//        "representation": {
//        "size": 1,
//        "index": {
//        "2006": 0
//        }
//        }
//        },
//        "MEASURE": {
//        "representation": {
//        "size": 5,
//        "index": {
//        "ABSOLUTE": 0,
//        "ANNUAL_PERCENTAGE_RATE": 1,
//        "ANNUAL_PUNTUAL_RATE": 2,
//        "INTERPERIOD_PERCENTAGE_RATE": 3,
//        "INTERPERIOD_PUNTUAL_RATE": 4
//        }
//        }
//        }
//        },
//        "observation": [
//        "1.241.416",
//        null,
//        null,
//        null,
//        null
//        ]
//        }




    

    private Map<String, Map<String, Object>> attribute             = null; // TODO QUITAR MAPA
    private List<String>                     observation           = null;
    private Map<String, Object[]>            observationAttributes = null;
    private List<List<String>>               format                = null;
    private Map<String, DataDimension>       dimension             = null;

    public Map<String, Map<String, Object>> getAttribute() {
        return attribute;
    }

    public void setAttribute(Map<String, Map<String, Object>> attribute) {
        this.attribute = attribute;
    }

    public List<String> getObservation() {
        return observation;
    }

    public void setObservation(List<String> observation) {
        this.observation = observation;
    }

    public Map<String, Object[]> getObservationAttributes() {
        return observationAttributes;
    }

    public void setObservationAttributes(Map<String, Object[]> observationAttributes) {
        this.observationAttributes = observationAttributes;
    }

    public List<List<String>> getFormat() {
        return format;
    }

    public void setFormat(List<List<String>> format) {
        this.format = format;
    }

    public Map<String, DataDimension> getDimension() {
        return dimension;
    }

    public void setDimension(Map<String, DataDimension> dimension) {
        this.dimension = dimension;
    }

}
