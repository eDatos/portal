(function () {
    "use strict";
    var Constants = App.Constants;
    var FullScreen = App.FullScreen;

    App.namespace("App.widget.filter.sidebar");

    App.widget.filter.sidebar.FilterSidebarMultidatasetNodeView = Backbone.View.extend({

        template: App.templateManager.get('dataset/filter/sidebar/filter-sidebar-multidataset-node'),

        className: "filter-sidebar-multidataset-node",

        events: {
            'click .multidataset-link': 'onMultidatasetClick'
        },

        onMultidatasetClick: function (event) {
            if (FullScreen.isInFullScreen(Constants.metamacContainerSelector)) {
                var target = event.currentTarget;
                var newPath = target.pathname + target.search + target.hash;
                window.history.pushState("", "", newPath);
                var queryParams = target.search.replace('?', '').split('&').reduce(function(queryParams, queryString){
                    var pair = queryString.split('=');
                    queryParams[pair[0]] = pair[1] || '';
                    return queryParams;
                }, {});
                App.queryParams.agencyId =  queryParams.agencyId;
                App.queryParams.multidatasetId =  queryParams.multidatasetId;
                App.queryParams.identifier =  queryParams.resourceId;
                App.queryParams.resourceType =  queryParams.resourceType;
                App.queryParams.version =  queryParams.version;
                Backbone.history.loadUrl(Backbone.history.fragment);
                return false;
            }
        },

        initialize: function (options) {
            this.multidatasetNode = options.multidatasetNode;
        },

        _bindEvents: function () {
            var renderEvents = 'change:selected change:visible change:matchIndexBegin change:matchIndexEnd';
            //debounce for multiple changes when searching
            this.listenTo(this.multidatasetNode, renderEvents, _.debounce(this.render, 15));
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        destroy: function () {
            this._unbindEvents();
            this.remove();
        },

        _stateClass: function () {
            return this.multidatasetNode.get('selected') ?
                'filter-sidebar-multidataset-node-icon-check' :
                'filter-sidebar-multidataset-node-icon-unchecked';
        },

        _strongZone: function (str, begin, end) {
            if (begin >= 0 && end > begin) {
                var p1 = str.substring(0, begin);
                var p2 = str.substring(begin, end);
                var p3 = str.substring(end);
                return p1 + "<strong>" + p2 + "</strong>" + p3;
            } else {
                return str;
            }
        },

        render: function () {
            this._unbindEvents();
            this._bindEvents();

            var visible = this.multidatasetNode.get('visible');

            if (visible) {
                this.$el.removeClass('hide');
                var stateClass = this._stateClass();
                var multidatasetNode = this.multidatasetNode.toJSON();
                var label = this._strongZone(multidatasetNode.name, multidatasetNode.matchIndexBegin, multidatasetNode.matchIndexEnd);

                var context = {
                    multidatasetNode: multidatasetNode,
                    label: new Handlebars.SafeString(label),
                    stateClass: stateClass,
                    title: _.compact([multidatasetNode.name, this._getTextFromHTML(multidatasetNode.description)]).join(" - ")
                };
                this.$el.html(this.template(context));
            } else {
                this.$el.addClass('hide');
                this.$el.html('');
            }

            return this.el;
        },

        _getTextFromHTML: function (html) {
            return $('<div/>').html(html).text();
        }

    });
}());