var SpecUtils = {

    waitFor : function (test, callback) {
        if (test()) {
            callback();
        } else {
            setTimeout(function () {
                SpecUtils.waitFor(test, callback);
            }, 60);
        }
    },

    configureI18n : function (locale) {
        I18n.locale = locale;
        I18n.translations = {
            en : {
                number : {
                    format : {
                        separator : ".",
                        delimiter : ","
                    }
                }
            },
            es : {
                number : {
                    format : {
                        separator : ",",
                        delimiter : "."
                    }
                }
            }
        };
    }

};