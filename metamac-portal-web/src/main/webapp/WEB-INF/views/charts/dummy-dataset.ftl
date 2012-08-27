[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<div id="content-right">
    <h3>Gráfica de prueba</h3>
</div>


<script type="text/javascript" src="[@spring.url "/theme/js/Dataset.js"/]" ></script>
<script type="text/javascript" src="[@spring.url "/theme/js/Dimension.js"/]" ></script>
<script type="text/javascript" src="[@spring.url "/theme/js/Category.js"/]" ></script>
<script type="text/javascript" src="[@spring.url "/theme/js/DatasetManager.js"/]" ></script>

<script type="text/javascript">
function prueba() {
    var dataset = new Dataset();
    
    var dimension1 = new Dimension();
        dimension1.label = "Ciudad";
    
        var category1 = new Category();
            category1.label = "La Laguna";
        var category2 = new Category();
            category2.label = "Candelaria";
        var category3 = new Category();
            category3.label = "Santa Cruz";
            
        var categories = new Array();
        categories["LL"] = category1;
        categories["CA"] = category2;
        categories["SC"] = category3; 
            
        dimension1.categories = categories;
    
    
    var dimension2 = new Dimension();
        dimension2.label = "Sexo";
    
        var category1 = new Category();
            category1.label = "Masculino";
        var category2 = new Category();
            category2.label = "Femenino";
            
        var categories = new Array();
        categories["MA"] = category1;
        categories["FE"] = category2;
            
        dimension2.categories = categories;


    var dimensions = new Array();
    dimensions["CIU"] = dimension1
    dimensions["SEX"] = dimension2;

    dataset.dimensions = dimensions;
    

    var json = {"id":"DS_9840", "label":"Paro por municipios, sexos y edades", "dimensions":
                  {"CIU": {"label":"Ciudades", "index": 0, "categories":
                                {"LL": {"label": "La Laguna", "index": 0},
                                 "CA": {"label": "Candelaria", "index": 1},
                                 "SC": {"label": "Santa Cruz", "index": 2}}
                          },
                   "SEX": {"label":"Sexos", "index": 1, "categories":
                                {"MA": {"label":"Masculino", "index": 0},
                                 "FE": {"label": "Femenino", "index": 1}}
                          }
                  }
               }

    var objectDataset = json;
    
    
    var json = {"data": [100, 96, 30, 41, 203, 186],
                "dimension": {"id": ["CIU", "SEX"],
                    "size": [3, 2],
                    "CIU": {"categories": {"LL": 0, "CA": 1, "SC": 2}},
                    "SEX": {"categories": {"MA": 0, "FE": 1}}
                }
               }
    
    var objectData = json;
    
    // Tests
    var masculino = objectDataset.dimensions["SEX"].categories["MA"].label;
    
    // Creating the manager
    var manager = new DatasetManager();
    manager.dataset = objectDataset;
    manager.data = objectData;
    
    manager.setUpWhichElementIs();
    
    var num_elemento = manager.getWhichElementIs([2,1]);
    var sc_fe_186 = manager.data.data[num_elemento];
    var prueba3 = "fin";
}

prueba();
   

</script>

<div id="container" style="width: 100%; height: 400px"></div>


[/@template.base]