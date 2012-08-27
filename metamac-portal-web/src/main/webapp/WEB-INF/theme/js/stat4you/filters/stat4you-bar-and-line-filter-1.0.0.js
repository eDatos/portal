STAT4YOU.namespace("STAT4YOU.Filters.BarAndLineChartFilter");


/*** CHILDREN  LEVEL 2 ***/
STAT4YOU.Filters.BarAndLineChartFilter = (function() {
    
    /**********************************************************************************/
    /**                             BarAndLineChartFilter                            **/
    /**********************************************************************************/
    var BarAndLineChartFilter = function(type) {
        this.type = type;
        this.restrictionDim1 = null;
        this.restrictionDim2 = null;
    };
    
    
    BarAndLineChartFilter.prototype = new STAT4YOU.Filters.ChartFilter();
    
    
    BarAndLineChartFilter.prototype._mustBeAFixedDimension = function(id) {
        return (id != "div-dimension-long1" && id != "div-dimension-long2");
    };
    
    
    BarAndLineChartFilter.prototype._getTextDimensionPosition = function(i) {
        var self = this;
        
        switch(i) {
        case 1:
            text = I18n.t("filter.text.horizontalAxis");            
        break;
        case 2:
            if (self.type == "line")
                text = I18n.t("filter.text.lines");
            else
                text = I18n.t("filter.text.columns");
        break;
        default:
            i = i % 10;
            text = I18n.t("filter.text.fixedDimensionX")+" "+i;            
        break;
        }
        
        return text;
    };
    
    
    BarAndLineChartFilter.prototype.setDimensionRestrictions = function(restrictionDim1, restrictionDim2) {
        var self = this;
        
        self.restrictionDim1 = restrictionDim1;
        self.restrictionDim2 = restrictionDim2;
    };
    
    
    return BarAndLineChartFilter;
    
})();
    