describe("stat4you-dataset", function() {

	it("decode example dataset", function() {
		var dataSet = new STAT4YOU.Dataset();
		
		dataSet.setStructure($.parseJSON(TestResponses.dataset.success));
		dataSet.setData($.parseJSON(TestResponses.dataset.success));
		
		var languages = dataSet.getSelectedLanguages();
		expect(languages).toEqual(["es"]);
		
		var dimensions = dataSet.getDimensions(languages[0]);
		expect(dataSet.getTitle()).toEqual("Índice de satisfacción de los turistas jugadores de golf según conceptos períodos.");
		expect(dimensions.id).toEqual(["CARACTERISTICAS_CAMPOS_GOLF", "PERIODOS"]);
		expect(dimensions.label).toEqual(["Características de los campos de golf", "Períodos"]);
	});

});