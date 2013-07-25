describe("OrderSidebarView", function () {

    var orderSidebarView;
    var filterOptions;
    var optionsModel;

    beforeEach(function () {
        filterOptions = App.test.factories.filterOptionsFactory();
        optionsModel = new STAT4YOU.modules.dataset.OptionsModel();
        orderSidebarView = new App.widget.filter.sidebar.OrderSidebarView({filterOptions : filterOptions, optionsModel : optionsModel});
    });

    describe("renderContext", function () {
        it("fixed dimension should include selected category", function () {
            filterOptions._changeDimensionZone("id1", "fixed");

            var context = orderSidebarView._renderContext();
            var fixedZone = _.find(context.zones, function (zone) {
                return zone.id === "fixed";
            });

            var selectedCategory = fixedZone.dimensions[0].selectedCategory;
            expect(selectedCategory.id).to.equal('id1a');
            expect(selectedCategory.label).to.equal('enid1a');
        });
    });

    describe("dimensions for zone", function () {

        it("should allow drag all dimensions if not in map type", function () {
            var dimensions = orderSidebarView._dimensionsForZone("left");
            expect(_.chain(dimensions).pluck('draggable').every(_.identity).value()).to.be.true;
        });

        it("should allow drag only geographical dimension if map type", function () {
            optionsModel.set('type', "map");
            var dimensions = orderSidebarView._dimensionsForZone("left");

            expect(dimensions[0].draggable).to.be.false;
            expect(dimensions[1].draggable).to.be.true;
        });

    });


});