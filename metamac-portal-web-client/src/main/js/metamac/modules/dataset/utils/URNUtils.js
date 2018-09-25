(function () {
    "use strict";

    App.namespace("App.URNUtils");

    App.URNUtils = {

        /* 
         * Input: urn:sdmx:org.sdmx.infomodel.base.Agency=SDMX:AGENCIES(1.0).ISTAC
         * Output: {
         *      agency: SDMX
         *      identifier: AGENCIES
         *      version: 1.0
         *      organisation: ISTAC
         * }
         */
        getIdentifierFromUrn: function (urn) {
            var splittedUrn = urn.split("=");
            var resourcePrefix = splittedUrn[0];
            var structuralResource = splittedUrn[1];

            var structuralResourceRegex = /(\w+):([a-z_0-9]+)\(([0-9\.]+)\)(\.([a-z_0-9]+))?/i;
            var structuralResourceMatchs = structuralResourceRegex.exec(structuralResource);

            return {
                agency: structuralResourceMatchs[1],
                identifier: structuralResourceMatchs[2],
                version: structuralResourceMatchs[3],
                organisation: structuralResourceMatchs[5],
            }
        }

    };
}());
