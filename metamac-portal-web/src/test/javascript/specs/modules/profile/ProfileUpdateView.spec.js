describe("ProfileUpdateView", function () {

    it("when submit it should call user save", function () {
        var user = new STAT4YOU.modules.user.User({});
        var view = new STAT4YOU.modules.profile.ProfileUpdateView({user : user});
        var saveSpy = sinon.stub(user, "save").returns(new $.Deferred().promise());
        sinon.stub(view, "_reloadProfilePage");
        view.render();
        view.submit();
        expect(saveSpy.called).to.be.true;
    });

    describe("update success", function () {

        var user, view, navigateToReadSpy, welcomeSpy, welcomePromise;

        beforeEach(function () {
            user = new STAT4YOU.modules.user.User({});
            view = new STAT4YOU.modules.profile.ProfileUpdateView({user : user});
            view.navBarView = {render : function () {} };
            navigateToReadSpy = sinon.stub(view, "_navigateToRead");
            welcomePromise = new $.Deferred();
        });

        it("when user update succes and needNavBar it should render navbarView", function () {
            var renderSpy = sinon.stub(view.navBarView, "render");
            view._userUpdateSuccess(false, true);
            expect(renderSpy.called).to.be.true;
            expect(navigateToReadSpy.called).to.be.true;
        });

        it("when user update success and needFullReload it should send welcome message and waits until change windows location", function () {
            var reloadSpy = sinon.stub(view, "_reloadProfilePage").returns(null);
            view._userUpdateSuccess(true, false);
            expect(reloadSpy.called).to.be.true;
        });

    });

});