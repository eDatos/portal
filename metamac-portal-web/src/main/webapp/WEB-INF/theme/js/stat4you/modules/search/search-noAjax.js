/**
 *
 */
STAT4YOU.namespace("STAT4YOU.modules.Search");

STAT4YOU.modules.Search.View = Backbone.View.extend({

    template : STAT4YOU.templateManager.get("search/search"),

    render : function(){

        var context =  this.getContext();

        this.$el.html(this.template(context));
    },

    getContext : function(){
        var model = this.model.toJSON();

        var self = this;
        var facets  = model.facets;
        var fullUrl = context + "/search?q=" + model.query ;

        _.each([facets.frequentDimFacet, facets.spatialFacet, facets.yearFacet, facets.categoryFacet], function(facet){
            if(facet){
                _.each(facet.constraints, function(constraint){
                    constraint.selected = !constraint.selected;

                    var params = self._getFacetsUrlParams(model.facets);
                    if(params.length > 0){
                        params = "&" + params;
                    }
                    constraint.url = fullUrl + params;
                    constraint.selected = !constraint.selected;
                });
            }
        });

        return model;
    },

    _getFacetsUrlParams : function(facets){
        var urlParams = _.extend({},
                                 this._getFacetUrlParams(facets.frequentDimFacet),
                                 this._getFacetUrlParams(facets.spatialFacet),
                                 this._getFacetUrlParams(facets.yearFacet),
                                 this._getFacetUrlParams(facets.categoryFacet)
                                );
        return $.param(urlParams, true);
    },

    _getFacetUrlParams : function(facet) {
        if(facet){
            var selectedConstraints = _.chain(facet.constraints)
                                        .filter(function(constraint){
                                            return constraint.selected;
                                        }).map(function(constraint){
                                            return constraint.code
                                        }).value();
            var result = {};
            if(selectedConstraints.length > 0){
                result[facet.fieldName] = selectedConstraints;
            }
        }
        return result;
    }

});