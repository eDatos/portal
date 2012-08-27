describe("jasmine-jquery testing", function(){
	
	it("loading simple fixture", function(){
		setFixtures('<div id="test"></div>');
		expect($('#test').text()).toEqual("");
		
		var msg = "Hello World!"
		$('#test').text(msg);
		expect($('#test').text()).toEqual(msg);
	});
	
});