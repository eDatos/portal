this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["collection/collection"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<p>";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n";
  return buffer;
  }

  buffer += "<h3>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.description, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n<div class=\"collection-nodes\">\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["collection/collectionNode"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    ";
  if (stack1 = helpers.numeration) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.numeration; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " - <a href=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\r\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <p>";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n";
  return buffer;
  }

  buffer += "<p>\r\n";
  stack1 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</p>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.description, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n<ul></ul>";
  return buffer;
  });

this["Handlebars"]["templates"]["components/modal/modal"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<div class=\"modal-backdrop\"></div>\r\n<div class=\"modal\">\r\n    <div class=\"modal-header\">\r\n        <button class=\"modal-close\" title='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.close", options) : helperMissing.call(depth0, "message", "filter.button.close", options)))
    + "'>×</button>\r\n    	<h2>";
  if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.title; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</h2>\r\n    </div>\r\n    <div class=\"modal-content\">\r\n        Contenido\r\n    </div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["components/searchbar/searchbar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"searchbar\">\r\n    <input type=\"text\" value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n    <div class=\"searchbar-icon-search\"></div>\r\n    <a href=\"#\" class=\"searchbar-clear\">\r\n        <i class=\"searchbar-icon-clear\"></i>\r\n    </a>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["components/select/select"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "multiple";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <option value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, depth0.selected, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n    ";
  return buffer;
  }
function program4(depth0,data) {
  
  
  return "selected";
  }

  buffer += "<select name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, depth0.multiple, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\r\n    ";
  stack1 = helpers.each.call(depth0, depth0.options, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</select>";
  return buffer;
  });

