STAT4YOU.namespace("STAT4YOU.widget.filter");

STAT4YOU.widget.filter.FilterDimensionView = Backbone.View.extend({
    _templateDimension : STAT4YOU.templateManager.get('widget/filter/popup/filter-dimension'),
    _templateDimensionCategories : STAT4YOU.templateManager.get('widget/filter/popup/filter-dimension-categories'),
    _templateDimensionCheckbox : STAT4YOU.templateManager.get('widget/filter/popup/filter-dimension-checkbox'),

    initialize : function (options) {
        var self = this;
        this.zone = options.zone;
        this.$el.on("keyup", "input", function (e) {
            self._handleFilterCategories(e);
        });
    },

    render : function (dim) {
        this.dimNum = dim.number;
        this.$dimension = $(this._templateDimension(dim));
        this.$el.html(this.$dimension);

        this._renderCategories(dim);
        this._renderCheckbox(dim);

        return this;
    },

    _renderCategories : function () {
        var dim = this.model.getDimension(this.dimNum);
        if ((this.zone == "fixed") && (!this._isExpanded)) {
            dim.categories = this.model.getSelectedCategories(this.dimNum);
        }
        if (this.text) {
            var filteredCategories = this._filterDimensionCategories(dim.categories);
            dim.categories = filteredCategories;
        }
        this.$categories = this._templateDimensionCategories(dim);
        $('.div-categories-container', this.$el).html(this.$categories);
        this._refreshingScrollbar(false);

        return this;
    },

    _renderCheckbox : function () {
        var dim = this.model.getDimension(this.dimNum);
        var allSelected = this.model.areAllCategoriesSelected(dim.number);

        this.$checkbox = this._templateDimensionCheckbox({allSelected : allSelected});
        $('.select-categories', this.$el).remove();
        this.$el.append(this.$checkbox);

        return this;
    },

    events : {
        "click .triangle-right" : "_expandCategories",
        "click .button-categories-big" : "collapseCategories",
        "click .select-categories.unselectall" : "_handleSelectAllCategories",
        "click .select-categories.selectall" : "_handleUnselectAllCategories",
        "click .div-category" : "_handleToggleCategory",
        "click .div-category-clicked" : "_handleToggleCategory"
    },


    _handleFilterCategories : function (e) {
        var text = $(e.currentTarget).val();
        this._filterCategories(text);
        return false;
    },

    _handleSelectAllCategories : function (e) {
        this.model.selectAllCategories(this.dimNum);
        this._renderCategories();
        this._renderCheckbox();
        return false;
    },

    _handleUnselectAllCategories : function (e) {
        this.model.unselectAllCategories(this.dimNum);
        this._renderCategories();
        this._renderCheckbox();
        return false;
    },

    _handleToggleCategory : function (e) {
        var $category = $(e.currentTarget);
        var $dimension = $category.parents('[class*="div-dimension-short"]');
        this._toggleCategory($dimension.data('number'), $category.data('number'));
        return false;
    },

    /**
     * This method removes the highlighting classes that the dom objects may have during the drop
     */
    _removeHighlights : function (elem) {
        //TODO: Test
        $(elem).removeClass("highlight-long");
        $(elem).removeClass("highlight-short");
    },

    _refreshingScrollbar : function (firstTime) {
        // Original size
        var $categoriesDivAdvContainer = $('.div-categories-advanced-container-big', this.$el);
        if (this.zone !== "left" && this.zone !== "fixed" && !firstTime) {
            var tempWidth = $categoriesDivAdvContainer.width() - 20;
            $categoriesDivAdvContainer.width(tempWidth);
        }
        // New scrollbar
        this._scrollBar = $('.div-categories-big').jScrollPane({
            showArrows : false
        });
        // The scrollbar space
        if (this.zone !== "left" && this.zone !== "fixed") {
            var tempWidth = $categoriesDivAdvContainer.width();
            $categoriesDivAdvContainer.width(tempWidth + 20);
        }
    },

    _setExpandedCategoriesStylesGeneral : function () {
        //TODO: Test
        var $categoriesDivAdvContainer = $('.div-categories-advanced-container', this.$el);
        var $categoriesDiv = $('.div-categories', this.$el);
        var $categoriesOptions = $('.categories-options', this.$el);
        var $triangle = $('.triangle-right', this.$el);
        // Categories
        $categoriesDivAdvContainer.removeClass('div-categories-advanced-container');
        $categoriesDivAdvContainer.addClass('div-categories-advanced-container-big');
        $categoriesDiv.removeClass('div-categories');
        $categoriesDiv.addClass('div-categories-big');
        // Triangles
        $triangle.removeClass('triangle-right');
        $triangle.addClass('triangle-top');
        // Scrollbar
        this._refreshingScrollbar(true);
        if (this.zone === "left") {
            this._setExpandedCategoriesStylesLeft();
        }
        // Now it is expanded
        this._isExpanded = true;
        this._renderCategories();
    },

    _setExpandedCategoriesStylesLeft : function () {
        //TODO: Test
        var $categoriesDivAdvContainer = $('.div-categories-advanced-container-big', this.$el);
        var $categoriesDiv = $('.div-categories-big', this.$el);
        var $categoriesOptions = $('.categories-options', this.$el);
        // Height
        var height = Math.round(this.$el.width() * 0.60 + 5);
        $categoriesDivAdvContainer.css("height", height /*former: 65 and padding +20*/);
        // Categories height;
        $categoriesDiv.height(height - $categoriesOptions.outerHeight());

        //Left
        var newLeft = this.$el.outerWidth();
        $categoriesDivAdvContainer.css("left", newLeft);
    },

    _expandCategories : function () {
        //TODO: Test
        this.trigger('willExpandCategories', this);
        this._setExpandedCategoriesStylesGeneral();
        this.trigger('didExpandCategories', this);
        return false;
    },

    _toggleCategory : function (dim, cat) {
        this.model.toggleCategoryState(dim, cat);
        this._renderCategories();
        this._renderCheckbox();
    },

    _filterCategories : function (text) {
        this.text = text;
        this._renderCategories();
    },

    _filterDimensionCategories : function (categories) {
        var self = this;
        var filteredcategories = _.filter(categories, function (i) {
            var label = i.label.toLowerCase();
            self.text = self.text.toLowerCase();
            var test = label.indexOf(self.text);
            return test !== -1;
        });
        return filteredcategories;
    },


    collapseCategories : function () {
        //TODO: Test
        if (this._isExpanded) {
            this._isExpanded = false;
            // Deleting scrollbar
            var api = this._scrollBar.data('jsp');
            api.scrollToY(0);
            api.destroy();
            this._scrollBar = null;
            // selectors
            var $categoriesDivAdvContainer = $('.div-categories-advanced-container-big', this.$el);
            var $categoriesDiv = $('.div-categories-big', this.$el);
            var $categoriesOptions = $('.categories-options', this.$el);
            var $triangle = $('.triangle-top', this.$el);
            // Categories
            $categoriesDivAdvContainer.removeClass('div-categories-advanced-container-big');
            $categoriesDivAdvContainer.addClass('div-categories-advanced-container');
            $categoriesDiv.removeClass('div-categories-big');
            $categoriesDiv.addClass('div-categories');
            // Reloading proper width
            var tempWidth = $categoriesDivAdvContainer.width();
            $categoriesDivAdvContainer.width(tempWidth - 20);
            // Changing the triangle
            $triangle.removeClass('triangle-top');
            $triangle.addClass('triangle-right');
            // Removing highlights
            this._removeHighlights($categoriesDiv.get(0));
            // Deleting the temporal styles
            $categoriesDiv.attr("style", "");
            $categoriesDivAdvContainer.attr("style", "");
            // Cleaning the filters array
            this.text = undefined;
            $('.categories-filter').val('');
            this._renderCategories();
        }
        return false;
    }

});

