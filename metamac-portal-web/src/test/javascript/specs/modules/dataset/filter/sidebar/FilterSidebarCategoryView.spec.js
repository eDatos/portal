describe("FilterSidebarCategoryView", function () {

    var filterOptions;
    var optionsModel;
    var dimension;
    var category;
    var stateModel;
    var filterSidebarCategoryView;

    beforeEach(function () {
        filterOptions = App.test.factories.filterOptionsFactory();
        optionsModel = new STAT4YOU.modules.dataset.OptionsModel();
        dimension = filterOptions.getDimensions()[0];
        category = filterOptions.getCategories(dimension.id)[0];
        stateModel = new App.widget.filter.sidebar.FilterSidebarDimensionStateModel();

        filterSidebarCategoryView = new App.widget.filter.sidebar.FilterSidebarCategoryView({
            dimension : dimension,
            filterOptions : filterOptions,
            optionsModel : optionsModel,
            category : category,
            stateModel : stateModel
        });

    });

    it("should show big titles in one line", function () {
        category.label = "This is a very big label to check if it show in multiple lines This is a very big label to check if it show in multiple lines This is a very big label to check if it show in multiple lines";
        sinon.stub(filterOptions, "getCategory").returns(category);

        var $container = $('<div></div>').addClass('filter-sidebar-category').width(100).appendTo('body');
        filterSidebarCategoryView.setElement($container);
        filterSidebarCategoryView.render();

        var $label = filterSidebarCategoryView.$(".filter-sidebar-category-label");
        expect($label.css('height')).to.equal($label.css('line-height'));

        $container.remove();
    });

    it("title shold have tooltip", function () {
        filterSidebarCategoryView.render();
        var $label = filterSidebarCategoryView.$(".filter-sidebar-category-label");
        expect($label.attr('title')).to.equal(category.label);
    });

});