this["Handlebars"]["templates"]["components/sidebar/sidebar-container"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<div class=\"sidebar-menu\">\r\n    <ul>\r\n        ";
  stack1 = helpers.each.call(depth0, depth0.menuItems, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </ul>\r\n</div>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <li class=\"sidebar-menu-item\" data-view-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"><a href=\"#\"><i class=\"";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></i>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></li>\r\n        ";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.menu, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n<div class=\"sidebar-sidebar ";
  if (stack1 = helpers.menuClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.menuClass; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n    <div class=\"sidebar-sidebar-content\"></div>\r\n    <div class=\"sidebar-splitter\">\r\n        <i class=\"icon-separator\"></i>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"sidebar-content ";
  if (stack1 = helpers.menuClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.menuClass; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-actions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        ";
  stack1 = helpers['if'].call(depth0, depth0.isFavourite, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "\r\n            <a class=\"btn favourite\" rel=\"tooltip\" title=\"Desmarcar como favorito\"><i class=\"icon-star\"></i> Favorito</a>\r\n        ";
  }

function program4(depth0,data) {
  
  
  return "\r\n            <a class=\"btn favourite\" rel=\"tooltip\" title=\"Marcar como favorito\"><i class=\"icon-star-empty\"></i> Favorito</a>\r\n        ";
  }

function program6(depth0,data) {
  
  
  return "\r\n        <a class=\"btn favourite\" rel=\"tooltip\" title=\"Accede con tu usuario\"><i class=\"icon-star-empty\"></i> Favorito</a>\r\n    ";
  }

  buffer += "<div class=\"dataset-headers-actions-buttons\">\r\n\r\n    <a class=\"btn share\" rel=\"tooltip\" title=\"Compartir\"><i class=\"icon-share\"></i> Compartir</a>\r\n\r\n    ";
  stack1 = helpers['if'].call(depth0, depth0.user, {hash:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n</div>\r\n\r\n<div class=\"modal hide\" id=\"shareDatasetModel\">\r\n    <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\">×</button>\r\n        <h3>Compartir</h3>\r\n    </div>\r\n    <div class=\"modal-body\">\r\n    </div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-dimensions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <div class=\"order-sidebar-zone ";
  stack1 = helpers['if'].call(depth0, depth0.draggable, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, depth0.isFixed, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" data-zone=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n        \r\n        <h2><i class=\"";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></i> ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>       \r\n\r\n        <div class=\"order-sidebar-dimensions\">\r\n            ";
  stack1 = helpers.each.call(depth0, depth0.dimensions, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n        </div>\r\n    </div>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "draggable";
  }

function program4(depth0,data) {
  
  
  return "fixed";
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                <a href=\"#\" class=\"order-sidebar-dimension ";
  stack1 = helpers['if'].call(depth0, depth0.draggable, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" ";
  stack1 = helpers['if'].call(depth0, depth0.draggable, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " data-dimension-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" \r\n                title=\"";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  stack1 = helpers['if'].call(depth0, depth0.selectedCategory, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\r\n                    ";
  stack1 = helpers['if'].call(depth0, depth0.selectedCategory, {hash:{},inverse:self.program(13, program13, data),fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n                </a>\r\n            ";
  return buffer;
  }
function program7(depth0,data) {
  
  
  return "draggable=\"true\"";
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " - "
    + escapeExpression(((stack1 = ((stack1 = depth0.selectedCategory),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                        ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n                        <div class=\"fixed-dimension-selected-category\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.selectedCategory),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n                    ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                        ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n                    ";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.zones, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["dataset/dataset-download"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "	\r\n	<form method=\"POST\" action=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.url),stack1 == null || stack1 === false ? stack1 : stack1.excel)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_parent\">\r\n		<input type=\"hidden\" name=\"jsonBody\" value=\"";
  if (stack2 = helpers.selection) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.selection; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n		<a href=\"#\" class=\"download-xls\"><i class=\"icon-data-xls\"></i></a>\r\n	</form>\r\n\r\n	<form method=\"POST\" action=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.url),stack1 == null || stack1 === false ? stack1 : stack1.tsv)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_parent\">		\r\n		<input type=\"hidden\" name=\"jsonBody\" value=\"";
  if (stack2 = helpers.selection) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.selection; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n		<a href=\"#\" class=\"download-tsv\"><i class=\"icon-data-tsv\"></i></a>\r\n	</form>\r\n\r\n	<form method=\"POST\" action=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.url),stack1 == null || stack1 === false ? stack1 : stack1.px)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_parent\">\r\n		<input type=\"hidden\" name=\"jsonBody\" value=\"";
  if (stack2 = helpers.selection) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.selection; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n	<a href=\"#\" class=\"download-csv\"><i class=\"icon-px\"></i></a>\r\n	</form>\r\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n	<form method=\"POST\" action=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.url),stack1 == null || stack1 === false ? stack1 : stack1.png)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_parent\">\r\n		<input type=\"hidden\" name=\"svg\" value=\"";
  if (stack2 = helpers.svg) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.svg; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n		<a href=\"#\" class=\"download-png\"><i class=\"icon-"
    + escapeExpression(((stack1 = ((stack1 = depth0.buttonConfig),stack1 == null || stack1 === false ? stack1 : stack1.iconPreffix)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-png\"></i></a>\r\n	</form>\r\n\r\n	<form method=\"POST\" action=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.url),stack1 == null || stack1 === false ? stack1 : stack1.pdf)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_parent\">\r\n		<input type=\"hidden\" name=\"svg\" value=\"";
  if (stack2 = helpers.svg) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.svg; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n		<a href=\"#\" class=\"download-pdf\"><i class=\"icon-"
    + escapeExpression(((stack1 = ((stack1 = depth0.buttonConfig),stack1 == null || stack1 === false ? stack1 : stack1.iconPreffix)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-pdf\"></i></a>\r\n	</form>\r\n	\r\n	<form method=\"POST\" action=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.url),stack1 == null || stack1 === false ? stack1 : stack1.svg)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_parent\">\r\n		<input type=\"hidden\" name=\"svg\" value=\"";
  if (stack2 = helpers.svg) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.svg; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n		<a href=\"#\" class=\"download-svg\"><i class=\"icon-"
    + escapeExpression(((stack1 = ((stack1 = depth0.buttonConfig),stack1 == null || stack1 === false ? stack1 : stack1.iconPreffix)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-svg\"></i></a>\r\n	</form>\r\n";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n<div class=\"dataset-download-group\">\r\n	<h3>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.download.all", options) : helperMissing.call(depth0, "message", "filter.download.all", options)))
    + "</h3>\r\n<!-- 	<form method=\"POST\" action=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.url),stack1 == null || stack1 === false ? stack1 : stack1.excel)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_parent\">\r\n    	<input type=\"hidden\" name=\"jsonBody\" value=\"";
  if (stack2 = helpers.emptySelection) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.emptySelection; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n    	<a href=\"#\" class=\"download-xls\"><i class=\"icon-data-xls\"></i></a>\r\n	</form> -->\r\n\r\n	<form method=\"POST\" action=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.url),stack1 == null || stack1 === false ? stack1 : stack1.tsv)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_parent\">\r\n	    <input type=\"hidden\" name=\"jsonBody\" value=\"";
  if (stack2 = helpers.emptySelection) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.emptySelection; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n	     <a href=\"#\" class=\"download-tsv\"><i class=\"icon-data-tsv\"></i></a>\r\n	</form>\r\n\r\n	<form method=\"POST\" action=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.url),stack1 == null || stack1 === false ? stack1 : stack1.px)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_parent\">\r\n	    <input type=\"hidden\" name=\"jsonBody\" value=\"";
  if (stack2 = helpers.emptySelection) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.emptySelection; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n	     <a href=\"#\" class=\"download-csv\"><i class=\"icon-px\"></i></a>\r\n	</form>\r\n</div>\r\n";
  return buffer;
  }

  buffer += "<div class=\"dataset-download-group\">\r\n	<h3>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.download.selection", options) : helperMissing.call(depth0, "message", "filter.download.selection", options)))
    + "</h3>\r\n\r\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.buttonConfig),stack1 == null || stack1 === false ? stack1 : stack1.dataFormats), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "	\r\n\r\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.buttonConfig),stack1 == null || stack1 === false ? stack1 : stack1.imageFormats), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n</div>\r\n\r\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.buttonConfig),stack1 == null || stack1 === false ? stack1 : stack1.dataFormats), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-embed"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<div class=\"dataset-embed\">\r\n    <strong>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.embed.instructions", options) : helperMissing.call(depth0, "message", "filter.embed.instructions", options)))
    + "</strong>\r\n    <textarea class=\"campo_texto\" readonly=\"readonly\">\r\n<div id=\"";
  if (stack2 = helpers.defaultId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.defaultId; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"></div>\r\n<script src=\"";
  if (stack2 = helpers.widgetUrl) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.widgetUrl; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"></script>\r\n<script>datasetWidget({ \r\n	id : \"";
  if (stack2 = helpers.defaultId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.defaultId; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\", \r\n	width: ";
  if (stack2 = helpers.defaultWidth) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.defaultWidth; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ", \r\n	height: ";
  if (stack2 = helpers.defaultHeight) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.defaultHeight; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ", \r\n	params : \"";
  if (stack2 = helpers.params) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.params; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\",\r\n	sharedVisualizerUrl : \"";
  if (stack2 = helpers.sharedVisualizerUrl) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.sharedVisualizerUrl; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"\r\n})</script>\r\n    </textarea>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-export"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  
  return "\r\n<div class=\"btn-group dropup pull-right\">\r\n    <button class=\"btn btn-large btn-primary export-png\">Exportar gráfica (GRATIS)</button>\r\n    <button class=\"btn btn-large btn-primary dropdown-toggle\" data-toggle=\"dropdown\">\r\n        <span class=\"caret\"></span>\r\n    </button>\r\n    <ul class=\"dropdown-menu  pull-right\">\r\n        <li><a class=\"export-png\" href=\"#\">PNG</a></li>\r\n        <li><a class=\"export-pdf\" href=\"#\">PDF</a></li>\r\n        <li><a class=\"export-svg\" href=\"#\">SVG</a></li>\r\n    </ul>\r\n</div>\r\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.exportIsAllowed, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["dataset/dataset-help"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  options = {hash:{},data:data};
  return escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.sidebar.help.body", options) : helperMissing.call(depth0, "message", "filter.sidebar.help.body", options)));
  });

this["Handlebars"]["templates"]["dataset/dataset-info"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n<div class=\"field\">\r\n    <div class=\"metadata-title\">\r\n        <div>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.dataset.measureDimension", options) : helperMissing.call(depth0, "message", "entity.dataset.measureDimension", options)))
    + "</div>\r\n    </div>\r\n    <div class=\"metadata-value\">\r\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  stack2 = ((stack1 = helpers.join || depth0.join),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.measureDimension)),stack1 == null || stack1 === false ? stack1 : stack1.representation), options) : helperMissing.call(depth0, "join", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.measureDimension)),stack1 == null || stack1 === false ? stack1 : stack1.representation), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n</div>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n        ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n<div class=\"field\">\r\n    <div class=\"metadata-title\">\r\n        <div>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.dataset.dimensions.title", options) : helperMissing.call(depth0, "message", "entity.dataset.dimensions.title", options)))
    + "</div>\r\n    </div>\r\n    <div class=\"metadata-value\">\r\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  stack2 = ((stack1 = helpers.join || depth0.join),stack1 ? stack1.call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dimensions), options) : helperMissing.call(depth0, "join", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dimensions), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n</div>\r\n";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n<div class=\"field\">\r\n    <div class=\"metadata-title\">\r\n        <div>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.dataset.datasetAttributes", options) : helperMissing.call(depth0, "message", "entity.dataset.datasetAttributes", options)))
    + "</div>\r\n    </div>\r\n    <div class=\"metadata-value\">\r\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data};
  stack2 = ((stack1 = helpers.ulList || depth0.ulList),stack1 ? stack1.call(depth0, depth0.datasetAttributes, options) : helperMissing.call(depth0, "ulList", depth0.datasetAttributes, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n</div>\r\n";
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, depth0.name, depth0.value, "resource", false, options) : helperMissing.call(depth0, "fieldOutput", depth0.name, depth0.value, "resource", false, options)))
    + "\r\n        ";
  return buffer;
  }

  buffer += "<div class=\"metadata-group\">\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.statisticalOperation", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.statisticalOperation), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.statisticalOperation", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.statisticalOperation), "resource", options)))
    + "\r\n\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.validFrom", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.validFrom), "date", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.validFrom", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.validFrom), "date", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.validTo", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.validTo), "date", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.validTo", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.validTo), "date", options)))
    + "\r\n\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.replacesVersion", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.replacesVersion), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.replacesVersion", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.replacesVersion), "resource", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.isReplacedByVersion", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.isReplacedByVersion), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.isReplacedByVersion", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.isReplacedByVersion), "resource", options)))
    + "\r\n\r\n\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.publishers", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.publishers), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.publishers", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.publishers), "resource", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.contributors", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.contributors), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.contributors", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.contributors), "resource", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.mediators", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.mediators), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.mediators", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.mediators), "resource", options)))
    + "\r\n\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.replaces", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.replaces), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.replaces", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.replaces), "resource", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.isReplacedBy", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.isReplacedBy), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.isReplacedBy", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.isReplacedBy), "resource", options)))
    + "\r\n\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.rightsHolder", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.rightsHolder), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.rightsHolder", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.rightsHolder), "resource", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.copyrightDate", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.copyrightDate), "text", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.copyrightDate", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.copyrightDate), "text", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.license", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.license), "text", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.license", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.license), "text", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.accessRights", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.accessRights), "text", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.accessRights", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.accessRights), "text", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.subjectAreas", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.subjectAreas), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.subjectAreas", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.subjectAreas), "resource", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.formatExtentObservations", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.formatExtentObservations), "text", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.formatExtentObservations", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.formatExtentObservations), "text", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.dateNextUpdate", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dateNextUpdate), "date", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.dateNextUpdate", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dateNextUpdate), "date", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.updateFrequency", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.updateFrequency), "resource", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.updateFrequency", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.updateFrequency), "resource", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.statisticOfficiality", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.statisticOfficiality), "text", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.statisticOfficiality", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.statisticOfficiality), "text", options)))
    + "\r\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.bibliographicCitation", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.bibliographicCitation), "text", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.bibliographicCitation", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.bibliographicCitation), "text", options)))
    + "\r\n\r\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.measureDimension)),stack1 == null || stack1 === false ? stack1 : stack1.representation), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dimensions), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n";
  stack2 = helpers['if'].call(depth0, depth0.datasetAttributes, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n</div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-options"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n        <button class=\"btn visual-element-options-embed\" title='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.embed", options) : helperMissing.call(depth0, "message", "filter.button.embed", options)))
    + "'><i class=\"dataset-options-embed\"></i></button>\r\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n        <button class=\"btn fs "
    + escapeExpression(((stack1 = ((stack1 = depth0.fullScreen),stack1 == null || stack1 === false ? stack1 : stack1.btnClass)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " visual-element-options-fs\" title='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.fullscreen", options) : helperMissing.call(depth0, "message", "filter.button.fullscreen", options)))
    + "'><i class=\"dataset-options-full-screen\"></i></button>\r\n    ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n<div class=\"dataset-options\">\r\n    <button class=\"btn dataset-options-filter "
    + escapeExpression(((stack1 = ((stack1 = depth0.filter),stack1 == null || stack1 === false ? stack1 : stack1.btnClass)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" title='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.sidebar.filter.title", options) : helperMissing.call(depth0, "message", "filter.sidebar.filter.title", options)))
    + "'><i class=\"options-filter\"></i></button>\r\n</div>\r\n";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<div class=\"change-visual-element\">\r\n    <div class=\"btn-group\" data-toggle=\"buttons-radio\">\r\n        ";
  stack1 = helpers.each.call(depth0, depth0.veTypeButton, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </div>\r\n</div>\r\n";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <button class=\"btn ";
  if (stack1 = helpers.btnClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.btnClass; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-type=\"";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" title=\"";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"><i class=\"dataset-options-type-";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></i></button>\r\n        ";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n<button class=\"btn btn-with-label selection-visualize-selection\" title='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.visualize", options) : helperMissing.call(depth0, "message", "filter.button.visualize", options)))
    + "'>\r\n	<i class=\"dataset-options-visualize\"></i>\r\n	<label>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.visualize", options) : helperMissing.call(depth0, "message", "filter.button.visualize", options)))
    + "</label>\r\n</button>\r\n";
  return buffer;
  }

  buffer += "<div class=\"visual-element-options\">\r\n    <button class=\"btn visual-element-options-download\" title='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.download", options) : helperMissing.call(depth0, "message", "filter.button.download", options)))
    + "'><i class=\"dataset-options-download\"></i></button>\r\n    <button class=\"btn visual-element-options-share\" title='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.share", options) : helperMissing.call(depth0, "message", "filter.button.share", options)))
    + "'><i class=\"dataset-options-share\"></i></button>\r\n    ";
  stack2 = helpers['if'].call(depth0, depth0.widgetButton, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.fullScreen),stack1 == null || stack1 === false ? stack1 : stack1.visible), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</div>\r\n\r\n";
  stack2 = helpers.unless.call(depth0, depth0.visualize, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n";
  stack2 = helpers.unless.call(depth0, depth0.widget, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n";
  stack2 = helpers['if'].call(depth0, depth0.visualize, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n\r\n\r\n\r\n";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-page"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"dataset-header\">\r\n        <div>\r\n\r\n            <div class=\"dataset-header-actions\"></div>\r\n\r\n            <div class=\"dataset-header-info\">\r\n                <h1 class=\"dataset-header-title\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\r\n\r\n                <p class=\"dataset-header-categories\">\r\n                    ";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  stack2 = ((stack1 = helpers.join || depth0.join),stack1 ? stack1.call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.categories), options) : helperMissing.call(depth0, "join", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.categories), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                </p>\r\n            </div>\r\n        </div>\r\n\r\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.description), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                    ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n                    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n            <div>\r\n                <p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.safeString || depth0.safeString),stack1 ? stack1.call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.description), options) : helperMissing.call(depth0, "safeString", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.description), options)))
    + "</p>\r\n            </div>\r\n        ";
  return buffer;
  }

