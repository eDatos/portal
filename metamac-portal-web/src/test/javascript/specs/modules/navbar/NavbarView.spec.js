describe("Navbar", function(){



    beforeEach(function () {
        App.context = '';
    });

    var NavbarView = App.modules.navbar.NavbarView;

    it("should set active class to links with href to location", function(){
        var navbarView = new NavbarView({location : '/providers/'});
        navbarView.render();

        var providerLink = navbarView.$el.find('.links li:eq(0)');
        expect(providerLink.hasClass('active')).to.be.true;
    });

    it("should set active class to links with href to partial location", function(){
        var navbarView = new NavbarView({location : '/providers/INE'});
        navbarView.render();

        var providerLink = navbarView.$el.find('.links li:eq(0)');
        expect(providerLink.hasClass('active')).to.be.true;
    });

    it("should not set active class in dataset page", function(){
        var navbarView = new NavbarView({location : '/providers/INE/dataset/123'});
        navbarView.render();

        var providerLink = navbarView.$el.find('.links li:eq(0)');
        expect(providerLink.hasClass('active')).to.be.false;
    });



});