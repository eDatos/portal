describe('App Router', function () {

    var router = new App.AppRouter();

    describe('linkTo', function () {

        it('should replace parameters', function () {
            var linkParameters = {
                agency : "ISTAC",
                identifier : "turismo",
                version : "1"
            };
            var link = router.linkTo("dataset", linkParameters);
            expect(link).to.eql("datasets/ISTAC/turismo/1")
        });

        it('should fail if no route found', function () {
            var fn = function () {
                router.linkTo("invalidRoute", {});
            };
            expect(fn).to.throw(Error);
        });

    });

});