function program6(depth0,data) {
  
  
  return "\r\n <div class=\"clearfix dataset-export\">\r\n\r\n</div>\r\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.showHeader, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n<div class=\"dataset-visualization-container\">\r\n    <div class=\"dataset-sidebar-visualization-container\">\r\n\r\n    </div>\r\n    <div class=\"dataset-visualization-options-bar\">\r\n\r\n    </div>\r\n</div>\r\n";
  stack1 = helpers.unless.call(depth0, depth0.isWidget, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-share"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<div class=\"dataset-share\">\r\n    <strong>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.share.permanent", options) : helperMissing.call(depth0, "message", "filter.share.permanent", options)))
    + "</strong>\r\n    <input type=\"text\" size=\"60\" class=\"campo_texto\" value=\"";
  if (stack2 = helpers.url) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.url; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n	<div class=\"addthis_toolbox dataset-share-icons\">\r\n		<div class=\"custom_images\">\r\n			<a class=\"addthis_button_twitter\"><span></span></a>\r\n			<a class=\"addthis_button_facebook\"><span></span></a>\r\n			<a class=\"addthis_button_google_plusone_share\"><span></span></a>\r\n			<a class=\"addthis_button_linkedin\"><span></span></a>\r\n			<a class=\"addthis_button_tuenti\"><span></span></a>\r\n			<a class=\"addthis_button_diigo\"><span></span></a>\r\n			<a class=\"addthis_button_meneame\" title=\"Menéame\"><span></span></a>\r\n			<a class=\"addthis_button_digg\"><span></span></a>\r\n			<a class=\"addthis_button_delicious\"><span></span></a>\r\n			<a class=\"addthis_button_google\"><span></span></a>\r\n			<a class=\"addthis_button_yahoobkm\"><span></span></a>\r\n		</div>\r\n	</div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-visualization"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"dataset-visualization\">\r\n    <div class=\"dataset-visualization-dimensions\">\r\n\r\n    </div>\r\n    <div class=\"dataset-visualization-visual-element\">\r\n\r\n    </div>\r\n</div>";
  });

