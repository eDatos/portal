/* 

JSON-stat Javascript Toolkit v. 0.2.1
http://json-stat.org
http://code.google.com/p/json-stat/

Copyright 2012 Xavier Badosa (http://xavierbadosa.com)

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 
You may obtain a copy of the License at 

	http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express 
or implied. See the License for the specific language governing 
permissions and limitations under the License. 

*/

var JSONstat = JSONstat || {};

(function(){
	function response(o){
		this.length=0;
		this.id=[];
		if (o.error || typeof o=="undefined"){
			this.error=true;
			return;
		}
		this.error=true;
		var type=o.type||"root";
		switch(type){
			case "root" :
				this.type="root";
				var i=[];
				if (typeof o=="object"){
					var a=0, ds=0;
					for (var prop in o){
						ds++;
						if (isArray(o[prop].value)){//isArray() works even if value not defined
							a++;
						}
						// e.push(o[prop]);
						i.push(prop);
						//l.push(o[prop].label||"");//or null?

					}
					if (a>0 && a==ds){
						this._tree=o;
						this.length=ds;
						this.error=false;
						this.id=i; //"object" : e,
					}
				}
			break;
			case "ds" :
				this.type="ds";
				if (!("_tree" in o)){
					this.error=true;
					return;
				}
				this._tree=o._tree;
				this.error=false;
				this.label=o.label;
				this.value=o._tree.value;
				// if dimensions are defined, id and size arrays are required and must have equal length
				if ("dimension" in o._tree){
					if (
						!(isArray(o._tree.dimension.id)) || 
						!(isArray(o._tree.dimension.size)) ||
						o._tree.dimension.id.length!=o._tree.dimension.size.length
						){
						this.error=true;
						return;
					}
					this.length=o._tree.dimension.size.length;
					this.id=o._tree.dimension.id;
				}else{
					this.length=0;
				}
			break;
			case "dim" :
				this.type="dim";
				if (
					!("_tree" in o) ||
					!("category" in o._tree) || //Already tested in the Dimension() / Catgeory() ? function
					!("index" in o._tree.category) ||
					!("label" in o._tree.category)
					){
					this.error=true;
					return;
				}
				var cats=[];
				//If there are IDs in labels that are not in index, they will be ignored
				for (var prop in o._tree.category.index){
					if (!(prop in o._tree.category.label)){
						this.error=true;
						return;
					}
					cats.push(prop);
				}
				this._tree=o._tree;
				this.label=o.label;
				this.error=false;
				this.id=cats;
				this.length=cats.length;
			break;
			case "cat" :
				this.type="cat";
				this.length=0;
				this.id=o.id; //unneeded: just to have id length and label everywhere
				this.error=false;
				this.index=o.index;
				this.label=o.label;
				this._tree=o._tree;
		}
	}

	response.prototype.Dataset=function(ds){
		if (this.error || typeof this._tree[ds]=="undefined"){
			return new response({"error" : true});
		}else{
			return new response({"_tree": this._tree[ds], "label" : this._tree[ds].label, "error" : false, "type" : "ds"});
		}
	}

	response.prototype.Dimension=function(dim){
		if (this.error || typeof this._tree.dimension=="undefined"){
			return new response({"error" : true});
		}
		return new response({"_tree": this._tree.dimension[dim], "label" : this._tree.dimension[dim].label, "error" : false, "type" : "dim"});
	}

	response.prototype.Category=function(cat){
		if (this.error || typeof this._tree.category=="undefined"){
			return new response({"error" : true});
		}
		if (typeof cat!="undefined"){
			return new response({"index": this._tree.category.index[cat], "label": this._tree.category.label[cat], "error" : false, "_tree" : null, "type" : "cat", "id" : cat});
		}
		return new response({"_tree": this._tree.category, "label" : null, "index": null, "error" : false, "type" : "cat"});
	}

	response.prototype.getDimensions=function(ds){
		var l=[], d=this._tree[ds].dimension;
		if (d.id.length!=d.size.length){
			return false;
		}
		for (var i=0; i<d.id.length; i++){
			l.push(d[d.id[i]].label);
		}
		return {'id' : this._tree[ds].dimension.id, 'label': l};
	}

	//returns an object with arrays, no response, no tree
	response.prototype.getData=function(ds){
		return {'value' : this._tree[ds].value, 'label': this._tree[ds].label, 'status': this._tree[ds].status, "length" : this._tree[ds].value.length}; //status a l'exemple en blanc
	}

	response.prototype.getCategories=function(ds,dim){
		var i=-1, ids=[], l=[], d=this._tree[ds].dimension;
		for (var e=0; e<d.id.length; e++){
			if (dim==d.id[e]){
				i=e;
				break;
			}
		}
		if (i==-1){
			return false;
		}
		for (var prop in d[d.id[i]].category.index){
			ids[d[d.id[i]].category.index[prop]]=prop;
		}
		for (var j=0; j<ids.length; j++){
			l[j]=d[d.id[i]].category.label[ids[j]];
		}
		return {'id' : ids, 'label': l};
	}

	// j.getDataById("sex*age*ter",{"sex" : "M", "age" : "A", "ter": "B"}).value -> value or undefined
	response.prototype.getDataById=function(ds, obj){
		function dimObj2Array(thisds, obj){
			var a=[];
			for (var d=0; d<thisds.dimension.id.length; d++){
				a.push(obj[thisds.dimension.id[d]]);
			}
			return a;
		}
		if (this._tree[ds].value.length==1){
			return this._tree[ds].value[0];
		}
		var id=dimObj2Array(this._tree[ds], obj);
		var pos=[];
		for(var i=0; i<id.length; i++){
			pos.push(this._tree[ds].dimension[this._tree[ds].dimension.id[i]].category.index[id[i]]);
		}
		return this.getValueByPosition(ds,pos);
	}

	// j.getValueByPosition("sex*age*ter",[1,2,1]) -> value or undefined
	//pending validations
	response.prototype.getValueByPosition=function(ds, pos){
		var n=this._tree[ds].dimension.size,
			  dims=n.length,
			  mult=1,
			  m=[],
			  res=0;
		for(var i=0; i<dims; i++){
			if (i>0){
				mult*=n[(dims-i)];
			}else{
				mult*=1;
			}
			m.push(mult);
		}
		for(var i=0; i<dims; i++){
			res+=m[i]*pos[dims-i-1];
		}
		return {"value" : this._tree[ds].value[res] };//pending afegir status etc...
	}

	// Returns the category label element of the specified dataset/dimension
	// Useful? Dunno yet
	// Use: j.Category({"dataset": "sex*age*ter", "dimension" : "age"})
	// Input format? Benefits? Only if a method returns this format...
	response.prototype.getCategoryLabels=function(ds,dim){
		//Last condition shouldn't be necessary but constructor does not check it because dimensions are not a must: let's play safe and test if category exists: if label doesn't it will return undefined
		if (typeof this._tree[ds]!="undefined" && typeof this._tree[ds].dimension[dim]!="undefined" && typeof this._tree[ds].dimension[dim].category!="undefined"){
			return (this._tree[ds].dimension[dim].category.label);
		}
		return {"error": true};
	}
	function isArray(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	}

	response.prototype.node=function(){
		return this._tree;
	}

	response.prototype.toString=function(){
		return this.type;
	}
	response.prototype.toValue=function(){
		return this.length;
	}

	JSONstat.response=response;
})();