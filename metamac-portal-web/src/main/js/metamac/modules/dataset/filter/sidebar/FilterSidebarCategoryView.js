(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    App.widget.filter.sidebar.FilterSidebarCategoryView = Backbone.View.extend({

        template : App.templateManager.get('dataset/filter/sidebar/filter-sidebar-category'),

        className : "filter-sidebar-category",

        initialize : function (options) {
            this.filterRepresentation = options.filterRepresentation;
            this.filterDimension = options.filterDimension;
            this.filterSidebarDimensionView = options.filterSidebarDimensionView;
        },

        events : {
            "click .filter-sidebar-category-label" : "toggleSelected",
            "click .category-state" : "toggleSelected",
            "click .category-expand" : "toggleOpen"
        },

        _bindEvents : function () {
            var renderEvents = 'change:selected change:childrenSelected change:visible change:open change:matchIndexBegin change:matchIndexEnd';
            //debounce for multiple changes when searching
            this.listenTo(this.filterRepresentation, renderEvents, _.debounce(this.render, 15));
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        destroy : function () {
            this._unbindEvents();
            this.remove();
        },

        toggleOpen : function (e) {
            e.preventDefault();
            this.filterRepresentation.toggle('open');
        },

        toggleSelected : function (e) {
            e.preventDefault();
            var representations = this.filterDimension.get('representations');
            var currentIndex = representations.indexOf(this.filterRepresentation);
            if (e.shiftKey && this.filterSidebarDimensionView.lastIndex !== -1) {
                var newState = !this.filterRepresentation.get('selected');
                var sortedIndex = [currentIndex, this.filterSidebarDimensionView.lastIndex].sort();
                representations.toggleRepresentationsVisibleRange(sortedIndex[0], sortedIndex[1], newState);
            } else {
                this.filterRepresentation.toggle('selected');
            }
            this.filterSidebarDimensionView.lastIndex = currentIndex;
        },

        _stateClass : function () {
            var stateClass;
            if (this.filterRepresentation.children.length > 0 && this.filterRepresentation.get('childrenSelected')) {
                stateClass = this.filterRepresentation.get('selected') ?
                    'icon-check-sign' :
                    'icon-sign-blank';
            } else {
                stateClass = this.filterRepresentation.get('selected') ?
                    'icon-check' :
                    'icon-check-empty';
            }
            return stateClass;
        },

        _collapseClass : function () {
            if (this.filterRepresentation.children.length > 0) {
                var collapseClass = this.filterRepresentation.get('open') ?
                    'icon-collapse' :
                    'icon-expand';
                return collapseClass;
            }
        },

        _strongZone : function (str, begin, end) {
            if (begin >= 0 && end > begin) {
                var p1 = str.substring(0, begin);
                var p2 = str.substring(begin, end);
                var p3 = str.substring(end);
                return p1 + "<strong>" + p2 + "</strong>" + p3;
            } else {
                return str;
            }
        },

        render : function () {
            this._unbindEvents();
            this._bindEvents();

            var visible = this.filterRepresentation.get('visible');

            if (visible) {
                this.$el.removeClass('hide');
                var stateClass = this._stateClass();
                var collapseClass = this._collapseClass();
                var filterRepresentation = this.filterRepresentation.toJSON();
                var label = this._strongZone(filterRepresentation.label, filterRepresentation.matchIndexBegin, filterRepresentation.matchIndexEnd);

                var context = {
                    filterRepresentation : filterRepresentation,
                    label : new Handlebars.SafeString(label),
                    stateClass : stateClass,
                    collapseClass : collapseClass
                };
                this.$el.html(this.template(context));
                this.$el.css("padding-left", this.filterRepresentation.get('level') * 20);
            } else {
                this.$el.addClass('hide');
                this.$el.html('');
            }

            return this.el;
        }

    });
}());