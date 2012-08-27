function Serie(name, values) {
	this.name = name;
	this.values = values;
	    
    this.getName = function getName() {
        return name;
    };
    
    this.setName = function setName(name) {
        this.name = name;
    };
    
    this.getValues = function getValues() {
        return values;
    };
    
    this.setValues = function setValues(values) {
        this.values = values;
    };
}
