(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetDownloadView');

    App.modules.dataset.DatasetDownloadView = Backbone.View.extend({

        template : App.templateManager.get("dataset/dataset-download"),

        className : "dataset-download",

        events : {
            "click a" : "clickDownloadButton"
        },

        initialize : function () {
            this.filterDimensions = this.options.filterDimensions;
        },

        render : function () {
            var identifier  = this.filterDimensions.metadata.identifier();
            var datasetSelection = this.getDatasetSelection();
            var identifierUrlPart = identifier.agency + "/" + identifier.identifier + "/" + identifier.version;

            var context = {
                selection : JSON.stringify(datasetSelection),
                url : {
                    csv : App.endpoints["portal"] + "/apis/export/v1.0/tsv/" + identifierUrlPart,
                    excel : App.endpoints["portal"] + "/apis/export/v1.0/excel/" + identifierUrlPart,
                    px : App.endpoints["portal"] + "/apis/export/v1.0/px/" + identifierUrlPart
                }
            };
            this.$el.html(this.template(context));
        },

        getDatasetSelection : function () {
            var result = {
                dimensions : {
                    dimension : []
                }
            };
            var selection = this.filterDimensions.exportJSON();

            _.each(selection, function (dimension, dimensionId) {
                result.dimensions.dimension.push({
                    dimensionId : dimensionId,
                    labelVisualisationMode: "LABEL", //TODO obtain value from filterDimensions
                    position : dimension.position,
                    dimensionValues : {
                        dimensionValue : dimension.selectedCategories
                    }
                })
            });

            return {datasetSelection : result};
        },

        clickDownloadButton : function (e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);
            $currentTarget.parent("form").submit();
        },

        onClickDownloadXlsx : function (e) {
            e.preventDefault();
            this.exportApiCall("excel");
        },

        onClickDownloadCsv : function () {
            this.exportApiCall("tsv");
        },

        onClickDownloadPng : function () {

        },

        onClickDownloadPdf : function () {

        },

        onClickDownloadSvg : function () {

        },

        exportApiCall : function (exportType) {
            //TODO querys?
            var identifier  = this.filterDimensions.metadata.identifier();
            var url = App.endpoints["portal"] + "/apis/export/v1.0/" + exportType + "/" + identifier.agency + "/" + identifier.identifier + "/" + identifier.version;
            var selection = this.getDatasetSelection();

            var downloadRequest = $.ajax({
                url : url,
                method : "POST",
                data : JSON.stringify(selection),
                contentType : "application/json; charset=utf-8"
            });

            downloadRequest.done(function (response) {
                console.log(response);
            });
        }


    });

}());