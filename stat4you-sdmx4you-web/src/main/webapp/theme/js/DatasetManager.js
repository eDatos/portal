function DatasetManager() {
	// ** Attributes **
//    var dataset = {"id":"DS_9840", "label":"Paro por municipios, sexos y edades", "dimensions":
//	    	{"CIU": {"label":"Ciudades", "index": 0, "categories":
//	                  	{"LL": {"label": "La Laguna", "index": 0},
//	                   	"CA": {"label": "Candelaria", "index": 1},
//	                   	"SC": {"label": "Santa Cruz", "index": 2}}
//	            	},
//	     	"SEX": {"label":"Sexos", "index": 1, "categories":
//	                  	{"MA": {"label":"Masculino", "index": 0},
//	                   	"FE": {"label": "Femenino", "index": 1}}
//	            	}
//	    	}
//	 }
	this.dataset;
//    var data = {"data": [100, 96, 30, 41, 203, 186],
//	    		  "dimension": {"id": ["CIU", "SEX"],
//	    		      "size": [3, 2],
//	    		      "CIU": {"categories": {"LL": 0, "CA": 1, "SC": 2}},
//	    		      "SEX": {"categories": {"MA": 0, "FE": 1}}
//	    		  }
//	    		 }
    this.data;
    // This function is created dinamically
    // Receives as parameters the positions to find, equivalent to ["LL", "M"]
    // Returns the position of the observation within the data
    this.getWhichElementIs;

    
	// ** Methods **
    // - Dataset -
	this.getDimensionsDS  = function getDimensionsDS() {
		//return dataset.dimensiones.
		return 1;
	};
	
	this.getCategoriesDS  = function getCategoriesDS(dimensionCode) {
		return 1;		
	};
	
	this.getDimensionwithCategoriesDS  = function getDimensionwithCategoriesDS() {
		return 1;
	};
	
	// - Data -
	this.setUpWhichElementIs  = function setUpWhichElementIs() {
		var tempAritmethic = "";
		
		
		for (var i=0; i<this.data.dimension.id.length; i++) {
			var temp = "";
			for (var j=i+1; j<this.data.dimension.id.length; j++) {
				temp += "this.data.dimension.size["+j+"]*";
			}
			if (i+1<this.data.dimension.id.length)
				tempAritmethic += temp+"positions["+i+"]+";
			else
				tempAritmethic += temp+"positions["+i+"]";
		}
		
		// Creating the function
		var string = "return "+tempAritmethic+";";
		this.getWhichElementIs = new Function("positions", string);
		
		return 1;
	};
}