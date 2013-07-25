(function () {

    STAT4YOU.namespace("STAT4YOU.modules.dataset");

    STAT4YOU.modules.dataset.ExportView = Backbone.View.extend({

        template : STAT4YOU.templateManager.get('dataset/dataset-export'),

        events : {
            "click .export-png" : "exportPng",
            "click .export-svg" : "exportSvg",
            "click .export-pdf" : "exportPdf"
        },

        _exportIsAllowed : function () {
            var activeType = this.model.get('type');
            return activeType !== 'table' && activeType !== 'canvasTable';
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
            STAT4YOU.track({event : 'export.before', type : type});
            STAT4YOU.doActionIfRegistered(function () {
                STAT4YOU.track({event : 'export.after', type : type});
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