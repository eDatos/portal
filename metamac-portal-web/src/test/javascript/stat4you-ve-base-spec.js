describe("Base visual element -", function(){
    
    var $external = null;
    var veBase = null;

    /* INIT: Load filter */
    beforeEach(function() {
        $external = $('<div id="datasets-visualization" class="datasets-visualization"/>').appendTo($('body'));
        var $ve = $('<div id="visual-element"/>').appendTo($external);
        var $vecontainer = $('<div id="visual-element-container"/>').appendTo($ve);
        
        var options = {};
        options.container = {"filter": null,
                             "external": $external.get(0),
                             "ve": $ve.get(0),
                             "vecontainer": $vecontainer.get(0)};
        
        options.dimensions = $.parseJSON(OptionsData.poblacion.filter.dimensions);
        options.categoriesPerDim = $.parseJSON(OptionsData.poblacion.filter.categoriesPerDim);


        // Creating the pie
        veBase = new STAT4YOU.VisualElement.Base();
        veBase.setOptions(options);
    });
    
    
    /* DESTROY: Close filter */
    afterEach(function() {
        /* Removing */
        if ($external.length > 0)
            $external.remove();
    });
    
    
    it("Finding the first free position", function() {
        /* Initially */
        var firstFreeFixed = veBase._findFirstFreeFixedPos();
        expect(firstFreeFixed).toBe(40);
        
        /* Moving a dimension (the 21st) to fixed (now the 40th) */
        veBase._options.dimensions.idToPos["2"] = 40;
        veBase._options.dimensions.idToPos["2"] = 40;
        delete veBase._options.dimensions.posToId["21"];
        veBase._options.dimensions.posToId["40"] = 2;

        firstFreeFixed = veBase._findFirstFreeFixedPos();
        expect(firstFreeFixed).toBe(41);
    });
    
    
    it("Decrementing a fixed post after an element has been moved from fixed to another place", function() {
        /* Moving a dimension (the 21st) to fixed (now the 41th)
         * as though there was someone in the 40th that has been moved (maybe to the 20th) */
        veBase._options.dimensions.idToPos["2"] = 41;
        veBase._options.dimensions.idToPos["2"] = 41;
        delete veBase._options.dimensions.posToId["21"];
        veBase._options.dimensions.posToId["41"] = 2;

        /* Decrementing to delete the gap */
        firstFreeFixed = veBase._decFixedPos();
        expect(veBase._options.dimensions.idToPos["2"]).toBe(40);
    });
    
    
    it("Changing states of a certain dimension to fixed", function() {
        /* Initially all the states of dim 0 must be enabled */
        expect(veBase._options.categoriesPerDim[1].state).toEqual({"0":1,"1":1,"2":1,"3":1,"4":1});
        veBase._changeStatesToFixed(1);
        expect(veBase._options.categoriesPerDim[1].state).toEqual({"0":1,"1":0,"2":0,"3":0,"4":0});
    });
    
    
    it("Testing the resize-full-screen and _loadOldAndBackupTemporalFilters", function() {
        veBase.destroy = function(){};
        veBase.load = function(){};
        /* Saving the initial config */
        veBase.temporalOptionsForFilters = {};
        veBase.temporalOptionsForFilters.posToId = veBase._options.posToId;
        veBase.temporalOptionsForFilters.idToPos = veBase._options.idToPos;
        veBase.temporalOptionsForFilters.categoriesPerDim = [];
        for (var i=0; i<veBase._options.categoriesPerDim.length; i++)
            veBase.temporalOptionsForFilters.categoriesPerDim[i] = veBase._options.categoriesPerDim[i].state;
        /* Aplying changes to the filter */
        veBase._options.categoriesPerDim[1].state = {"0":0,"1":1,"2":1,"3":0,"4":0};
        /* resizeFullScreen */
        veBase.resizeFullScreen();
        expect(veBase._options.categoriesPerDim[1].state).toEqual({"0":0,"1":1,"2":1,"3":0,"4":0});
    });
    
    
    it("Testing use-temporal-options", function() {
        veBase.destroy = function(){};
        veBase.load = function(){};
        /* Saving the initial config */
        veBase.temporalOptionsForFilters = {};
        veBase.temporalOptionsForFilters.posToId = veBase._options.posToId;
        veBase.temporalOptionsForFilters.idToPos = veBase._options.idToPos;
        veBase.temporalOptionsForFilters.categoriesPerDim = [];
        for (var i=0; i<veBase._options.categoriesPerDim.length; i++)
            veBase.temporalOptionsForFilters.categoriesPerDim[i] = veBase._options.categoriesPerDim[i].state;
        /* Aplying changes to the filter */
        veBase._options.categoriesPerDim[1].state = {"0":0,"1":1,"2":1,"3":0,"4":0};
        /* resizeFullScreen */
        veBase._useTemporalOptions();
        expect(veBase._options.categoriesPerDim[1].state).toEqual(veBase.temporalOptionsForFilters.categoriesPerDim[1]);
    });
    
    
});