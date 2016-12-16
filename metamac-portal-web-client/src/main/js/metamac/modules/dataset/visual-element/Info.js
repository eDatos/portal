(function () {
    "use strict";

    App.namespace("App.VisualElement.Info");

    App.VisualElement.Info = function (options) {
        this.initialize(options);
        this._type = 'info';        
        this.dataset = options.dataset;    
        this.listenTo(this.dataset.data, "hasNewData", this.updateDatasetAttributes ); 
    };

    App.VisualElement.Info.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.Info.prototype, {

        template : App.templateManager.get("dataset/dataset-info"),

        load : function () {
            this._bindEvents();
            this.render();
        },

        updateDatasetAttributes : function() {
            this.datasetAttributes = this.dataset.data.getDatasetAttributes();
        },

        destroy : function () {
            this._unbindEvents();
        },

        _bindEvents : function () {
            this.listenTo(this.dataset.data, "hasNewData", this.updateDatasetAttributes );
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        render : function () {
            var context = {
                metadata : this.dataset.metadata.toJSON(),
                datasetAttributes : this.datasetAttributes
            };
            this.$el.html(this.template(context));
        }
    });

}());
