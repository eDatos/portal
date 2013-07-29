describe("SearchHeaderView", function () {

    var SearchQueryModel = App.modules.search.SearchQueryModel;
    var SearchHeaderView = App.modules.search.SearchHeaderView;
    var SearchActiveProvider = App.modules.search.SearchActiveProvider;
    var queryModel;
    var headerView;
    var activeProviderModel;

    beforeEach(function () {
        SearchHeaderView.KEYUP_DELAY = 10; //reduce the delay to improve test speed

        queryModel = new SearchQueryModel();
        activeProviderModel = new SearchActiveProvider();
        headerView = new SearchHeaderView({queryModel : queryModel, activeProviderModel : activeProviderModel});
        headerView.render();
    });

    describe("seach input", function () {

        it("should update the value when the model change", function () {
            queryModel.set({query : "before"});
            expect(headerView.$queryInput.val()).to.equal("before");
            queryModel.set({query : "after"});
            expect(headerView.$queryInput.val()).to.equal("after");
        });

        it("should update the model when submit the form", function () {
            var testValue = "cacafuti";
            headerView.$queryInput.val(testValue);
            headerView.$queryForm.trigger("submit");
            expect(queryModel.get('query')).to.equal(testValue);
        });

        it("should update the model when keyup after a delay", function (done) {
            var testValue = "cacafuti";

            queryModel.on("change", function () {
                expect(headerView.queryModel.get('query')).to.equal(testValue);
                done();
            });

            headerView.$queryInput.val(testValue);
            headerView.$queryInput.trigger("keyup");
            expect(queryModel.get('query')).to.not.equal(testValue);
        });

    });

});