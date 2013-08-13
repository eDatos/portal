describe('CollectionModel', function () {

    it('should initialize correctly from server response', function () {
        var response = App.test.response.collection;

        var collection = new App.modules.collection.Collection(response, { parse : true });
        expect(collection.get('name')).to.equal("Colección 1");
        expect(collection.get('description')).to.equal("Descripcion 1");
        expect(collection.nodes).to.have.length(2);

        var capitulo1 = collection.nodes.at(0);


        expect(capitulo1.get('name')).to.equal("Capítulo 1");
        expect(capitulo1.get('description')).to.equal("Descripción Capítulo 1");
        expect(capitulo1.nodes).to.have.length(1);
        var query = capitulo1.nodes.at(0);

        expect(query.get('name')).to.equal("Cube 2 query fixed");
        expect(query.get('type')).to.equal("query");
        expect(query.get('agency')).to.equal("ISTAC");
        expect(query.get('identifier')).to.equal("QueryFixed");
        expect(query.get('url')).to.equal("/queries/ISTAC/QueryFixed");
        expect(query.get('numeration')).to.equal("01.01");

        var capitulo2 = collection.nodes.at(1);
        expect(capitulo2.nodes).to.have.length(2);

        var dataset = capitulo2.nodes.at(1).nodes.at(0);
        expect(dataset.get('name')).to.equal("Cube 1 dataset");
        expect(dataset.get('type')).to.equal("dataset");
        expect(dataset.get('agency')).to.equal("ISTAC");
        expect(dataset.get('identifier')).to.equal("E30308A_000001");
        expect(dataset.get('version')).to.equal("001.000");
        expect(dataset.get('url')).to.equal("/datasets/ISTAC/E30308A_000001/001.000");
        expect(dataset.get('numeration')).to.equal("02.02.01");

    });

});