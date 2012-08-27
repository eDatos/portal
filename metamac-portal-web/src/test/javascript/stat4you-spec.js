describe("stat4you", function() {

	it("can define namespace", function() {
		var result = STAT4YOU.namespace("STAT4YOU.a.b.c");
		expect(STAT4YOU.a.b.c).toBeDefined();
		expect(STAT4YOU.a.b.c).toBe(result);
	});

	it("return null when define null namespace", function() {
		var result = STAT4YOU.namespace(null);
		expect(result).toBeNull();
	});

});