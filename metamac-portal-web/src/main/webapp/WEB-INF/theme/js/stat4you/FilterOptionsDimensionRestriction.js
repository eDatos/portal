(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.widget.FilterOptionsDimensionRestriction");

    STAT4YOU.widget.FilterOptionsDimensionRestriction = function (options) {
        var restriction = -1;
        if(options){
            restriction = options.restriction || restriction;
            this._categories = options.categories;
            this._selectedCategories = options.selectedCategories || _.clone(this._categories);
        }
        this.setRestriction(restriction);
    };

    STAT4YOU.widget.FilterOptionsDimensionRestriction.prototype = {

        getRestriction : function () {
            return this._restriction;
        },

        setRestriction : function(restriction) {
            this._restriction = restriction;
            this._applyRestriction();
        },

        _needRemoveElements : function () {
            var result = false;
            if(this._restriction >= 0){
                var diff = this._selectedCategories.length - this._restriction;
                result = diff > 0;
            }
            return result;
        },

        _applyRestriction : function () {
            if(this._needRemoveElements()){
                this._selectedCategories = this._selectedCategories.splice(0, this._restriction);
            }
        },

        isCategorySelected : function (category) {
            return _.indexOf(this._selectedCategories, category) !== -1;
        },

        toggleCategorySelection : function (category) {
            if(this.isCategorySelected(category)){
                this._deselectCategory(category);
            } else {
                this._selectCategory(category);
            }
        },

        _deselectCategory : function (category) {
            var index = _.indexOf(this._selectedCategories, category);
            if(index !== -1 && this.count() > 1){
                this._selectedCategories.splice(index, 1);
            }
        },

        _selectCategory : function (category) {
            this._selectedCategories.push(category);
            if(this._needRemoveElements()){
                this._selectedCategories.shift();
            }
        },

        clone : function () {
            var options = {
                selectedCategories : _.clone(this._selectedCategories),
                categories : _.clone(this._categories),
                restriction : this._restriction
            };
            return new STAT4YOU.widget.FilterOptionsDimensionRestriction(options);
        },

        unselectAll : function () {
            this._selectedCategories = this._selectedCategories.slice(0, 1);
        },

        selectAll : function () {
            this._selectedCategories = _.union(this._selectedCategories, this._categories);
            this._applyRestriction();
        },

        areAllSelected : function () {
            if(this._restriction === -1 || this._categories.length < this._restriction){
                return this._selectedCategories.length === this._categories.length;
            }else{
                return this._selectedCategories.length === this._restriction;
            }
        },

        count : function () {
            return this._selectedCategories.length;
        }

    };

}());
