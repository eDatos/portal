describe("FilterSidebarView", function () {

    var optionsModel;
    var filterSidebarDimensionView;
    var $container;

    beforeEach(function () {
        var metadata = new App.dataset.Metadata();
        metadata.parse(App.test.response.metadata);
        var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);

        optionsModel = new App.modules.dataset.OptionsModel();

        $container = $('<div></div>').height(200).appendTo('body');
        filterSidebarDimensionView = new App.widget.filter.sidebar.FilterSidebarView({
            filterDimensions : filterDimensions,
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

        it("resize it should update max height on subviews", function () {
            _.each(filterSidebarDimensionView.subviews, function (subview) {
                sinon.stub(subview, 'getCollapsedHeight').returns(20);
                sinon.spy(subview, 'setMaxHeight');
            });
            filterSidebarDimensionView.$el.trigger('resize');
            var expectedMaxHeight = filterSidebarDimensionView.$el.height() - 80;
            _.each(filterSidebarDimensionView.subviews, function (subview) {
                expect(subview.setMaxHeight.calledWith(expectedMaxHeight)).to.be.true;
            });
        });

        it("should set maxHeight on render", function () {
            var expectedMaxHeight = 76; //magic number, bad practice
            _.each(filterSidebarDimensionView.subviews, function (subview) {
                expect(subview.maxHeight).to.eql(expectedMaxHeight);
            });
        });

    });

});