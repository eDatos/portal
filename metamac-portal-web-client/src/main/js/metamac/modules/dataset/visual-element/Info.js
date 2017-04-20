(function () {
    "use strict";   

    App.namespace("App.VisualElement.Info");

    App.VisualElement.Info = function (options) {
        var self = this;
        this.initialize(options);
        this._type = 'info';        
        this.dataset = options.dataset; 
        this.datasetAttributes = this.dataset.data.getDatasetAttributes();
        this.optionsModel = options.optionsModel;

        this.api = new App.dataset.StructuralResourcesApi({metadata : this.dataset.metadata});
        
        this.listenTo(this.dataset.data, "hasNewData", this.updateDatasetAttributes ); 
    };

    App.VisualElement.Info.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.Info.prototype, {

        template : App.templateManager.get("dataset/dataset-info"),

        load : function () {
            if (this.optionsModel.get('type') == this._type) {
                this.getDimensions();        
                this.getMeasureConcepts();
                this._bindEvents();
                this.render();
            }            
        },

        updateMeasureConcepts : function(concepts) {
            this.measureConcepts = concepts;
            this.render();
        },

        updateDimensions : function(dimensions) {
            this.dimensions = dimensions;
            this.nonMeasureDimensions = _.filter(this.dimensions, function(dimension) { return dimension.type !== "MEASURE_DIMENSION"; });
            this.render();
        },

        updateDatasetAttributes : function() {
            this.datasetAttributes = this.dataset.data.getDatasetAttributes();
            this.dimensionAttributes = this.dataset.data.getDimensionsAttributes();
            this.load();
        },

        getDimensions : function() {
            var self = this;
            this.api.getDimensions(function(error, dimensions) {                
                self.updateDimensions(dimensions);

                self.api.getDimensionsConcepts(dimensions, function(error, dimensionsConcepts) {
                    var parsedDimensions = _.map(self.dimensions, function(dimension) {
                        var dimensionConcept = _.findWhere(dimensionsConcepts, { id : dimension.conceptIdentity.id });
                        dimension.conceptIdentity = dimensionConcept;
                        dimension.conceptName = App.i18n.localizeText(dimensionConcept.name);
                        dimension.conceptDescription = App.i18n.localizeText(dimensionConcept.description);
                        return dimension;
                    });
                    self.updateDimensions(parsedDimensions);
                });
            });
        },

        getMeasureConcepts : function() {
            var self = this;
            this.api.getMeasureConcepts(function(error, concepts) {
                var parsedConcepts = _.map(concepts, function(concept) {
                    concept.name = App.i18n.localizeText(concept.name);
                    concept.description = App.i18n.localizeText(concept.description);
                    return concept;
                });
                self.updateMeasureConcepts(parsedConcepts);
            });
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
            if (!this.$el) { return; }
            
            var context = {
                metadata : this.dataset.metadata.toJSON(),
                datasetAttributes : this.datasetAttributes,
                measureConcepts : this.measureConcepts,
                nonMeasureDimensions : this.nonMeasureDimensions,

                rightsHolder: this.getRightsHolderText()
            };
            
            this.$el.html(this.template(context));
            this.$el.find('.metadata-group').perfectScrollbar();
            this.$el.find('.metadata-accordion').accordion({
                collapsible: true,
                active: false,
                heightStyle: "content"
            });            
        }
    });

}());
