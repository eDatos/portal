(function () {
    "use strict";

    App.namespace("App.widget.FilterOptionsDimensionRestriction");

    App.widget.FilterOptionsDimensionRestriction = function (options) {
        var restriction = -1;
        if (options) {
            restriction = options.restriction || restriction;
            this._categories = options.categories;
            this._selectedCategories = options.selectedCategories || _.clone(this._categories);
        }
        this.setRestriction(restriction);

        var wrappedFunctions = ["setSelectedCategories", "setRestriction",
            "setRestrictionWithPriorityOrder", "toggleCategorySelection",
            "unselectAll", "selectAll",
            "select", "unselect"];

        _.each(wrappedFunctions, function (fn) {
            this[fn] = _.wrap(this[fn], this._selectedCategoriesEventWrapper);
        }, this);
    };

    App.widget.FilterOptionsDimensionRestriction.prototype = {

        getRestriction : function () {
            return this._restriction;
        },

        getSelectedCategories : function () {
            return _.clone(this._selectedCategories);
        },

        setSelectedCategories : function (selectedCategories) {
            this._selectedCategories = _.clone(selectedCategories);
            this._applyRestriction();
        },

        setRestriction : function (restriction) {
            if (!_.isNumber(restriction)) throw new Error("Not Number");

            this._restriction = restriction;
            this._applyRestriction();
        },

        setRestrictionWithPriorityOrder : function (restriction, priorityOrder) {
            this._restriction = restriction;
            if (this._needRemoveElements()) {
                this._selectedCategories = _.sortBy(this._selectedCategories,function (category) {
                    return _.indexOf(priorityOrder, category);
                }).reverse().splice(0, this._restriction);
            }
        },

        _needRemoveElements : function () {
            var result = false;
            if (this._restriction >= 0) {
                var diff = this._selectedCategories.length - this._restriction;
                result = diff > 0;
            }
            return result;
        },

        _applyRestriction : function () {
            if (this._needRemoveElements()) {
                this._selectedCategories = this._selectedCategories.splice(0, this._restriction);
            }
        },

        isCategorySelected : function (category) {
            return _.indexOf(this._selectedCategories, category) !== -1;
        },

        toggleCategorySelection : function (category) {
            var selected = this.isCategorySelected(category);
            if (selected) {
                this._unselectCategory(category);
            } else {
                this._selectCategory(category);
            }
            return !selected;
        },

        _unselectCategory : function (category) {
            var index = _.indexOf(this._selectedCategories, category);
            if (index !== -1 && this.count() > 1) {
                this._selectedCategories.splice(index, 1);
            }
        },

        _selectCategory : function (category) {
            this._selectedCategories.push(category);
            if (this._needRemoveElements()) {
                this._selectedCategories.shift();
            }
        },

        clone : function () {
            var options = {
                selectedCategories : _.clone(this._selectedCategories),
                categories : _.clone(this._categories),
                restriction : this._restriction
            };
            return new App.widget.FilterOptionsDimensionRestriction(options);
        },

        unselectAll : function (keepLastInOrder) {
            if (keepLastInOrder) {
                var lastIndex = this._selectedCategories.length - 1;
                this._selectedCategories = [this._selectedCategories.sort()[lastIndex]];
            } else {
                this._selectedCategories = this._selectedCategories.slice(0, 1);
            }
        },

        selectAll : function () {
            this._selectedCategories = _.union(this._selectedCategories, this._categories);
            this._applyRestriction();
        },

        areAllSelected : function () {
            if (this._restriction === -1 || this._categories.length < this._restriction) {
                return this._selectedCategories.length === this._categories.length;
            } else {
                return this._selectedCategories.length === this._restriction;
            }
        },

        count : function () {
            return this._selectedCategories.length;
        },

        select : function (categories) {
            this._selectedCategories = _.unique(categories.concat(this._selectedCategories));
            this._applyRestriction();
        },

        unselect : function (categories) {
            var firstSelected = this._selectedCategories[0];
            this._selectedCategories = _.difference(this._selectedCategories, categories);
            if (this._selectedCategories.length === 0) {
                this._selectedCategories = [firstSelected];
            }
        },

        _selectedCategoriesEventWrapper : function (fn) {
            var args = _.toArray(arguments);
            var before = _.clone(this._selectedCategories);
            var restArguments = args.slice(1);
            var ret = fn.apply(this, restArguments);
            var after = _.clone(this._selectedCategories);
            var options = _.last(args);

            var unselected = _.difference(before, after);
            _.each(unselected, function (category) {
                this.trigger("unselect:" + category, {category : category});
            }, this);

            var selected = _.difference(after, before);
            _.each(selected, function (category) {
                this.trigger("select:" + category, {category : category});
            }, this);

            if (selected.length > 0 || unselected.length > 0) {
                if (!_.isObject(options) || !options.silent) {
                    this.trigger("change");
                }
            }

            return ret;
        }

    };

    _.extend(App.widget.FilterOptionsDimensionRestriction.prototype, Backbone.Events);

}());
