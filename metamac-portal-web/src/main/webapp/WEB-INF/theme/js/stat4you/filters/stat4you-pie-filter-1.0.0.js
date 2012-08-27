STAT4YOU.namespace("STAT4YOU.Filters.PieCharFilter");


/*** CHILDREN  LEVEL 2 ***/
STAT4YOU.Filters.PieChartFilter = (function() {

    /**********************************************************************************/
    /**                             PieChartFilter                                   **/
    /**********************************************************************************/
    var PieChartFilter = function() {
        this.restrictionDim1 = null;
    };
    
    
    PieChartFilter.prototype = new STAT4YOU.Filters.ChartFilter();
    
    
    PieChartFilter.prototype._mustBeAFixedDimension = function(id) {
        return (id != "div-dimension-long1");
    };
    
    
    PieChartFilter.prototype._getTextDimensionPosition = function(i) {
        switch(i) {
        case 1:
            text = I18n.t("filter.text.sectors");            
        break;
        default:
            i = i % 10;
            text = I18n.t("filter.text.fixedDimensionX")+" "+i;
        break;
        }
        
        return text;
    };
    
    
    PieChartFilter.prototype.setDimensionRestrictions = function(restrictionDim1) {
        var self = this;
        
        self.restrictionDim1 = restrictionDim1;
    };
    
    return PieChartFilter;

})();
