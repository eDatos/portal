(function () {
    "use strict";

    App.namespace("App.components.sidebar");

    App.components.sidebar.SidebarView = Backbone.View.extend({

        template : App.templateManager.get("components/sidebar/sidebar-container"),

        className : "sidebar-container",

        initialize : function (options) {
            this.sideViews = options.sideViews;
            this.contentView = options.contentView;

            var stateOptions = {
                sideViewsIds : _.pluck(this.sideViews, "id")
            };
            this.state = new App.components.sidebar.SidebarStateModel(stateOptions);

            _.bindAll(this, "_onClickSplitter", "_onMousemoveSplitter", "_onMouseupSplitter");
        },

        events : {
            "click .sidebar-menu-item" : "_onClickMenuItem",
            "mousedown .sidebar-splitter" : "_onClickSplitter"
        },

        _bindEvents : function () {
            this.listenTo(this.state, "change:currentSideView", this._onChangeCurrentSideView);
            this.listenTo(this.state, "change:width", this._updateSidebar);
            this.listenTo(this.state, "change:visible", this._updateSidebar);
            this.delegateEvents();
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        _onClickMenuItem : function (e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);
            var sideViewId = $currentTarget.data("view-id");

            this.state.toggleSideView(sideViewId);
        },

        _updateSidebar : function () {
            var width = this.state.get('width');
            var menuWidth = this.$menu.width();
            if (this.state.get('visible')) {
                this.$sidebar.css({width : width, left : menuWidth});
                this.$content.css('padding-left', menuWidth + width);
            } else {
                this.$sidebar.css({width : width, left : -width});
                this.$content.css('padding-left', menuWidth);
            }
        },

        _onClickSplitter : function (e) {
            e.preventDefault();

            this._splitterInitialState = {
                pageX : e.pageX,
                width : this.$sidebar.outerWidth()
            };

            var isParentInFullScreen = this.$el.hasClass("full-screen");
            var $overlayContainer = isParentInFullScreen ? this.$el : $('body');

            this.$overlay = $('<div>')
                .addClass('sidebar-overlay')
                .appendTo($overlayContainer)
                .on('mousemove.sidebar', this._onMousemoveSplitter)
                .on('mouseup.sidebar', this._onMouseupSplitter);
        },

        _onMousemoveSplitter : function (e) {
            e.stopImmediatePropagation();
            if (e.which === 1) {
                var diff = e.pageX - this._splitterInitialState.pageX;
                var newWidth = this._splitterInitialState.width + diff;
                this.state.set('width', newWidth, {validate : true});
            } else {
                this._onMouseupSplitter();
            }
        },

        _onMouseupSplitter : function () {
            if (this.$overlay) {
                this.$overlay.remove();
            }
        },

        _getSideView : function (id) {
            return _.find(this.sideViews, function (view) {
                return view.id === id;
            });
        },

        _onChangeCurrentSideView : function () {
            var sidebarContainer = this.$(".sidebar-container");
            var currentSideViewId = this.state.get('currentSideView');

            if (currentSideViewId) {
                var currentView = this._getSideView(currentSideViewId);
                currentView.render();
                sidebarContainer.toggleClass("sidebar-slideRight", true);
                this.state.set('visible', true);
                this.$("li[data-view-id='" + currentSideViewId + "']").addClass("active");
            } else {
                this.state.set('visible', false);
            }

            var previousViewId = this.state.previous("currentSideView");
            if (previousViewId) {
                var previousView = this._getSideView(previousViewId);
                if (previousView.destroy) {
                    previousView.destroy();
                }
                this.$("li[data-view-id='" + previousViewId + "']").removeClass("active");
            }

        },

        render : function () {
            this._unbindEvents();
            this._bindEvents();

            var context = {};
            context.menuItems = _.map(this.sideViews, function (view) {
                return {id : view.id, icon : view.icon, title : view.title};
            });
            this.$el.html(this.template(context));

            this.$menu = this.$('.sidebar-menu');
            this.$sidebar = this.$('.sidebar-sidebar');
            this.$sidebarContent = this.$('.sidebar-sidebar-content');
            this.$content = this.$('.sidebar-content');

            _.each(this.sideViews, function (view) {
                view.setElement(this.$sidebarContent);
            }, this);

            this.sideViews[0].render();

            this.contentView.setElement(this.$content);
            this.contentView.render();
        },

        close : function () {
            this.state.restoreDefaults();
        }

    });


}());