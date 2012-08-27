describe("ajax mock test", function(){
	
	it("fake response", function(){
		spyOn($, "ajax").andCallFake(function (params) {
			params.success(TestResponses.dataset.sucess);
		});
		
		var callback = jasmine.createSpy();
		$.get('/dataset', callback);
		
		expect(callback).toHaveBeenCalled();
	});
	
});