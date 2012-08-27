
var ALPHA_MAX_DIM1 = 10;
var ALPHA_MAX_DIM2 = 3;

function transformingToHighCharts() {
    /* We could have received more than one dataset so
     * we have to take only the first one */
    var datasetsIds = datasetManager.getDatasets();
    var datasetId = datasetsIds[0];
    var selectedLanguages = datasetManager.getSelectedLanguages();
    var language = selectedLanguages[0];
    var dimensions = datasetManager.getDimensions(datasetId, language);
    

    // Creating all the lists
    var categories2nd = datasetManager.getRepresentations(datasetId, dimensions.id[1], language);
    var listSeries = new Array();
    //for(var i=0; i<categories2nd.id.length; i++) {
    // Adding a restriction to truncate for ALPHA VERSION --------------------------
    var i = 0;
    while (i <categories2nd.id.length && i < ALPHA_MAX_DIM2) {
        var  tempSerie = new Array();
        tempSerie.data = new Array();
        tempSerie.name = "";
        listSeries.push(tempSerie);
        i++;
    }


    
    // Double nesting to obtain things like: data.dimension.("CIU").categories
    var order1, order2
    /* Ojo: esto no está del todo desacoplado de la estructura */
    var categories1st = datasetManager.getRepresentations(datasetId, dimensions.id[0], language);
    //for(var i=0; i<categories2nd.id.length; i++) {
    // Adding a restriction to truncate for ALPHA VERSION --------------------------
    var i = 0;
    while (i <categories2nd.id.length && i < ALPHA_MAX_DIM2) {
        var label1 = categories2nd.label[i];
        //for(var j=0; j<categories1st.id.length; j++) {
        // Adding a restriction to truncate for ALPHA VERSION --------------------------
        var j=0;
        while (j<categories1st.id.length && j < ALPHA_MAX_DIM1) {
            var elemento = datasetManager.getDataByPos(datasetId, [j,i]);
            // We need to insert in order (I'm getting the index of each category)
            listSeries[i].data[j] = parseFloat(elemento.value);
            j++
        }
        // setting the name of the serie
        listSeries[i].name = categories2nd.label[i];
        i++;
    }
    
    /* General settings */
    var title = datasetManager.getTitle();
    var publisher = datasetManager.getPublisher();
    var xaxis = [];
    //for(var j=0; j<categories1st.id.length; j++)
    // Adding a restriction to truncate for ALPHA VERSION --------------------------
    var j=0;
    while (j<categories1st.id.length && j < ALPHA_MAX_DIM1) {
    	xaxis.push(categories1st.label[j]);
    	j++;
    }
    
    /* Columns chart */
    optionsC6.series = listSeries;
    optionsC6.title.text = title;
    optionsC6.subtitle.text = publisher;
    optionsC6.xAxis.categories = xaxis;
    chart6 = new Highcharts.Chart(optionsC6);

    /* Bar chart */
    optionsC7.series = listSeries;
    optionsC7.title.text = title;
    optionsC7.subtitle.text = publisher;
    optionsC7.xAxis.categories = xaxis;
    chart7 = new Highcharts.Chart(optionsC7);
    
    /* Line chart */
    optionsC9.series = listSeries;
    optionsC9.title.text = title;
    optionsC9.subtitle.text = publisher;
    optionsC9.xAxis.categories = xaxis;
    chart9 = new Highcharts.Chart(optionsC9);
    
}



function transformingToHighChartsPie() {
    /* We could have received more than one dataset so
     * we have to take only the first one */
    var datasetsIds = datasetManager.getDatasets();
    var datasetId = datasetsIds[0];
    var selectedLanguages = datasetManager.getSelectedLanguages();
    var language = selectedLanguages[0];
    var dimensions = datasetManager.getDimensions(datasetId, language);
    
    
    var numElements = optionsC8.series[0].data.length;
    for (var i=0; i<numElements; i++)
        optionsC8.series[0].data[0].remove(false);
    
    // Double nesting to obtain things like: data.dimension.("CIU").categories
    var i = 0; // Dimension 1 fixed
    var j = 0;
    var num_elemento;
    
    // It's not neccesary to calculate the total. Highcharts does it for us
    var categories1st = datasetManager.getRepresentations(datasetId, dimensions.id[0], language);
    var j = 0;
    //for(var j=0; j<categories1st.id.length; j++) {
    //Adding a restriction to truncate for ALPHA VERSION --------------------------
	while (j<categories1st.id.length && j < 10) {
    	var elemento = datasetManager.getDataByPos(datasetId, [j,i]);
        var temp = {};
        temp.name = categories1st.label[j];;
//        temp.y = parseFloat(elemento.value) * 100 / total;
        temp.y = parseFloat(elemento.value);
        optionsC8.series[0].addPoint(temp);
        j++;
    }

    var categories2nd = datasetManager.getRepresentations(datasetId, dimensions.id[1], language);
    optionsC8.setTitle({ text: datasetManager.getTitle() + ' Para: ' + categories2nd.label[0] + '.' }, { text: datasetManager.getPublisher() });
}

