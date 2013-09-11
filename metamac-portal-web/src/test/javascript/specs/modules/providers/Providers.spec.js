describe("Providers", function () {

    var Provider = App.modules.providers.Provider;
    var Providers = App.modules.providers.Providers;

    it("should find a provider by acronym", function () {
        var ine = new Provider({acronym : 'INE'});
        var istac = new Provider({acronym : 'ISTAC'});
        var eustat = new Provider({acronym : 'EUSTAT'});
        var providers = new Providers([ine, istac, eustat]);

        expect(providers.findByAcronym("INE")).to.equal(ine);
        expect(providers.findByAcronym("ISTAC")).to.equal(istac);
        expect(providers.findByAcronym("EUSTAT")).to.equal(eustat);

        expect(providers.findByAcronym("INVALID")).to.be.undefined;
    });

});
