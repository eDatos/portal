describe("Testing Mocks", function(){
	
	it("simple mock", function(){
		var MyClass = {method: function(){return 'original';}};
		
		spyOn(MyClass, "method").andCallFake(function(){
			return "fake";
		});
		
		expect(MyClass.method()).toEqual("fake");
	});
	
});