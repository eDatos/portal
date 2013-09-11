describe("DatasetView", function () {

    var DatasetView = App.modules.datasets.DatasetView;

    var favouritesMock, datasetMock;

    beforeEach(function () {
        favouritesMock = {
            toggle : function () {
            },
            isFav : function () {
            }
        };
        datasetMock = new Backbone.Model({
            uri : "uri"
        });

        App.user = {
            favourites : favouritesMock
        };
    });

    it("should call favourites.togle clicking the star if user defined", function () {
        sinon.spy(App.user.favourites, "toggle");

        var datasetView = new DatasetView({dataset : datasetMock});
        datasetView.render();

        var favLink = datasetView.$el.find('.fav');
        expect(favLink).to.exists;
        favLink.click();
        expect(App.user.favourites.toggle.calledWith(datasetMock.get('uri'))).to.be.true;
    });

    it("should do show mondal if user is not defined on click the star", function () {
        App.user = undefined;
        sinon.spy(favouritesMock, "toggle");

        var signinView = {
            show : function () {}
        };

        App.getSigninView = function () {
            return signinView;
        };

        var signinViewShowSpy = sinon.spy(signinView, "show");

        var datasetView = new DatasetView({dataset : datasetMock});
        datasetView.render();

        var favLink = datasetView.$el.find('.fav');
        expect(favLink).to.exists;
        favLink.click();
        expect(signinViewShowSpy.called).to.be.true;
    });

    it("should render filled star if dataset is favourite", function () {
        sinon.stub(App.user.favourites, "isFav").returns(true);
        var datasetView = new DatasetView({dataset : datasetMock});
        datasetView.render();

        expect(datasetView.$el.find('.icon-star-min').length).to.equal(1);
        expect(datasetView.$el.find('.icon-star-empty-min').length).to.equal(0);
    });

    it("shoudl render empty star if dataset isn't favourite", function () {
        sinon.stub(App.user.favourites, "isFav").returns(false);
        var datasetView = new DatasetView({dataset : datasetMock});
        datasetView.render();
        expect(datasetView.$el.find('.icon-star-min').length).to.equal(0);
        expect(datasetView.$el.find('.icon-star-empty-min').length).to.equal(1);
    });

});