this["Handlebars"]["templates"]["dataset/dataset-widget-page"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "\r\n                    <div id=\"options-bar\">\r\n                        <div id=\"visual-element-options\"></div>\r\n                        <div id=\"change-visual-element\"></div>\r\n                    </div>\r\n                ";
  }

function program3(depth0,data) {
  
  
  return "\r\n<div class=\"clearfix dataset-export\"></div>\r\n";
  }

  buffer += "<div id=\"table-and-charts\" class=\"s4y-box\">\r\n    <div class=\"s4y-box-container\">\r\n        <div id=\"datasets-visualization\" class=\"datasets-visualization\">\r\n            <div id=\"visual-element\">\r\n                <div id=\"visual-element-and-filter\">\r\n                    <div id=\"visual-element-container\"></div>\r\n                </div>\r\n\r\n                ";
  stack1 = helpers['if'].call(depth0, depth0.showOptions, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.showExportt, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n\r\n<div class=\"citation\">\r\n    "
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.citation)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/popup/filter-column-containers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"filter-subcontainer\" id=\"chartfilterContainer\">\r\n    <span id=\"options-fixed\" class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.fixedDimensions", options) : helperMissing.call(depth0, "message", "filter.text.fixedDimensions", options)))
    + "</span>\r\n    <div id=\"div-fixed-dimensions\" class=\"div-dimension-container\" data-zone=\"fixed\">\r\n    </div>\r\n    \r\n    <span class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.columns", options) : helperMissing.call(depth0, "message", "filter.text.columns", options)))
    + "</span>\r\n    <div id=\"div-dimension-long2\" class=\"div-dimension-long\" data-zone=\"columns\">\r\n    </div>\r\n    \r\n    <span class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.horizontalAxis", options) : helperMissing.call(depth0, "message", "filter.text.horizontalAxis", options)))
    + "</span>\r\n    <div id=\"div-dimension-long1\" class=\"div-dimension-long\" data-zone=\"horizontal\">\r\n    </div>\r\n    \r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/popup/filter-dimension-categories"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, depth0.state, {hash:{},inverse:self.programWithDepth(4, program4, data, depth0),fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            <span class=\"options_category\">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n        </div>\r\n";
  return buffer;
  }
