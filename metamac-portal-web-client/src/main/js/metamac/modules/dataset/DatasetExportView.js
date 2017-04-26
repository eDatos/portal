(function () {

    App.namespace("App.modules.dataset");

    App.modules.dataset.ExportView = Backbone.View.extend({

        template : App.templateManager.get('dataset/dataset-export'),

        events : {
            "click .export-png" : "exportPng",
            "click .export-svg" : "exportSvg",
            "click .export-pdf" : "exportPdf"
        },

        _exportIsAllowed : function () {
            var activeType = this.model.get('type');
            return activeType !== 'table';
        },

        render : function () {
            var context = {
                exportIsAllowed : this._exportIsAllowed()
            };
            this.$el.html(this.template(context));
        },

        _export : function (e, type) {
            e.preventDefault();
            var self = this;
            App.track({event : 'export.before', type : type});
            App.doActionIfRegistered(function () {
                App.track({event : 'export.after', type : type});
                self.trigger("export", {type : type});
            });
        },

        exportPng : function (e) {
            this._export(e, "png");
        },

        exportSvg : function (e) {
            this._export(e, "svg");
        },

        exportPdf : function (e) {
            this._export(e, "pdf");
        }

    });

}());