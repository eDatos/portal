(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetDownloadView');

    var svgExporter = new App.svg.Exporter();

    App.modules.dataset.DatasetDownloadView = Backbone.View.extend({

        template : App.templateManager.get("dataset/dataset-download"),

        className : "dataset-download",

        events : {
            "click a" : "clickDownloadButton"
        },

        initialize : function () {
            this.filterDimensions = this.options.filterDimensions;
            this.visualizationType = this.options.visualizationType;
        },

        render : function () {
            var identifier  = this.filterDimensions.metadata.identifier();
            var datasetSelection = this.getDatasetSelection();
            var identifierUrlPart = identifier.agency + "/" + identifier.identifier + "/" + identifier.version;
            
            var context = {
                selection : JSON.stringify(datasetSelection),
                emptySelection : JSON.stringify(this.getEmptyDatasetSelection()),
                url : {
                    csv : App.endpoints["statistical-visualizer"] + "/apis/export/v1.0/tsv/" + identifierUrlPart,
                    excel : App.endpoints["statistical-visualizer"] + "/apis/export/v1.0/excel/" + identifierUrlPart,
                    px : App.endpoints["statistical-visualizer"] + "/apis/export/v1.0/px/" + identifierUrlPart
                },
                buttonConfig : this._getButtonConfiguration()
            };

            if (this._exportableImage()) {
                var self = this;
                svgExporter.addStyleAsync(svgExporter.sanitizeSvgElement($('svg'))).done(function (svg) {
                    var svgContext = {
                        svg : svg,
                        url : {                            
                            png : App.endpoints["statistical-visualizer"] + "/apis/export/v1.0/image" + self._getImageExportApiParams('png'),
                            pdf : App.endpoints["statistical-visualizer"] + "/apis/export/v1.0/image" + self._getImageExportApiParams('pdf'),
                            svg : App.endpoints["statistical-visualizer"] + "/apis/export/v1.0/image" + self._getImageExportApiParams('svg')
                        }
                    };
                    _.extend(context, svgContext);
                    self.$el.html(self.template(context));
                });
            } else {
                this.$el.html(this.template(context));
            }
        },

        _exportableImage : function() {
            return $('svg').exists();
        },

        _getButtonConfiguration : function() {
            var haveDataFormats = _.contains(['canvasTable'], this.visualizationType);
            var haveMapFormats = false; // TODO: METAMAC-2033
            var haveImageFormats = this._exportableImage();

            return {
                dataFormats : haveDataFormats,
                mapFormats: haveMapFormats,
                imageFormats: haveImageFormats
            };
        },
 
        _getImageExportApiParams : function(type) {
            var identifier  = this.filterDimensions.metadata.identifier();            
            var filename = "chart" + "-" + identifier.agency + "-" + identifier.identifier + "-" + identifier.version; // IDEA Add visualization type to the name

            var mime = svgExporter.mimeTypeFromType(type);
            var params = '?';
            params += 'filename=' + encodeURIComponent(filename);
            params += '&type=' + encodeURIComponent(mime);
            params += '&width=' + $('svg').width();
            params += '&scale=2';

            return params;
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

        // Empty selection returns all
        getEmptyDatasetSelection : function () {
            return {datasetSelection : null};
        },

        clickDownloadButton : function (e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);

            if (this._isChromeFrameWidget()) {
                this._openPopupDownloadForm($currentTarget.parent("form"));
            } else {
                $currentTarget.parent("form").submit();  
            }
        },        

        _openPopupDownloadForm : function (form) {
            var form = form.clone();
            form.append('<input type="submit" value="' + 'Descargar' + '">');
            var formHTML = form[0].outerHTML;

            var popupProperties = "";
            popupProperties += 'width=' + 200 + ',';
            popupProperties += 'height=' + 100 + ',';
            popupProperties += 'left=' + 100 + ',';
            popupProperties += 'top=' + 100;

            var popup = window.open('', '', popupProperties);
            popup.document.write(formHTML);
            popup.focus();
        },

        _isChromeFrameWidget : function () {
            return App.config["chromeFrameObject"];
            // I haven´t found a way to properly detect the difference between a embedded chromeFrame object and chromeFrame triggered from parent, so passed as variable when embedded object
            //return App.config["widget"] && !!window.externalHost;
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
            var url = App.endpoints["statistical-visualizer"] + "/apis/export/v1.0/" + exportType + "/" + identifier.agency + "/" + identifier.identifier + "/" + identifier.version;
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