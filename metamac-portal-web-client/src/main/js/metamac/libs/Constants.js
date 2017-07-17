(function () {
    "use strict";

    App.namespace("App.Constants");

    App.Constants = {
        // See variables.less        
        colors: {
            istacBlueWhite: "#B3D9FF",
            istacBlueLight: "#56B5E6",
            istacBlueMedium: "#1C547E",
            istacBlueDark: "#003366",
            istacYellow: '#EBCC5C',

            istacWhite: "#FFFFFF",
            istacGreyLight: "#EBEBEB",
            istacGreyMedium: "#ACACAC",
            istacGreyDark: "#808080",
            istacBlack: "#222222",

            hiddenText: "#FFFFFD"
        },

        font: {
            family: {
                sansSerif: "Helvetica,Arial,sans-serif",
                serif: "serif"
            },
            body: {
                size: "11px"
            },
            title: {
                size: "13px"
            }
        },

        api: {
            type: {
                INDICATOR: "indicator",
                DATASET: "dataset"
            }
        }
    };

}());