function program2(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n        <div id=\"div-category"
    + escapeExpression(((stack1 = depth1.number),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-";
  if (stack2 = helpers.number) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.number; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"div-category\" draggable=\"true\" title=\"";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" data-number=\"";
  if (stack2 = helpers.number) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.number; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n    ";
  return buffer;
  }

function program4(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n        <div id=\"div-category"
    + escapeExpression(((stack1 = depth1.number),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-";
  if (stack2 = helpers.number) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.number; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"div-category-clicked\" draggable=\"true\" title=\"";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" data-number=\"";
  if (stack2 = helpers.number) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.number; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n    ";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.categories, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["dataset/filter/popup/filter-dimension-checkbox"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  
  return "\r\n    <div class=\"select-categories selectall\"></div>\r\n";
  }

function program3(depth0,data) {
  
  
  return "\r\n    <div class=\"select-categories unselectall\"></div>\r\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.allSelected, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["dataset/filter/popup/filter-dimension"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"div-dimension-text\">\r\n    <span class=\"dimension-label\">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n</div>\r\n\r\n<div id=\"div-categories-advanced-container";
  if (stack1 = helpers.number) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.number; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"div-categories-advanced-container\">\r\n    <div id=\"div-categories";
  if (stack1 = helpers.number) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.number; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"div-categories\">\r\n        <div class=\"div-categories-container\">\r\n        </div>\r\n    </div>\r\n    <div class='categories-options'>\r\n        <input type='text' name='categories' class='categories-filter' placeholder='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.search.categories", options) : helperMissing.call(depth0, "message", "filter.search.categories", options)))
    + "' />\r\n        <button class='button-categories-big btn'>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.accept", options) : helperMissing.call(depth0, "message", "filter.button.accept", options)))
    + "</button>\r\n    </div>\r\n</div>\r\n<div id=\"triangle-right";
  if (stack2 = helpers.number) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.number; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"triangle-right\"></div>\r\n";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/popup/filter-external-container"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div id=\"filter-container\" class=\"filter-container\">\r\n    <span id=\"close\"></span>\r\n    <button id=\"button-options\" class=\"btn\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.accept", options) : helperMissing.call(depth0, "message", "filter.button.accept", options)))
    + "</button>\r\n    <span id=\"button-cancel-filter\" class=\"button-cancel\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.cancel", options) : helperMissing.call(depth0, "message", "filter.button.cancel", options)))
    + "</span>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/popup/filter-line-containers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"filter-subcontainer\" id=\"chartfilterContainer\">\r\n    <span id=\"options-fixed\" class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.fixedDimensions", options) : helperMissing.call(depth0, "message", "filter.text.fixedDimensions", options)))
    + "</span>\r\n    <div id=\"div-fixed-dimensions\" class=\"div-dimension-container\" data-zone=\"fixed\">\r\n    </div>\r\n    \r\n    <span class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.lines", options) : helperMissing.call(depth0, "message", "filter.text.lines", options)))
    + "</span>\r\n    <div id=\"div-dimension-long2\" class=\"div-dimension-long\" data-zone=\"lines\">\r\n    </div>\r\n    \r\n    <span class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.horizontalAxis", options) : helperMissing.call(depth0, "message", "filter.text.horizontalAxis", options)))
    + "</span>\r\n    <div id=\"div-dimension-long1\" class=\"div-dimension-long\" data-zone=\"horizontal\">\r\n    </div>\r\n    \r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/popup/filter-map-containers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"filter-subcontainer\" id=\"chartfilterContainer\">\r\n    <span id=\"options-fixed\" class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.fixedDimensions", options) : helperMissing.call(depth0, "message", "filter.text.fixedDimensions", options)))
    + "</span>\r\n    <div id=\"div-fixed-dimensions\" class=\"div-dimension-container-static\" data-zone=\"fixed\">\r\n    </div>\r\n    \r\n    <span class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.map", options) : helperMissing.call(depth0, "message", "filter.text.map", options)))
    + "</span>\r\n    <div id=\"div-dimension-long1\" class=\"div-dimension-long-static\" data-zone=\"map\">\r\n    </div>\r\n    \r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/popup/filter-pie-containers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"filter-subcontainer\" id=\"chartfilterContainer\">\r\n    <span id=\"options-fixed\" class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.fixedDimensions", options) : helperMissing.call(depth0, "message", "filter.text.fixedDimensions", options)))
    + "</span>\r\n    <div id=\"div-fixed-dimensions\" class=\"div-dimension-container\" data-zone=\"fixed\">\r\n    </div>\r\n    \r\n    <span class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.sectors", options) : helperMissing.call(depth0, "message", "filter.text.sectors", options)))
    + "</span>\r\n    <div id=\"div-dimension-long1\" class=\"div-dimension-long\" data-zone=\"sectors\">\r\n    </div>\r\n    \r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/popup/filter-table-containers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"filter-subcontainer\" id=\"tablefilterContainer\">\r\n    <span id=\"options-fixed\" class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.fixedDimensions", options) : helperMissing.call(depth0, "message", "filter.text.fixedDimensions", options)))
    + "</span>\r\n    <div id=\"div-fixed-dimensions\" class=\"div-dimension-container\" data-zone=\"fixed\">\r\n    </div>\r\n    <span id=\"options-left\" class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.leftDimensions", options) : helperMissing.call(depth0, "message", "filter.text.leftDimensions", options)))
    + "</span>\r\n    <div id=\"div-left-dimensions\" class=\"div-dimension-container\" data-zone=\"left\">\r\n    </div>\r\n    <span id=\"options-top\" class=\"options\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.text.topDimensions", options) : helperMissing.call(depth0, "message", "filter.text.topDimensions", options)))
    + "</span>\r\n    <div id=\"div-top-dimensions\" class=\"div-dimension-container\" data-zone=\"top\">\r\n    </div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/sidebar/filter-order-view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <div class=\"order-sidebar-zone ";
  stack1 = helpers['if'].call(depth0, depth0.draggable, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, depth0.isFixed, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" data-zone=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n\r\n        ";
  stack1 = helpers.unless.call(depth0, depth0.isFixed, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n\r\n        ";
  stack1 = helpers.each.call(depth0, depth0.dimensions, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </div>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "draggable";
  }

function program4(depth0,data) {
  
  
  return "fixed";
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <h2>";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>\r\n        ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <a href=\"#\" class=\"order-sidebar-dimension ";
  stack1 = helpers['if'].call(depth0, depth0.draggable, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" ";
  stack1 = helpers['if'].call(depth0, depth0.draggable, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " data-dimension-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n                ";
  stack1 = helpers['if'].call(depth0, depth0.selectedCategory, {hash:{},inverse:self.program(13, program13, data),fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            </a>\r\n        ";
  return buffer;
  }
function program9(depth0,data) {
  
  
  return "draggable=\"true\"";
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                    ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " : <small>"
    + escapeExpression(((stack1 = ((stack1 = depth0.selectedCategory),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small>\r\n                ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                    ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n                ";
  return buffer;
  }

  buffer += "<div class=\"order-sidebar-instructions\">\r\nArrastre las dimensiones para cambiar el orden\r\n</div>\r\n\r\n";
  stack1 = helpers.each.call(depth0, depth0.zones, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/sidebar/filter-sidebar-category"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"filter-sidebar-category-left-actions\">\r\n    <i class=\"category-expand ";
  if (stack1 = helpers.collapseClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.collapseClass; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "   level"
    + escapeExpression(((stack1 = ((stack1 = depth0.filterRepresentation),stack1 == null || stack1 === false ? stack1 : stack1.level)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></i>\r\n    <i class=\"category-state ";
  if (stack2 = helpers.stateClass) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.stateClass; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " level"
    + escapeExpression(((stack1 = ((stack1 = depth0.filterRepresentation),stack1 == null || stack1 === false ? stack1 : stack1.level)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></i>\r\n</div>\r\n\r\n<a class=\"filter-sidebar-category-label\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.filterRepresentation),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n    ";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n</a>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/sidebar/filter-sidebar-dimension-actions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n        <a href=\"#\" class=\"btn btn-mini filter-sidebar-reverse\" title=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.reverseOrder", options) : helperMissing.call(depth0, "message", "filter.button.reverseOrder", options)))
    + "\"><i class=\"icon-reverse\"/></a>\r\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n        <a href=\"#\" class=\"btn btn-mini filter-sidebar-selectAll\" title=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.selectAll", options) : helperMissing.call(depth0, "message", "filter.button.selectAll", options)))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.selectAll", options) : helperMissing.call(depth0, "message", "filter.button.selectAll", options)))
    + "</a>\r\n        <a href=\"#\" class=\"btn btn-mini filter-sidebar-unselectAll\" title=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.selectAll", options) : helperMissing.call(depth0, "message", "filter.button.selectAll", options)))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.deselectAll", options) : helperMissing.call(depth0, "message", "filter.button.deselectAll", options)))
    + "</a>\r\n    ";
  return buffer;
  }

  buffer += "<div class=\"filter-sidebar-dimension-actions\">\r\n    ";
  stack1 = helpers['if'].call(depth0, depth0.isTimeDimension, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n    ";
  stack1 = helpers.unless.call(depth0, depth0.isFixedDimension, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/sidebar/filter-sidebar-dimension"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return " filter-sidebar-dimension-hierarchy ";
  }

function program3(depth0,data) {
  
  
  return " in ";
  }

  buffer += "<div class=\"filter-sidebar-dimension ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.dimension),stack1 == null || stack1 === false ? stack1 : stack1.hierarchy), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\r\n    <div class=\"filter-sidebar-dimension-title\">\r\n        <div class=\"filter-sidebar-dimension-label\">\r\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.dimension),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"filter-sidebar-dimension-content collapse ";
  stack2 = helpers.unless.call(depth0, ((stack1 = depth0.dimension),stack1 == null || stack1 === false ? stack1 : stack1.open), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" >\r\n        <div class=\"filter-sidebar-dimension-searchbar\"></div>\r\n\r\n        <div class=\"filter-sidebar-dimension-actionsbar\">\r\n        	<div class=\"filter-sidebar-dimension-actionsbar-left\">\r\n	            <div class=\"filter-sidebar-dimension-levels\"></div>\r\n	            <div class=\"filter-sidebar-dimension-visibleLabelType\"></div>\r\n	        </div>\r\n	        <div class=\"filter-sidebar-dimension-actionsbar-right\">\r\n            	<div class=\"filter-sidebar-dimension-actions\"></div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"filter-sidebar-categories\"></div>\r\n    </div>\r\n\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/sidebar/filter-sidebar-view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"filter-sidebar\" id=\"filter-sidebar\">\r\n    <div class=\"filter-sidebar-search\"></div>\r\n    <div class=\"filter-sidebar-dimensions\"></div>\r\n</div>";
  });

this["Handlebars"]["templates"]["dataset/map/map-error"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"map-error-container\">\r\n    <div class=\"map-error\">\r\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "ve.map.nomap", options) : helperMissing.call(depth0, "message", "ve.map.nomap", options)))
    + "\r\n    </div>\r\n</div>\r\n";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/map/map-ranges"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<span class=\"ranges-selector-title\">Rangos</span>\r\n<div id=\"line-container\">\r\n    <div id=\"line\"></div>\r\n    <div id=\"draggable\"></div>\r\n    <span class=\"ranges-boundaries\">1</span>\r\n    <span class=\"ranges-boundaries right-boundary\">10</span>\r\n</div>\r\n";
  });

this["Handlebars"]["templates"]["dataset/map/map-zoom"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"exit-zoom\" class=\"zoom-controls\"><i class=\"icon-map-center\" title=\"Centrar\"/></div>\r\n<div id=\"more-zoom\" class=\"zoom-controls\"><i class=\"icon-plus\" title=\"Ampliar\"/></div>\r\n<div id=\"less-zoom\" class=\"zoom-controls\"><i class=\"icon-minus\" title=\"Disminuir\"/></div>\r\n<div id=\"zoom-line\"></div>\r\n<div id=\"current-zoom\"></div>";
  });

this["Handlebars"]["templates"]["error/404"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"contenido\">\r\n    <h2 class=\"tit_conten_1_col\">Control de Errores</h2>\r\n    <h3>Error 404 - Documento No Encontrado</h3>\r\n    <p class=\"justificado\">Lo sentimos, el Documento al que está intentado acceder no está disponible.\r\n        Esto puede ocurrir por varios  motivos:</p>\r\n    <ul>\r\n        <li>El documento no existe en el Servidor del Gobierno de Canarias.</li>\r\n        <li>El documento puede no estar disponible \"Temporalmente\".</li>\r\n        <li>Ha introducido un URL incorrecto. Compruebe y asegúrese de que está bien escrito.</li>\r\n    </ul>\r\n    <p class=\"nota\"><strong>Atención:</strong> Si desea informar, por favor, hágalo desde Contacto.</p>\r\n</div>";
  });

this["Handlebars"]["templates"]["error/500"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"contenido\">\r\n    <h2 class=\"tit_conten_1_col\">Control de Errores</h2>\r\n    <h3>Error 500 - Error interno</h3>\r\n    <p class=\"nota\"><strong>Atención:</strong> Si desea informar, por favor, hágalo desde Contacto.</p>\r\n</div>";
  });

this["Handlebars"]["templates"]["selection/selection"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n    <div class=\"dataset-header\">\r\n        <div>\r\n            <div class=\"dataset-header-actions\"></div>\r\n            \r\n            <div class=\"dataset-header-info\">\r\n                <h1 class=\"dataset-header-title\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\r\n            </div>\r\n        </div>\r\n\r\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.description), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n            <div>\r\n                <p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.safeString || depth0.safeString),stack1 ? stack1.call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.description), options) : helperMissing.call(depth0, "safeString", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.description), options)))
    + "</p>\r\n            </div>\r\n        ";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.showHeader, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n<div class=\"selection-body\">\r\n	<div class=\"sidebar-container selection-sidebar-container\">\r\n	\r\n	</div>\r\n	<div class=\"selection-dimensions js-sidebar-container-sibling\">\r\n		<div class=\"selection-options-bar\">\r\n	\r\n		</div>\r\n	\r\n	</div>\r\n</div>";
  return buffer;
  });