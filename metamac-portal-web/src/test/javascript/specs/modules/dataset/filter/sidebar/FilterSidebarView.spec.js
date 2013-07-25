describe("FilterSidebarView", function () {

    var filterOptions;
    var optionsModel;
    var filterSidebarDimensionView;
    var $container;

    beforeEach(function () {
        filterOptions = App.test.factories.filterOptionsFactory();
        optionsModel = new STAT4YOU.modules.dataset.OptionsModel();

        $container = $('<div></div>').height(200).appendTo('body');
        filterSidebarDimensionView = new App.widget.filter.sidebar.FilterSidebarView({
            filterOptions : filterOptions,
            optionsModel : optionsModel,
            el : $container
        });

        filterSidebarDimensionView.render();
    });

    afterEach(function () {
        filterSidebarDimensionView.destroy();
        $container.remove();
    });

    describe("accordion", function () {

        it("should be initialized with the first dimension open", function () {
            var collapsedArray = _.map(filterSidebarDimensionView.subviews, function (subview) {
                return subview.stateModel.get('collapsed');
            });
            expect(collapsedArray).to.eql([true, true, false]);
        });

        it("should collapse all views when a view is open", function () {
            var state0 = filterSidebarDimensionView.subviews[0].stateModel;
            var state1 = filterSidebarDimensionView.subviews[1].stateModel;

            state0.set('collapsed', false);
            state1.set('collapsed', false);
            expect(state0.get('collapsed')).to.be.true;
        });

        it("resize it should update max height on subviews", function () {
            sinon.stub(filterSidebarDimensionView.subviews[0], "getCollapsedHeight").returns(20);
            sinon.stub(filterSidebarDimensionView.subviews[1], "getCollapsedHeight").returns(20);
            sinon.stub(filterSidebarDimensionView.subviews[2], "getCollapsedHeight").returns(20);

            filterSidebarDimensionView.$el.trigger('resize');

            var expectedMaxHeight = filterSidebarDimensionView.$el.height() - 60;

            _.each(filterSidebarDimensionView.subviews, function (subview) {
                expect(subview.stateModel.get('maxHeight')).to.equal(expectedMaxHeight);
            });
        });

        it("should set maxHeight on render", function () {
            var expectedMaxHeight = 104; //magic number, bad practice
            _.each(filterSidebarDimensionView.subviews, function (subview) {
                expect(subview.stateModel.get('maxHeight')).to.equal(expectedMaxHeight);
            });
        });

    });

});