(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    var FilterSidebarCategoryView = App.widget.filter.sidebar.FilterSidebarCategoryView;
    var FilterRepresentation = App.modules.dataset.filter.models.FilterRepresentation;

    App.widget.filter.sidebar.FilterSidebarMultidatasetView = Backbone.View.extend({

        template: App.templateManager.get('dataset/filter/sidebar/filter-sidebar-multidataset'),

        initialize: function (options) {
            this.filterDimensions = options.filterDimensions;
            this.multidatasetId = this.filterDimensions.getMultidatasetId();
            this.resetLastIndex();
            this.collapsable = _(options).has('collapsable') ? options.collapsable : true;
        },

        destroy: function () {
            this._unbindEvents();
            this.remove();
        },

        close: function () {
            this.remove();
        },

        events: {
            "click .filter-sidebar-multidataset-title": "_onClickTitle"
        },

        _bindEvents: function () {
            this.listenTo(this.filterDimensions, "change:visible", this.resetLastIndex);
            this.listenTo(this.filterDimensions, "change:open", this._onChangeOpenFilterDimensions);
            if (this.multidataset) {

                this.listenTo(this.multidataset, "change:open", this._onChangeOpenMultidataset);
            }
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        loadMultidataset: function (multidatasetIdentifier) {
            var multidataset = new App.modules.multidataset.Multidataset({
                multidatasetIdentifier: multidatasetIdentifier,
                filterDimensions: this.filterDimensions
            });
            if (multidataset.equals(this.multidataset)) {
                var deferred = $.Deferred();
                deferred.resolve();
                return deferred.promise();
            } else {
                this.multidataset = multidataset;
                return this.multidataset.fetch();
            }
        },

        render: function () {
            this.delegateEvents();
            this._unbindEvents();
            this._bindEvents();
            var self = this;

            this.loadMultidataset(this.multidatasetId)
                .then(function () {
                    if (self.multidataset.nodes) {
                    self.$el.html(self.template({
                            multidataset: self.multidataset.toJSON(),
                        nodes: self.multidataset.nodes.toJSON()
                    }));
                    }
                });

            var $categories = this.$(".filter-sidebar-categories");
            $categories.perfectScrollbar();

            this.setMaxHeight(this.maxHeight);
            this._onChangeOpenFilterDimensions(this.filterDimensions);
            this._onChangeOpenMultidataset(this.multidataset);

            return this.el;
        },

        updateScrollbar: function () {
            // Wait for DOM
            setTimeout(function () {
                this.$(".filter-sidebar-categories").perfectScrollbar('update');
            }, 10);
        },

        getCollapsedHeight: function () {
            return this.$(".filter-sidebar-multidataset-title").outerHeight(true);
        },

        _onClickTitle: function (e) {
            e.preventDefault();
            if (this.collapsable) {
                this.multidataset.toggle('open');
            }
        },

        _onChangeOpenMultidataset: function (model) {
            this._toggleDrawer(this.multidataset.get('open'));
            if (this.multidataset.get('open')) {
                this.filterDimensions.closeOpenDimensions();
            }
        },

        _onChangeOpenFilterDimensions: function (model) {
            if (model && model.get('open')) {
                this.multidataset.set('open', false);
            }
        },

        _toggleDrawer: function (isOpen) {
            this.$el.find('.collapse').toggleClass('in', isOpen);
            this.$el.find('.filter-sidebar-multidataset-title').toggleClass('active', isOpen);
            this.updateScrollbar();
        },

        setMaxHeight: function (maxHeight) {
            this.maxHeight = maxHeight;
            this.$('.collapse').css('max-height', maxHeight);
            var SIDEBAR_MULTIDATASET_HEADER_HEIGHT = 65;
            var height = maxHeight - SIDEBAR_MULTIDATASET_HEADER_HEIGHT;
            this.$('.filter-sidebar-categories').css('height', height);
            this.updateScrollbar();
        },

        resetLastIndex: function () {
            this.lastIndex = -1;
        }

    });
}());