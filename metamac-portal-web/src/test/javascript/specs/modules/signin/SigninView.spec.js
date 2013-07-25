describe("SigninView", function () {
    var signinView = new STAT4YOU.modules.signin.SigninView();

    describe("redirect url ", function () {
        it("should return a promise with the current redirect url", function () {
            var promise = signinView.redirectUrl();
            promise.done(function (url) {
                var origin = window.location.protocol + "//" + window.location.host;
                expect(url).to.equal(window.location.href.substring(origin.length));
            });
        });
    });
});