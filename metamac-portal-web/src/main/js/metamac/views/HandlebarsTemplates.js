this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["collection/collection"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<p>";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n";
  return buffer;
  }

  buffer += "<h3>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\n\n";
  stack1 = helpers['if'].call(depth0, depth0.description, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<div class=\"collection-nodes\">\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["collection/collectionNode"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
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
    + "</a>\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <p>";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n";
  return buffer;
  }

  buffer += "<p>\n";
  stack1 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</p>\n\n";
  stack1 = helpers['if'].call(depth0, depth0.description, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<ul></ul>";
  return buffer;
  });

this["Handlebars"]["templates"]["components/searchbar/searchbar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"searchbar\">\n    <input type=\"text\" placeholder=\"Buscar\" value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <div class=\"icon-search-min\"></div>\n    <a href=\"#\" class=\"searchbar-clear\">\n        <i class=\"icon-remove-min\"></i>\n    </a>\n</div>";
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
  buffer += "\n        <option value=\"";
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
    + "</option>\n    ";
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
  buffer += ">\n    ";
  stack1 = helpers.each.call(depth0, depth0.options, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</select>";
  return buffer;
  });

this["Handlebars"]["templates"]["components/sidebar/sidebar-container"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li class=\"sidebar-menu-item\" data-view-id=\"";
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
    + "</a></li>\n        ";
  return buffer;
  }

  buffer += "<div class=\"sidebar-menu\">\n    <ul>\n        ";
  stack1 = helpers.each.call(depth0, depth0.menuItems, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n</div>\n\n<div class=\"sidebar-sidebar\">\n    <div class=\"sidebar-sidebar-content\"></div>\n    <div class=\"sidebar-splitter\">\n        <i class=\"icon-separator\"></i>\n    </div>\n</div>\n\n<div class=\"sidebar-content\">\n\n</div>";
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

this["Handlebars"]["templates"]["dataset/dataset-export"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  
  return "\n<div class=\"btn-group dropup pull-right\">\n    <button class=\"btn btn-large btn-primary export-png\">Exportar gráfica (GRATIS)</button>\n    <button class=\"btn btn-large btn-primary dropdown-toggle\" data-toggle=\"dropdown\">\n        <span class=\"caret\"></span>\n    </button>\n    <ul class=\"dropdown-menu  pull-right\">\n        <li><a class=\"export-png\" href=\"#\">PNG</a></li>\n        <li><a class=\"export-pdf\" href=\"#\">PDF</a></li>\n        <li><a class=\"export-svg\" href=\"#\">SVG</a></li>\n    </ul>\n</div>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.exportIsAllowed, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["dataset/dataset-info"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n        <a href=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/providers/"
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.provider)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\n           class=\"dataset-header-logo provider-logo provider-logo-";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toLowerCase || depth0.toLowerCase),stack1 ? stack1.call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.provider), options) : helperMissing.call(depth0, "toLowerCase", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.provider), options)))
    + "\"></a>\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <a href=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/providers/"
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.provider)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.provider)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n        ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n<div class=\"field\">\n    <span class=\"metadata-title\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.dataset.language", options) : helperMissing.call(depth0, "message", "entity.dataset.language", options)))
    + "</span>\n\n    <div class=\"metadata-value\">\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data};
  stack2 = ((stack1 = helpers.join || depth0.join),stack1 ? stack1.call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.languages), options) : helperMissing.call(depth0, "join", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.languages), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n</div>\n";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n        <a href=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.licenseUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_blank\">\n            ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.dataset.licenseLink", options) : helperMissing.call(depth0, "message", "entity.dataset.licenseLink", options)))
    + "\n        </a>\n        ";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.dataset.nolicense", options) : helperMissing.call(depth0, "message", "entity.dataset.nolicense", options)))
    + "\n        ";
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n<div class=\"field\">\n    <div class=\"metadata-title\">\n        <div>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.dataset.measureDimension", options) : helperMissing.call(depth0, "message", "entity.dataset.measureDimension", options)))
    + "</div>\n    </div>\n    <div class=\"metadata-value\">\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data};
  stack2 = ((stack1 = helpers.join || depth0.join),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.measureDimension)),stack1 == null || stack1 === false ? stack1 : stack1.representation), options) : helperMissing.call(depth0, "join", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.measureDimension)),stack1 == null || stack1 === false ? stack1 : stack1.representation), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n</div>\n";
  return buffer;
  }

