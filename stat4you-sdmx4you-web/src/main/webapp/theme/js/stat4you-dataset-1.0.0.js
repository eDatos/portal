STAT4YOU.namespace("STAT4YOU.Dataset");

STAT4YOU.Dataset = (function() {

    // constructor
    function constructor(datasets) {
        this._datasets = datasets;
        this._datasetsId = [];
        
        // Mult Factor
        this._mult = {};
        
        // This functions are created dinamically
        // Receives as parameters the id to transform (["LL", "M"])
        // Returns the position ([1, 3])
        this._transformIdToPos = {};
        
        // This functions are created dinamically
        // Receives as parameters the pos to transform (["1", "1"])
        // Returns the array position (5)
        this._transformPosToPosArrays = {};
        
        
        for (var dsID in this._datasets) {
            this._createMult(dsID);
            this._setUpTransformIdToPos(dsID);
            this._setUpTransformPosToPosArray(dsID);
            
            this._datasetsId.push(dsID);
        }
        
        return this;
    }
            
    constructor.prototype = {
        getDatasets: function() {
            var self = this;
            return self._datasetsId;
        },
        
        getTitle: function() {
        	var self = this;
            return self._datasets[self._datasetsId[0]].metadata.TITLE;
        },

        getPublisher: function() {
        	var self = this;
            return self._datasets[self._datasetsId[0]].metadata.PUBLISHER;
        },

        getSelectedLanguages: function() {
            var self = this;
            
            return self._datasets[self._datasetsId[0]].selected_languages;
        },

        getDimensions: function(dsID, lang) {
            var self = this,
                ds = self._datasets[dsID];
            
            if (ds === undefined) {
                return false; // TODO: Ver como devolver estos errores
            }            
            
            var langIndex = ds.selected_languages.indexOf(lang);
                dimension = ds.metadata.dimension,
                dims = dimension.id.length;                
            var labels = [];
            for ( var i = 0; i < dims; i++ ) {
                labels.push(dimension.label[dimension.id[i]][langIndex]);
            }
            
            return {"id": dimension.id, "label": labels};
        },

        getRepresentations: function(dsID, dimID, lang) {
            var self = this,
                ds = self._datasets[dsID];
            
            if (ds === undefined) {
                return false; // TODO: Ver como devolver estos errores
            }            
            
            var langIndex = ds.selected_languages.indexOf(lang);
                representationIDs = ds.metadata.dimension.representation.idCode[dimID],
                representationLabels = ds.metadata.dimension.representation.labelCode[dimID],
                size = representationIDs.length;                
            var labels = [];
            for ( var i = 0; i < size; i++ ) {
                labels.push(representationLabels[representationIDs[i]][langIndex]);
            }
            
            return {"id": representationIDs, "label": labels};
        },
        
        getDataById: function(dsID, id) {
            var self = this,
                ds = self._datasets[dsID],
                pos = [];
            
            if (ds === undefined) {
                return false; // TODO: Ver como devolver estos errores
            }

            pos = self._transformIdToPos[dsID].apply(self, [id]); // Use "apply" method to pass actual context 
            return self.getDataByPos(dsID, pos);
        },
        
        getDataByPos: function(dsID, pos) {
            var self = this,
                ds = self._datasets[dsID],
                posArray=0;
            
            if (ds === undefined) {
                return false; // TODO: Ver como devolver estos errores
            }
            

            posArray = self._transformPosToPosArrays[dsID].apply(self, [pos]); // Use "apply" method to pass actual context
            return { "value" : ds.data.observation[posArray] };
        },
        
        _createMult: function(dsID) {
            var self = this,
                ds = self._datasets[dsID],
                m = [],
                mult = 1,
                n = ds.data.format[1],
                dims = n.length;

            for ( var i = 0; i < dims; i++) {
                if (i > 0) {
                    mult *= n[(dims - i)];
                } else {
                    mult *= 1;
                }
                m.push(mult);
            }
            self._mult[dsID] = m;
        },
        
        _setUpTransformIdToPos: function(dsID) {
            var self = this,
                body = "",
                ds = self._datasets[dsID],
                dims = ds.data.format[0].length ;
            
            body += "var ds = this._datasets['"+ dsID + "'], pos = [];\n";
            for (var i=0; i < dims; i++) {
                body += "pos.push(ds.data.dimension[ds.data.format[0]["+i+"]].representationIndex[id["+i+"]]);\n";
            }
            body += "return pos"; 
            
            // Creating the function
            self._transformIdToPos[dsID] = new Function("id", body);
        },
        
        _setUpTransformPosToPosArray: function(dsID) {
            var self = this,
                body = "",
                ds = self._datasets[dsID],
                mult = self._mult[dsID],
                dims = ds.data.format[0].length;

            body += "var ds = this._datasets['"+ dsID + "'], res = 0;\n";
            body += "res = ";
            for (var i=0; i < dims; i++) {
                body += mult[i] + "*pos[" + (dims-i-1) + "]";
                if (i < dims - 1) {
                    body += " + ";
                }
            }
            body += ";\n";
            body += "return res;"; 
            
            // Creating the function
            self._transformPosToPosArrays[dsID] = new Function("pos", body);
        },
    };

    return constructor;
})();