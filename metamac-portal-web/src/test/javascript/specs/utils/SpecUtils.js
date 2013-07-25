var SpecUtils = {

    waitFor : function (test, callback) {
        if (test()) {
            callback();
        } else {
            setTimeout(function () {
                SpecUtils.waitFor(test, callback);
            }, 60);
        }
    }

};