function program14(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n<div class=\"field\">\n    <div class=\"metadata-title\">\n        <div>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.dataset.dimensions.title", options) : helperMissing.call(depth0, "message", "entity.dataset.dimensions.title", options)))
    + "</div>\n    </div>\n    <div class=\"metadata-value\">\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data};
  stack2 = ((stack1 = helpers.join || depth0.join),stack1 ? stack1.call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dimensions), options) : helperMissing.call(depth0, "join", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dimensions), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n</div>\n";
  return buffer;
  }

function program16(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n<div class=\"field\">\n    <div class=\"metadata-title\">\n        <div>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.dataset.additionalData", options) : helperMissing.call(depth0, "message", "entity.dataset.additionalData", options)))
    + "</div>\n    </div>\n    <div class=\"metadata-value\">\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data};
  stack2 = ((stack1 = helpers.ulList || depth0.ulList),stack1 ? stack1.call(depth0, ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.dataset), options) : helperMissing.call(depth0, "ulList", ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.dataset), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n</div>\n";
  return buffer;
  }
function program17(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.iString || depth0.iString),stack1 ? stack1.call(depth0, depth0.value, options) : helperMissing.call(depth0, "iString", depth0.value, options)))
    + "\n        ";
  return buffer;
  }

  buffer += "<div class=\"metadata-group\">\n<div class=\"field\">\n    <span class=\"metadata-title\">Proveedor</span>\n\n    <div class=\"metadata-value\">\n        ";
  stack1 = helpers['if'].call(depth0, depth0.providerHasImg, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n</div>\n\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.languages), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n<div class=\"field\">\n    <span class=\"metadata-title\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.dataset.license", options) : helperMissing.call(depth0, "message", "entity.dataset.license", options)))
    + "</span>\n\n    <div class=\"metadata-value\">\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.licenseUrl), {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n</div>\n\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.releaseDate", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.release), "date", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.releaseDate", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.release), "date", options)))
    + "\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.publishingDate", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.modification), "date", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.publishingDate", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.modification), "date", options)))
    + "\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.providerReleaseDate", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.providerRelease), "date", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.providerReleaseDate", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.providerRelease), "date", options)))
    + "\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.providerPublishingDate", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.providerModification), "date", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.providerPublishingDate", ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.providerModification), "date", options)))
    + "\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fieldOutput || depth0.fieldOutput),stack1 ? stack1.call(depth0, "entity.dataset.frecuency", ((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.frecuency), "text", options) : helperMissing.call(depth0, "fieldOutput", "entity.dataset.frecuency", ((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.dates)),stack1 == null || stack1 === false ? stack1 : stack1.frecuency), "text", options)))
    + "\n\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.measureDimension)),stack1 == null || stack1 === false ? stack1 : stack1.representation), {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.dimensions), {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.dataset), {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n</div>\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-options"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n        <button class=\"btn fs "
    + escapeExpression(((stack1 = ((stack1 = depth0.fullScreen),stack1 == null || stack1 === false ? stack1 : stack1.btnClass)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " visual-element-options-fs\" title='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "filter.button.fullscreen", options) : helperMissing.call(depth0, "message", "filter.button.fullscreen", options)))
    + "'><i class=\"icon-fullscreen icon-2x\"></i></button>\r\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
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
    + "\"><i class=\"icon-";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></i></button>\r\n        ";
  return buffer;
  }

  buffer += "<div class=\"visual-element-options\">\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.fullScreen),stack1 == null || stack1 === false ? stack1 : stack1.visible), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</div>\r\n\r\n<div class=\"change-visual-element\">\r\n    <div class=\"btn-group\" data-toggle=\"buttons-radio\">\r\n        ";
  stack2 = helpers.each.call(depth0, depth0.veTypeButton, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n</div>\r\n\r\n\r\n\r\n\r\n";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-page"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n                ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <div>\r\n            <p>"
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n        </div>\r\n    ";
  return buffer;
  }

  buffer += "<div class=\"dataset-header\">\r\n    <div>\r\n\r\n        <div class=\"dataset-header-actions\"></div>\r\n\r\n        <div class=\"dataset-header-info\">\r\n            <h2 class=\"dataset-header-title\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h2>\r\n\r\n            <p class=\"dataset-header-categories\">\r\n                ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.join || depth0.join),stack1 ? stack1.call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.categories), options) : helperMissing.call(depth0, "join", ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.categories), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </p>\r\n        </div>\r\n    </div>\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.description), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</div>\r\n\r\n<div class=\"dataset-sidebar-visualization-container\">\r\n\r\n</div>\r\n\r\n<div class=\"clearfix dataset-export\">\r\n\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-share-modal"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\r\n    <form class=\"form-horizontal\">\r\n        <div class=\"control-group\">\r\n            <label class=\"control-label\" for=\"input01\">\r\n                Permalink <i class=\"icon-permalink\"></i>\r\n            </label>\r\n\r\n            <div class=\"controls\">\r\n                <input type=\"text\" class=\"input-xlarge\" id=\"input01\" value=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n            </div>\r\n        </div>\r\n\r\n    <div class=\"control-group\">\r\n        <div class=\"controls\">\r\n            <div class=\"addthis_toolbox addthis_default_style addthis_32x32_style\">\r\n                <a class=\"addthis_button_twitter\"></a>\r\n                <a class=\"addthis_button_facebook\"></a>\r\n                <a class=\"addthis_button_linkedin\"></a>\r\n                <a class=\"addthis_button_gmail\"></a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    </form>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/dataset-visualization"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"dataset-visualization\">\n    <div class=\"dataset-visualization-visual-element\">\n\n    </div>\n    <div class=\"dataset-visualization-options-bar\">\n\n    </div>\n</div>";
  });

