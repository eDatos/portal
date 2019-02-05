(function () {
    "use strict";

    App.namespace("App.DimensionsUtils");

    App.DimensionsUtils = {

        /*
          La respuesta tiene el siguiente aspecto:
          MOTIVOS_ESTANCIA:000|001|002:ISLAS_DESTINO_PRINCIPAL:005|006
        */
        getDimensionsParameterForDatasetRequest: function (dimensions) {
            return _.map(dimensions,
                function (dimension) {
                    return dimension.id + ":" + dimension.representations.join("|");
                }).join(":");
        }

    };
}());