this["Handlebars"]["templates"]["dataset/dataset-widget-page"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "\n                    <div id=\"options-bar\">\n                        <div id=\"visual-element-options\"></div>\n                        <div id=\"change-visual-element\"></div>\n                    </div>\n                ";
  }

function program3(depth0,data) {
  
  
  return "\n<div class=\"clearfix dataset-export\"></div>\n";
  }

  buffer += "<div id=\"table-and-charts\" class=\"s4y-box\">\n    <div class=\"s4y-box-container\">\n        <div id=\"datasets-visualization\" class=\"datasets-visualization\">\n            <div id=\"visual-element\">\n                <div id=\"visual-element-and-filter\">\n                    <div id=\"visual-element-container\"></div>\n                </div>\n\n                ";
  stack1 = helpers['if'].call(depth0, depth0.showOptions, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </div>\n        </div>\n    </div>\n</div>\n\n";
  stack1 = helpers['if'].call(depth0, depth0.showExportt, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n<div class=\"citation\">\n    "
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.citation)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n</div>";
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
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"order-sidebar-zone ";
  stack1 = helpers['if'].call(depth0, depth0.draggable, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, depth0.isFixed, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" data-zone=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n\n        ";
  stack1 = helpers.unless.call(depth0, depth0.isFixed, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n        ";
  stack1 = helpers.each.call(depth0, depth0.dimensions, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n";
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
  buffer += "\n        <h2>";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>\n        ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class=\"order-sidebar-dimension ";
  stack1 = helpers['if'].call(depth0, depth0.draggable, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" ";
  stack1 = helpers['if'].call(depth0, depth0.draggable, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " data-dimension-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n                ";
  stack1 = helpers['if'].call(depth0, depth0.selectedCategory, {hash:{},inverse:self.program(13, program13, data),fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </div>\n        ";
  return buffer;
  }
function program9(depth0,data) {
  
  
  return "draggable=\"true\"";
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " : <small>"
    + escapeExpression(((stack1 = ((stack1 = depth0.selectedCategory),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small>\n                ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n                ";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.zones, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["dataset/filter/sidebar/filter-sidebar-category"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"filter-sidebar-category-left-actions\">\n    <i class=\"category-expand ";
  if (stack1 = helpers.collapseClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.collapseClass; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "   level"
    + escapeExpression(((stack1 = ((stack1 = depth0.filterRepresentation),stack1 == null || stack1 === false ? stack1 : stack1.level)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></i>\n    <i class=\"category-state ";
  if (stack2 = helpers.stateClass) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.stateClass; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " level"
    + escapeExpression(((stack1 = ((stack1 = depth0.filterRepresentation),stack1 == null || stack1 === false ? stack1 : stack1.level)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></i>\n</div>\n\n<a class=\"filter-sidebar-category-label\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.filterRepresentation),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    ";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n</a>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/sidebar/filter-sidebar-dimension-actions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  
  return "\n\n";
  }

function program3(depth0,data) {
  
  
  return "\n<div class=\"filter-sidebar-dimension-actions\">\n    <a href=\"#\" class=\"btn btn-mini filter-sidebar-selectAll\">Marcar todo</a>\n    <a href=\"#\" class=\"btn btn-mini filter-sidebar-unselectAll\">Desmarcar todo</a>\n</div>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.hasHierarchy, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = helpers.unless.call(depth0, depth0.isFixedDimension, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
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
  buffer += "\">\n    <div class=\"filter-sidebar-dimension-title\">\n        <div class=\"filter-sidebar-dimension-label\">\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.dimension),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n        </div>\n    </div>\n\n    <div class=\"filter-sidebar-dimension-content collapse ";
  stack2 = helpers.unless.call(depth0, ((stack1 = depth0.dimension),stack1 == null || stack1 === false ? stack1 : stack1.open), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" >\n        <div class=\"filter-sidebar-dimension-searchbar\"></div>\n\n        <div class=\"filter-sidebar-dimension-actionsbar\">\n            <div class=\"filter-sidebar-dimension-levels\"></div>\n            <div class=\"filter-sidebar-dimension-actions\"></div>\n        </div>\n\n        <div class=\"filter-sidebar-categories\"></div>\n    </div>\n\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["dataset/filter/sidebar/filter-sidebar-view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"filter-sidebar\" id=\"filter-sidebar\">\n    <div class=\"filter-sidebar-search\"></div>\n    <div class=\"filter-sidebar-dimensions\"></div>\n</div>";
  });

this["Handlebars"]["templates"]["dataset/map/map-error"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"map-error-container\">\n    <div class=\"map-error\">\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "ve.map.nomap", options) : helperMissing.call(depth0, "message", "ve.map.nomap", options)))
    + "\n    </div>\n</div>\n";
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
  


  return "<div id=\"exit-zoom\" class=\"zoom-controls\"></div>\r\n<div id=\"more-zoom\" class=\"zoom-controls\"></div>\r\n<div id=\"less-zoom\" class=\"zoom-controls\"></div>\r\n<div id=\"zoom-line\"></div>\r\n<div id=\"current-zoom\"></div>";
  });

this["Handlebars"]["templates"]["selection/selection"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"selection-actions\">\n    <a href=\"#visualization/canvasTable\" class=\"btn selection-all\">Consultar todo</a>\n    <a href=\"#\" class=\"btn selection-permalink\">Consultar seleccion</a>\n</div>\n\n<div class=\"selection-dimensions\">\n\n</div>";
  });