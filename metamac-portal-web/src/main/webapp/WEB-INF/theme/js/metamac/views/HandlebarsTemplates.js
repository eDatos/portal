this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["admin/remove-page-table-row"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "checked";
  }

  buffer += "<td><input type=\"checkbox\" name=\"";
  if (stack1 = helpers.uri) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.uri; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" value=\"yes\" ";
  stack1 = helpers['if'].call(depth0, depth0.selected, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " /></td>\n<td><a href=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/providers/";
  if (stack1 = helpers.providerAcronym) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.providerAcronym; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/datasets/";
  if (stack1 = helpers.identifier) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.identifier; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.identifier) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.identifier; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></td>\n<td>";
  if (stack1 = helpers.providerAcronym) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.providerAcronym; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.providerPublishingDate) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.providerPublishingDate; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.publishingDate) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.publishingDate; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.uri) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.uri; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>";
  return buffer;
  });

this["Handlebars"]["templates"]["admin/remove-page-table"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<form class=\"datasetDeleteForm\">\n    <table class=\"table table-striped table-hover\">\n        <thead>\n        <tr>\n            <th><input type=\"checkbox\" class=\"select-all\" value=\"yes\"/></th>\n            <th>Identifier</th>\n            <th>Provider</th>\n            <th>ProviderPublishingDate</th>\n            <th>PublishingDate</th>\n            <th>Uri</th>\n        </tr>\n        </thead>\n        <tbody></tbody>\n    </table>\n\n    <div class=\"controls\">\n        <button type=\"submit\" class=\"btn btn-danger\">Borrar</button>\n    </div>\n</form>";
  });

this["Handlebars"]["templates"]["admin/remove-page"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h3>Borrar datasets</h3>\n\n<form class=\"datasetSearchForm\">\n    <div class=\"control-group\">\n        <label class=\"control-label\" for=\"criteria\">Criteria</label>\n        <div class=\"controls\">\n            <textarea rows=\"3\" name=\"criteria\" id=\"criteria\" class=\"admin-delete-criteria\"></textarea>\n        </div>\n        <div class=\"control-group\">\n            <label class=\"control-label\" for=\"inputLimit\">Limit</label>\n            <div class=\"controls\">\n                <select name=\"limit\" id=\"inputLimit\">\n                    <option>10</option>\n                    <option>50</option>\n                    <option>100</option>\n                    <option>500</option>\n                    <option>1000</option>\n                </select>\n            </div>\n        </div>\n        <div class=\"controls\">\n            <button type=\"submit\" class=\"btn\">Buscar</button>\n        </div>\n    </div>\n</form>\n\n<div class=\"datasets-list\"></div>";
  });

this["Handlebars"]["templates"]["alerts/error"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function";


  buffer += "<div class=\"alert alert-error\">\r\n    ";
  if (stack1 = helpers.msg) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.msg; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["alerts/warning"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function";


  buffer += "<div class=\"alert\">\r\n    ";
  if (stack1 = helpers.msg) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.msg; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["comments/comments-comment-delete-popover"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p><a href='#' class='btn btn-danger comment-delete-verify comment-delete-verify-ok'>Borrar</a></p>\r\n<p><a href='#' class='btn comment-delete-verify comment-delete-verify-cancel'>Cancelar</a></p>";
  });

this["Handlebars"]["templates"]["comments/comments-comment"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <img class=\"comment-avatar\" src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.comment),stack1 == null || stack1 === false ? stack1 : stack1.user)),stack1 == null || stack1 === false ? stack1 : stack1.imageUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <img class=\"comment-avatar\" src=\"";
  if (stack1 = helpers.resourceContext) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.resourceContext; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/images/defaultUser.png\">\r\n        ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n            | <span class=\"comment-lastUpdate\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fromNow || depth0.fromNow),stack1 ? stack1.call(depth0, ((stack1 = depth0.comment),stack1 == null || stack1 === false ? stack1 : stack1.lastUpdated), options) : helperMissing.call(depth0, "fromNow", ((stack1 = depth0.comment),stack1 == null || stack1 === false ? stack1 : stack1.lastUpdated), options)))
    + "</span>\r\n            ";
  return buffer;
  }

function program7(depth0,data) {
  
  
  return "\r\n                <span class=\"pull-right\">\r\n                    <a href=\"#\" title=\"Borrar comentario\" rel=\"popover\" class=\"comment-delete\"\r\n                       data-placement=\"bottom\">x</a>\r\n                </span>\r\n            ";
  }

  buffer += "<div class=\"comment\">\r\n\r\n    <div class=\"comment-avatar-container\">\r\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = depth0.comment),stack1 == null || stack1 === false ? stack1 : stack1.user)),stack1 == null || stack1 === false ? stack1 : stack1.imageUrl), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n\r\n    <div class=\"comment-content\">\r\n        <div class=\"comment-header\">\r\n            <span class=\"comment-username\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.comment),stack1 == null || stack1 === false ? stack1 : stack1.user)),stack1 == null || stack1 === false ? stack1 : stack1.username)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span> |\r\n            <span class=\"comment-createdDate\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.fromNow || depth0.fromNow),stack1 ? stack1.call(depth0, ((stack1 = depth0.comment),stack1 == null || stack1 === false ? stack1 : stack1.createdDate), options) : helperMissing.call(depth0, "fromNow", ((stack1 = depth0.comment),stack1 == null || stack1 === false ? stack1 : stack1.createdDate), options)))
    + "</span>\r\n            ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.comment),stack1 == null || stack1 === false ? stack1 : stack1.lastUpdate), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n            ";
  stack2 = helpers['if'].call(depth0, depth0.isSelfComment, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        </div>\r\n\r\n        <div class=\"comment-text\">\r\n            ";
  stack2 = ((stack1 = ((stack1 = depth0.comment),stack1 == null || stack1 === false ? stack1 : stack1.contentHtml)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        </div>\r\n    </div>\r\n\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["comments/comments-counter"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<h2><i class=\"icon-comments\"></i>";
  if (stack1 = helpers.total) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.total; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "comments.counter.total", options) : helperMissing.call(depth0, "message", "comments.counter.total", options)))
    + "</h2>";
  return buffer;
  });

this["Handlebars"]["templates"]["comments/comments-page"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n    <form>\r\n        <textarea rows=\"2\" class=\"new-comment-text\"></textarea>\r\n        <input type=\"submit\" class=\"btn\" value=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "comments.add.send", options) : helperMissing.call(depth0, "message", "comments.add.send", options)))
    + "\">\r\n        <p>\r\n            <span class=\"label label-success\" style=\"display:none\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "comments.add.success", options) : helperMissing.call(depth0, "message", "comments.add.success", options)))
    + "</span>\r\n            <span class=\"label label-important\" style=\"display:none\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "comments.add.error", options) : helperMissing.call(depth0, "message", "comments.add.error", options)))
    + "</span>\r\n        </p>\r\n    </form>\r\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n    <p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "comments.add.loginFirst", options) : helperMissing.call(depth0, "message", "comments.add.loginFirst", options)))
    + "</p>\r\n    ";
  return buffer;
  }

  buffer += "<div class=\"comments-counter\">\r\n\r\n</div>\r\n\r\n<div class=\"comments-list-container\">\r\n    <div class=\"comments-list\"></div>\r\n\r\n    <div class=\"comments-list-pagination\">\r\n\r\n    </div>\r\n\r\n</div>\r\n\r\n<div class=\"comments-add-container\">\r\n    <h3>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "comments.add.title", options) : helperMissing.call(depth0, "message", "comments.add.title", options)))
    + "</h3>\r\n    ";
  stack2 = helpers['if'].call(depth0, depth0.user, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["comments/comments-pagination"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <li class=\"";
  if (stack1 = helpers.cssClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.cssClass; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n            <a class=\"pagination-page\" href=\"#\" data-page=\"";
  if (stack1 = helpers.number) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.number; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.number) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.number; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\r\n        </li>\r\n        ";
  return buffer;
  }

  buffer += "<div class=\"pagination pagination-centered\">\r\n    <ul>\r\n        <li class=\"";
  if (stack1 = helpers.previousCssClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.previousCssClass; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"><a class=\"pagination-previous\" href=\"#\">«</a></li>\r\n        ";
  stack1 = helpers.each.call(depth0, depth0.pages, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n        <li class=\"";
  if (stack1 = helpers.nextCssClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nextCssClass; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"><a class=\"pagination-next\" href=\"#\">»</a></li>\r\n    </ul>\r\n</div>\r\n";
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
  buffer += "\n            <li class=\"sidebar-menu-item\" data-view-id=\"";
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
    + "</a></li>\n            ";
  return buffer;
  }

  buffer += "<div class=\"sidebar-container\">\n    <div class=\"sidebar-menu\">\n        <ul>\n            ";
  stack1 = helpers.each.call(depth0, depth0.menuItems, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n    </div>\n\n    <div class=\"sidebar-sidebar\">\n        <div class=\"sidebar-sidebar-content\"></div>\n        <div class=\"sidebar-splitter\">\n            <i class=\"icon-separator\"></i>\n        </div>\n    </div>\n\n    <div class=\"sidebar-content\">\n\n    </div>\n</div>";
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

  buffer += "<div class=\"dataset-header\">\r\n    <div>\r\n\r\n        <div class=\"dataset-header-actions\"></div>\r\n\r\n\r\n        <div class=\"dataset-header-info\">\r\n            <h2 class=\"dataset-header-title\" title=\""
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

this["Handlebars"]["templates"]["datasetrequest/datasetrequest-form"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<div class=\"alert alert-error\">";
  if (stack1 = helpers.error) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.error; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<div class=\"alert alert-success\">";
  if (stack1 = helpers.success) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.success; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.error, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.success, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n<form class=\"form-horizontal\" action=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/datasetrequest\" method=\"POST\">\r\n    <fieldset>\r\n        <legend>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "datasetrequest.title", options) : helperMissing.call(depth0, "message", "datasetrequest.title", options)))
    + "</legend>\r\n\r\n        <div class=\"control-group\">\r\n            <label class=\"control-label\" for=\"email\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "datasetrequest.email", options) : helperMissing.call(depth0, "message", "datasetrequest.email", options)))
    + "</label>\r\n            <div class=\"controls\">\r\n                <input type=\"text\" id=\"email\" name=\"email\" class=\"input-xlarge required email\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.formdata),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"control-group\">\r\n            <label class=\"control-label\" for=\"email\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "datasetrequest.comment", options) : helperMissing.call(depth0, "message", "datasetrequest.comment", options)))
    + "</label>\r\n            <div class=\"controls\">\r\n                <textarea name=\"comment\" class=\"input-xlarge required\" rows=\"10\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.formdata),stack1 == null || stack1 === false ? stack1 : stack1.comment)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"form-actions\">\r\n            <button type=\"submit\" class=\"btn btn-primary\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "datasetrequest.submit", options) : helperMissing.call(depth0, "message", "datasetrequest.submit", options)))
    + "</button>\r\n        </div>\r\n\r\n    </fieldset>\r\n</form>\r\n";
  return buffer;
  });

this["Handlebars"]["templates"]["datasets/dataset"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                ";
  stack1 = helpers['if'].call(depth0, depth0.isFavourite, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "\r\n                    <a href=\"#\" rel=\"tooltip\" title=\"Desmarcar como favorito\" class=\"fav\"><i class=\"icon-star-min\"></i></a>\r\n                ";
  }

function program4(depth0,data) {
  
  
  return "\r\n                    <a href=\"#\" rel=\"tooltip\" title=\"Marcar como favorito\" class=\"fav\"><i class=\"icon-star-empty-min\"></i></a>\r\n                ";
  }

function program6(depth0,data) {
  
  
  return "\r\n                <a href=\"#\" rel=\"tooltip\" title=\"Accede con tu usuario\" class=\"fav\"><i class=\"icon-star-empty-min\"></i></a>\r\n            ";
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n       <i class=\"icon-calendar-min-gray\"></i>\r\n       <span class=\"dataset-list-el-date\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.date || depth0.date),stack1 ? stack1.call(depth0, ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.providerPublishingDate), options) : helperMissing.call(depth0, "date", ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.providerPublishingDate), options)))
    + "</span>\r\n    ";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <i class=\"icon-provider-min-gray\"></i>\r\n            <span class=\"dataset-list-el-provider\">\r\n                <a href=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/providers/"
    + escapeExpression(((stack1 = ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.providerAcronym)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" title=\"Proveedor\">\r\n                    "
    + escapeExpression(((stack1 = ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.providerAcronym)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n                </a>\r\n            </span>\r\n    ";
  return buffer;
  }

  buffer += "<div class=\"dataset-list-el-title\">\r\n    <a href=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/providers/"
    + escapeExpression(((stack1 = ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.providerAcronym)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/datasets/"
    + escapeExpression(((stack1 = ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.identifier)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" title=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.iString || depth0.iString),stack1 ? stack1.call(depth0, ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.title), options) : helperMissing.call(depth0, "iString", ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.title), options)))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.iString || depth0.iString),stack1 ? stack1.call(depth0, ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.title), options) : helperMissing.call(depth0, "iString", ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.title), options)))
    + "</a>\r\n</div>\r\n<div class=\"metadata\">\r\n        <span class=\"star\">\r\n            ";
  stack2 = helpers['if'].call(depth0, depth0.user, {hash:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        </span>\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.providerPublishingDate), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.dataset),stack1 == null || stack1 === false ? stack1 : stack1.providerAcronym), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</div>\r\n";
  return buffer;
  });

this["Handlebars"]["templates"]["datasets/datasets"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  
  return "\r\n        <div class=\"btn btn-more\">Ver más</div>\r\n    ";
  }

  buffer += "<div class=\"dataset-list\">\r\n\r\n    <div class=\"datasets\"></div>\r\n\r\n\r\n    ";
  stack1 = helpers['if'].call(depth0, depth0.hasMore, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["index/index-page"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"row hidden-phone\">\n    <div class=\"span12 index-hero\">\n        <div class=\"row index-hero-content\">\n            <div class=\"span11\">\n                <h1>¿Quieres enriquecer tus artículos con gráficos y mapas?</h1>\n                <h2>En stat4you tienes todas las estadísticas del INE y del ISTAC para que crees tus gráficos fácilmente</h2>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class=\"row\">\n    <div class=\"span6\">\n        <div class=\"s4y-box\">\n            <div class=\"s4y-box-header\">\n                <h2>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.main.lastPublishedDataset.ine.title", options) : helperMissing.call(depth0, "message", "page.main.lastPublishedDataset.ine.title", options)))
    + "</h2>\n            </div>\n            <div class=\"s4y-box-container\">\n                <div class=\"index-datasets\" id=\"ineDatasets\">\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"span6\">\n        <div class=\"s4y-box\">\n            <div class=\"s4y-box-header\">\n                <h2>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.main.lastPublishedDataset.istac.title", options) : helperMissing.call(depth0, "message", "page.main.lastPublishedDataset.istac.title", options)))
    + "</h2>\n            </div>\n            <div class=\"s4y-box-container\">\n                <div class=\"index-providers\" id=\"istacDatasets\">\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div id=\"videoModal\" class=\"modal hide\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" style=\"width:853\"></div>";
  return buffer;
  });

this["Handlebars"]["templates"]["index/index-providers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"index-provider list-separator\">\r\n            <div class=\"index-provider-logo\">\r\n                <a href=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/providers/";
  if (stack1 = helpers.acronym) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.acronym; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n                    <i class=\"provider-logo-min-";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toLowerCase || depth0.toLowerCase),stack1 ? stack1.call(depth0, depth0.acronym, options) : helperMissing.call(depth0, "toLowerCase", depth0.acronym, options)))
    + "\"></i>\r\n                </a>\r\n            </div>\r\n            <div class=\"index-provider-title\">\r\n                <a href=\"";
  if (stack2 = helpers.context) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.context; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/providers/";
  if (stack2 = helpers.acronym) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.acronym; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n                    ";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n                </a>\r\n            </div>\r\n        </a>\r\n    </div>\r\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.providers, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["navbar/navbar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n                    <li class=\"navbar-user\">\r\n                        <a href=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/profile\" class=\"navbar-user-profile\" title=\"Perfil\">\r\n                        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.imageUrl), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                        "
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.username)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n                        </a>\r\n                        <a href=\"";
  if (stack2 = helpers.context) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.context; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/signout\" class=\"navbar-user-logout\" rel=\"tooltip\" title=\"Salir\"><i class=\"icon-logout-min-gray\"></i></a>\r\n                    </li>\r\n                ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                            <img src=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.imageUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"navbar-user-profile-avatar\">\r\n                        ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                            <img src=\"";
  if (stack1 = helpers.resourceContext) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.resourceContext; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/images/defaultUser.png\" class=\"navbar-user-profile-avatar\">\r\n                        ";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n                    <li><a class=\"navbar-signin\" href=\"#\"><strong>Iniciar sesión</strong></a></li>\r\n\r\n                    <li class=\"locale dropdown\">\r\n                        <a href=\"#\" class=\"dropdown-toggle navbar-lang\" data-toggle=\"dropdown\">\r\n                            "
    + escapeExpression(((stack1 = ((stack1 = depth0.currentLocale),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n                            <b class=\"caret\"></b>\r\n                        </a>\r\n                        <ul class=\"dropdown-menu\">\r\n                            ";
  stack2 = helpers.each.call(depth0, depth0.locales, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                        </ul>\r\n                    </li>\r\n                ";
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                            <li><a href=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/app/changeLocale?locale=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></li>\r\n                            ";
  return buffer;
  }

  buffer += "<div class=\"navbar-inner\">\r\n    <div class=\"container\">\r\n        <div class=\"header\">\r\n            <a class=\"btn btn-navbar\" data-toggle=\"collapse\" data-target=\".nav-collapse\">\r\n                <span class=\"icon-bar\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n            </a>\r\n\r\n            <div id=\"navbar-logo\">\r\n                <a href=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/\">\r\n                    <img src=\"";
  if (stack1 = helpers.resourceContext) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.resourceContext; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/images/s4yNavBarCut.png\" alt=\"Stat4you\" width=\"90\" height=\"31\"/>\r\n                </a>\r\n            </div>\r\n\r\n            <ul class=\"nav pull-right\">\r\n                ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.username), {hash:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </ul>\r\n\r\n            <div class=\"nav-collapse\">\r\n                <ul class=\"nav links\">\r\n                    <li><a href=\"";
  if (stack2 = helpers.context) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.context; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/providers/\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "navigation.providers", options) : helperMissing.call(depth0, "message", "navigation.providers", options)))
    + "</a></li>\r\n                    <li><a href=\"";
  if (stack2 = helpers.context) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.context; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/faq\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "navigation.faq", options) : helperMissing.call(depth0, "message", "navigation.faq", options)))
    + "</a></li>\r\n                    <li><a href=\"http://blog.stat4you.com\" target=\"_blank\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "navigation.blog", options) : helperMissing.call(depth0, "message", "navigation.blog", options)))
    + "</a></li>\r\n                </ul>\r\n\r\n                <form id=\"nav-search-form\" class=\"navbar-search pull-right\" action=\"";
  if (stack2 = helpers.context) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.context; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/search\">\r\n                    <input type=\"text\" name=\"query\" class=\"search-query-input\" placeholder=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "navigation.search.placeholder", options) : helperMissing.call(depth0, "message", "navigation.search.placeholder", options)))
    + "\" />\r\n                    <div class=\"icon-search-min\"></div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["profile/profile-read"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                <img src=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.imageUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n            ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                <img src=\"";
  if (stack1 = helpers.resourceContext) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.resourceContext; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/images/defaultUser.png\">\r\n            ";
  return buffer;
  }

  buffer += "<div class=\"row\">\r\n\r\n    <div class=\"span12 profile-header\">\r\n        <div class=\"row\">\r\n            <div class=\"span9\">\r\n            ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.imageUrl), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n            <h1>"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.surname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n                <small>("
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.username)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ")</small>\r\n            </h1>\r\n            </div>\r\n            <div class=\"span3 profile-actions-container\">\r\n                <a href=\"#update\" class=\"btn profile-update-btn\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.read.update-profile", options) : helperMissing.call(depth0, "message", "profile.read.update-profile", options)))
    + "</a>\r\n                <a href=\"";
  if (stack2 = helpers.context) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.context; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/signout\" class=\"btn profile-logout-btn\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.read.logout", options) : helperMissing.call(depth0, "message", "profile.read.logout", options)))
    + " <i class=\"icon-logout-min\"></i></a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"span6\">\r\n        <div class=\"s4y-box\">\r\n            <div class=\"s4y-box-header\">\r\n                <h2>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.read.information.title", options) : helperMissing.call(depth0, "message", "profile.read.information.title", options)))
    + "</h2>\r\n            </div>\r\n            <div class=\"s4y-box-container\">\r\n                <div>\r\n                    <dl>\r\n                        <dt>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.read.information.email", options) : helperMissing.call(depth0, "message", "profile.read.information.email", options)))
    + " :</dt>\r\n                        <dd>"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.mail)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</dd>\r\n                        <dt>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.read.information.memberSince", options) : helperMissing.call(depth0, "message", "profile.read.information.memberSince", options)))
    + " : </dt>\r\n                        <dd>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.date || depth0.date),stack1 ? stack1.call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.createdDate), options) : helperMissing.call(depth0, "date", ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.createdDate), options)))
    + "</dd>\r\n                    </dl>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"s4y-box\">\r\n            <div class=\"s4y-box-header\">\r\n                <h2>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.read.preferences.title", options) : helperMissing.call(depth0, "message", "profile.read.preferences.title", options)))
    + "</h2>\r\n            </div>\r\n            <div class=\"s4y-box-container\">\r\n                <div>\r\n                    <dl>\r\n                        <dt>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.read.preferences.language", options) : helperMissing.call(depth0, "message", "profile.read.preferences.language", options)))
    + " :</dt>\r\n                        <dd>"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.localeLabel)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</dd>\r\n                    </dl>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n\r\n    <div class=\"span6\">\r\n        <div class=\"s4y-box\">\r\n            <div class=\"s4y-box-header\">\r\n                <h2>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.read.favourites.title", options) : helperMissing.call(depth0, "message", "profile.read.favourites.title", options)))
    + "</h2>\r\n            </div>\r\n            <div class=\"s4y-box-container\">\r\n                <div class=\"favs\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["profile/profile-update"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n        <div class=\"profile-update-errors alert alert-error\">\r\n            ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.errors", options) : helperMissing.call(depth0, "message", "profile.update.errors", options)))
    + "\r\n        </div>\r\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "error";
  }

  buffer += "<div class=\"profile-edit\">\r\n    <h1>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.title", options) : helperMissing.call(depth0, "message", "profile.update.title", options)))
    + "</h1>\r\n\r\n    <form method=\"post\" class=\"form-horizontal profile-update-form\">\r\n\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, depth0.errors, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    <fieldset>\r\n        <legend>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.information.title", options) : helperMissing.call(depth0, "message", "profile.update.information.title", options)))
    + "</legend>\r\n\r\n        <div class=\"control-group ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.name), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\r\n            <label class=\"control-label\" for=\"name\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.information.name", options) : helperMissing.call(depth0, "message", "profile.update.information.name", options)))
    + " *</label>\r\n            <div class=\"controls\">\r\n                <input type=\"text\" class=\"input-xlarge\" id=\"name\" name=\"name\">\r\n                <span class=\"help-inline\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.errors || depth0.errors),stack1 ? stack1.call(depth0, ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.name), options) : helperMissing.call(depth0, "errors", ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.name), options)))
    + "</span>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"control-group ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.surname), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\r\n            <label class=\"control-label\" for=\"surname\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.information.surname", options) : helperMissing.call(depth0, "message", "profile.update.information.surname", options)))
    + "</label>\r\n            <div class=\"controls\">\r\n                <input type=\"text\" class=\"input-xlarge\" id=\"surname\" name=\"surname\">\r\n                <span class=\"help-inline\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.errors || depth0.errors),stack1 ? stack1.call(depth0, ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.surname), options) : helperMissing.call(depth0, "errors", ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.surname), options)))
    + "</span>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"control-group ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.username), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\r\n            <label class=\"control-label\" for=\"username\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.information.username", options) : helperMissing.call(depth0, "message", "profile.update.information.username", options)))
    + " *</label>\r\n            <div class=\"controls\">\r\n                <input type=\"text\" class=\"input-xlarge\" id=\"username\" name=\"username\">\r\n                <span class=\"help-inline\">";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.errors || depth0.errors),stack1 ? stack1.call(depth0, ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.username), options) : helperMissing.call(depth0, "errors", ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.username), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"control-group ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.mail), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\r\n            <label class=\"control-label\" for=\"mail\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.information.mail", options) : helperMissing.call(depth0, "message", "profile.update.information.mail", options)))
    + "</label>\r\n            <div class=\"controls\">\r\n                <input type=\"text\" class=\"input-xlarge\" id=\"mail\" name=\"mail\">\r\n                <span class=\"help-inline\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.errors || depth0.errors),stack1 ? stack1.call(depth0, ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.mail), options) : helperMissing.call(depth0, "errors", ((stack1 = depth0.errors),stack1 == null || stack1 === false ? stack1 : stack1.mail), options)))
    + "</span>\r\n            </div>\r\n        </div>\r\n\r\n    </fieldset>\r\n\r\n    <fieldset>\r\n        <legend>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.preferences.title", options) : helperMissing.call(depth0, "message", "profile.update.preferences.title", options)))
    + "</legend>\r\n\r\n        <div class=\"control-group\">\r\n            <label class=\"control-label\" for=\"lang\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.preferences.language", options) : helperMissing.call(depth0, "message", "profile.update.preferences.language", options)))
    + "</label>\r\n            <div class=\"controls\">\r\n                <select name=\"locale\" id=\"lang\">\r\n                    <option value=\"es\">Español</option>\r\n                    <option value=\"en\">Inglés</option>\r\n                    <option value=\"ca\">Catalán</option>\r\n                    <option value=\"eu\">Euskera</option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"control-group\">\r\n            <div class=\"controls\">\r\n                <label class=\"checkbox\">\r\n                    <input type=\"checkbox\" name=\"platformNotification\" value=\"true\">\r\n                    ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.preferences.notifications.platform.label", options) : helperMissing.call(depth0, "message", "profile.update.preferences.notifications.platform.label", options)))
    + "\r\n                </label>\r\n            </div>\r\n        </div>\r\n\r\n\r\n    </fieldset>\r\n\r\n    <div class=\"form-actions\">\r\n        <input type=\"submit\" class=\"btn btn-primary\" value=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.preferences.update", options) : helperMissing.call(depth0, "message", "profile.update.preferences.update", options)))
    + "\">\r\n        <a class=\"btn profile-update-cancel\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "profile.update.preferences.cancel", options) : helperMissing.call(depth0, "message", "profile.update.preferences.cancel", options)))
    + "</a>\r\n    </div>\r\n    </form>\r\n\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["providers/provider-active-provider"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n    <img alt=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.activeProvider),stack1 == null || stack1 === false ? stack1 : stack1.acronym)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" src=\"";
  if (stack2 = helpers.resourceContext) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.resourceContext; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "images/logos/";
  if (stack2 = helpers.logo) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.logo; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" />\r\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <img alt=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.providers.logo.notFound", options) : helperMissing.call(depth0, "message", "page.providers.logo.notFound", options)))
    + "\" src=\"";
  if (stack2 = helpers.resourceContext) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.resourceContext; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "images/logos/bocadillo_r_w200_t2.png\" />\r\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.logo, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["providers/provider-page"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n            <p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.iString || depth0.iString),stack1 ? stack1.call(depth0, ((stack1 = depth0.provider),stack1 == null || stack1 === false ? stack1 : stack1.description), options) : helperMissing.call(depth0, "iString", ((stack1 = depth0.provider),stack1 == null || stack1 === false ? stack1 : stack1.description), options)))
    + "</p>\r\n        ";
  return buffer;
  }

  buffer += "<div id=\"first-row-internal-page\" class=\"row\">\r\n    <div class=\"search-active-provider search-s4y-img span3\">\r\n        <!-- <img src=\"/stat4you-web/theme/images/stat4you.png\" alt=\"stat4you\">-->\r\n    </div>\r\n    <div class=\"span9\" id=\"search-bar\">\r\n        <form class=\"search-form search\" method=\"GET\" action=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/search\">\r\n            <div class=\"search-box\">\r\n                <input type=\"text\" name=\"query\" class=\"search-form-query\" placeholder='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.provider.search.placeholder", options) : helperMissing.call(depth0, "message", "page.provider.search.placeholder", options)))
    + "'/>\r\n            </div>\r\n            <div class=\"search-button\">\r\n                <input class=\"btn btn-primary\" type=\"submit\" value=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.search.button", options) : helperMissing.call(depth0, "message", "page.search.button", options)))
    + "\" />\r\n            </div>\r\n            <input type=\"hidden\" name=\"ff_ds_prov_acronym\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.provider),stack1 == null || stack1 === false ? stack1 : stack1.acronym)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n        </form>\r\n    </div>\r\n</div>\r\n\r\n<div id=\"first-row-providers\" class=\"row\">\r\n    <div class=\"span12 provider-full-description\">\r\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.provider),stack1 == null || stack1 === false ? stack1 : stack1.description), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n    <div class=\"providers-item span4\">\r\n        <div class=\"provider\">\r\n        \r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"span8\">\r\n        <div class=\"s4y-box\">\r\n            <div class=\"s4y-box-header\">\r\n                <h2>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.provider.lastUpdatedDatasets", options) : helperMissing.call(depth0, "message", "entity.provider.lastUpdatedDatasets", options)))
    + "</h2>\r\n            </div>\r\n            <div class=\"s4y-box-container\">\r\n                <div class=\"datasets-list\">\r\n        \r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["providers/provider"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <p><strong>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</strong></p>\r\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <p><em> ";
  if (stack1 = helpers.acronym) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.acronym; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " </em></p>\r\n        ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <p><a target=\"_blank\" href=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></p>\r\n        ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n            <p><strong>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.provider.address", options) : helperMissing.call(depth0, "message", "entity.provider.address", options)))
    + "</strong><br /> ";
  if (stack2 = helpers.address) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.address; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</p>\r\n        ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n            <p><strong>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.provider.license", options) : helperMissing.call(depth0, "message", "entity.provider.license", options)))
    + "</strong><br /> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.iString || depth0.iString),stack1 ? stack1.call(depth0, depth0.license, options) : helperMissing.call(depth0, "iString", depth0.license, options)))
    + "</p>\r\n        ";
  return buffer;
  }

  buffer += "<div class=\"s4y-box\">\r\n    <div class=\"s4y-box-header\">\r\n        <h2>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "entity.provider.data", options) : helperMissing.call(depth0, "message", "entity.provider.data", options)))
    + "</h2>\r\n    </div>\r\n    <div class=\"s4y-box-container\">\r\n        ";
  stack2 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        ";
  stack2 = helpers['if'].call(depth0, depth0.acronym, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        ";
  stack2 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        ";
  stack2 = helpers['if'].call(depth0, depth0.address, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        ";
  stack2 = helpers['if'].call(depth0, depth0.license, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n</div>\r\n";
  return buffer;
  });

this["Handlebars"]["templates"]["providers/providers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n                    <div class=\"provider\">\r\n                        <a href=\"";
  if (stack1 = helpers.acronym) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.acronym; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"provider-logo provider-logo-";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toLowerCase || depth0.toLowerCase),stack1 ? stack1.call(depth0, depth0.acronym, options) : helperMissing.call(depth0, "toLowerCase", depth0.acronym, options)))
    + "\"></a>\r\n                        <div class=\"provider-info\">\r\n                            <a href=\"";
  if (stack2 = helpers.acronym) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.acronym; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n                                <p>";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</p>\r\n                            </a>\r\n                            <span class=\"provider-acronym\">";
  if (stack2 = helpers.acronym) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.acronym; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\r\n                            <div class=\"provider-description\">\r\n                                <span>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.iString || depth0.iString),stack1 ? stack1.call(depth0, depth0.description, options) : helperMissing.call(depth0, "iString", depth0.description, options)))
    + "</span>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                ";
  return buffer;
  }

  buffer += "<div id=\"first-row-internal-page\" class=\"row\">\r\n    <div class=\"internal-page-header span12\">\r\n        <div class=\"internal-page-title\">\r\n            <h2>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.providers.title", options) : helperMissing.call(depth0, "message", "page.providers.title", options)))
    + "</h2>\r\n        </div>\r\n        <div class=\"internal-page-description\">\r\n            <p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.providers.description", options) : helperMissing.call(depth0, "message", "page.providers.description", options)))
    + "</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n    <div class=\"span12\">\r\n        <div class=\"providers-container\">\r\n             <div id=\"provider-list\">\r\n                ";
  stack2 = helpers.each.call(depth0, depth0.providers, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["search/search-active-provider"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.activeProvider),stack1 == null || stack1 === false ? stack1 : stack1.logo), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n        <img alt=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.activeProvider),stack1 == null || stack1 === false ? stack1 : stack1.acronym)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" src=\"";
  if (stack2 = helpers.resourceContext) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.resourceContext; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "images/logos/"
    + escapeExpression(((stack1 = ((stack1 = depth0.activeProvider),stack1 == null || stack1 === false ? stack1 : stack1.logo)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <img alt=\"stat4you\" src=\"";
  if (stack1 = helpers.resourceContext) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.resourceContext; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "images/stat4you.png\" />\r\n    ";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <img alt=\"stat4you\" src=\"";
  if (stack1 = helpers.resourceContext) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.resourceContext; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "images/stat4you.png\" />\r\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.visible, {hash:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Handlebars"]["templates"]["search/search-facets"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        ";
  stack1 = helpers.each.call(depth0, depth0.constraints, {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  return buffer;
  }
function program2(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n            <div class=\"facet-constraints facet-constraints-chosen facet-constraints-filter\" data-fieldname=\""
    + escapeExpression(((stack1 = depth1.fieldName),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-code=\"";
  if (stack2 = helpers.code) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.code; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n                ";
  stack2 = helpers['if'].call(depth0, depth0.selected, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                <a class=\"constraint\" href=\"#\">";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</a>\r\n            </div>\r\n        ";
  return buffer;
  }
function program3(depth0,data) {
  
  
  return "\r\n                    <div class=\"checkbox\"></div>\r\n                ";
  }

function program5(depth0,data) {
  
  
  return "\r\n                    <div class=\"checkboxUnMarked\"></div>\r\n                ";
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <div class=\"search-subtitle\">\r\n            <span class=\"search-subtitle-text\">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n            ";
  stack1 = helpers['if'].call(depth0, depth0.limited, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n        </div>\r\n\r\n        ";
  stack1 = helpers.each.call(depth0, depth0.constraints, {hash:{},inverse:self.noop,fn:self.programWithDepth(13, program13, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n        ";
  stack1 = helpers['if'].call(depth0, depth0.limited, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                ";
  stack1 = helpers['if'].call(depth0, depth0.showingNone, {hash:{},inverse:self.programWithDepth(11, program11, data, depth0),fn:self.programWithDepth(9, program9, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            ";
  return buffer;
  }
function program9(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n                    <a href=\"#\" class=\"facet-constraints-less\" data-fieldname=\""
    + escapeExpression(((stack1 = depth1.fieldName),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                        <img class=\"blue-cross\" src=\"";
  if (stack2 = helpers.resourceContext) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.resourceContext; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "images/showMore.png\" />\r\n                    </a>\r\n                ";
  return buffer;
  }

function program11(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n                    <a href=\"#\" class=\"facet-constraints-none\" data-fieldname=\""
    + escapeExpression(((stack1 = depth1.fieldName),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                        <img class=\"blue-cross\" src=\"";
  if (stack2 = helpers.resourceContext) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.resourceContext; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "images/showLess.png\" />\r\n                    </a>\r\n                ";
  return buffer;
  }

function program13(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n            <div class=\"facet-constraints facet-constraints-filter\" data-fieldname=\""
    + escapeExpression(((stack1 = depth1.fieldName),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-code=\"";
  if (stack2 = helpers.code) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.code; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n                ";
  stack2 = helpers['if'].call(depth0, depth0.selected, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                <a class=\"constraint\" href=\"#\">";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " (";
  if (stack2 = helpers.count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ")</a>\r\n             </div>\r\n        ";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            ";
  stack1 = helpers['if'].call(depth0, depth0.showingAll, {hash:{},inverse:self.program(18, program18, data),fn:self.programWithDepth(16, program16, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n        ";
  return buffer;
  }
function program16(depth0,data,depth1) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n                <a href=\"#\" class=\"limited facet-constraints-less\" data-fieldname=\""
    + escapeExpression(((stack1 = depth1.fieldName),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth1.message),stack1 ? stack1.call(depth0, "page.search.facet.less", options) : helperMissing.call(depth0, "message", "page.search.facet.less", options)))
    + "</a>\r\n            ";
  return buffer;
  }

function program18(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                ";
  stack1 = helpers.unless.call(depth0, depth0.showingNone, {hash:{},inverse:self.noop,fn:self.programWithDepth(19, program19, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            ";
  return buffer;
  }
function program19(depth0,data,depth1) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n                    <a href=\"#\" class=\"limited facet-constraints-more\" data-fieldname=\""
    + escapeExpression(((stack1 = depth1.fieldName),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth1.message),stack1 ? stack1.call(depth0, "page.search.facet.more", options) : helperMissing.call(depth0, "message", "page.search.facet.more", options)))
    + "</a>\r\n                ";
  return buffer;
  }

  buffer += "<div class=\"search-facet\">\r\n    <div id=\"search-title-chosen\" class=\"search-title\">\r\n        <span class=\"search-title-text\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.search.facets.chosen", options) : helperMissing.call(depth0, "message", "page.search.facets.chosen", options)))
    + "</span>\r\n    </div>\r\n    ";
  stack2 = helpers.each.call(depth0, depth0.selectedFacets, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</div>\r\n\r\n\r\n<div class=\"search-facet\">\r\n    <div id=\"search-title-filters\" class=\"search-title\">\r\n        <span class=\"search-title-text\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.search.facet.filterby", options) : helperMissing.call(depth0, "message", "page.search.facet.filterby", options)))
    + "</span>\r\n    </div>\r\n\r\n    ";
  stack2 = helpers.each.call(depth0, depth0.facets, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["search/search-header"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div id=\"first-row-internal-page\" class=\"row\">\n    <div class=\"search-active-provider search-s4y-img span3\">\n\n    </div>\n    <div id=\"search-bar\" class=\"span9\">\n        <form class=\"search-form\">\n            <div class=\"search-box\">\n                <input class=\"search-form-query\" type=\"text\" name=\"q\"/>\n            </div>\n            <div class=\"search-button\">\n                <input id=\"search-button\" class=\"btn btn-primary\" type=\"submit\" value=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.search.button", options) : helperMissing.call(depth0, "message", "page.search.button", options)))
    + "\" />\n            </div>\n        </form>\n    </div>\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["search/search-infinitescroll"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n    <p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.search.result.infinite.loading", options) : helperMissing.call(depth0, "message", "page.search.result.infinite.loading", options)))
    + "</p>\r\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n    <p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.search.result.infinite.loadMore", options) : helperMissing.call(depth0, "message", "page.search.result.infinite.loadMore", options)))
    + "</p>\r\n";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.search.result.infinite.noMore", options) : helperMissing.call(depth0, "message", "page.search.result.infinite.noMore", options)))
    + "</p>\r\n    <p><a href=\"";
  if (stack2 = helpers.context) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.context; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/datasetrequest\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.search.result.infinite.datasetRequest", options) : helperMissing.call(depth0, "message", "page.search.result.infinite.datasetRequest", options)))
    + "</a></p>\r\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.loading, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.loadMore, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.noMore, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n\r\n\r\n";
  return buffer;
  });

this["Handlebars"]["templates"]["search/search-page"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"search-header\">\r\n\r\n</div>\r\n<div class=\"search-results\">\r\n    <div id=\"search-info-text\" class=\"row\">\r\n        <div class=\"span12 search-results-info\">\r\n\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n        <div class=\"span9\">\r\n            <div id=\"search-result-list\"></div>\r\n            <div class=\"infiniteScroll\"></div>\r\n        </div>\r\n        <div id=\"search-facets\" class=\"span3\">\r\n            <div class=\"facet-container\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
  });

this["Handlebars"]["templates"]["search/search-result"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n                <span class=\"search-date search-fancy-date\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.search.result.pubdate", options) : helperMissing.call(depth0, "message", "page.search.result.pubdate", options)))
    + " : ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.date || depth0.date),stack1 ? stack1.call(depth0, depth0.providerPublishingDate, options) : helperMissing.call(depth0, "date", depth0.providerPublishingDate, options)))
    + "</span>\r\n                ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                <span class=\"search-date search-fancy-date\"><a href=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/providers/";
  if (stack1 = helpers.providerAcronym) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.providerAcronym; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.providerAcronym) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.providerAcronym; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></span>\r\n                ";
  return buffer;
  }

  buffer += "<div class=\"row\">\r\n    <div class=\"search-result search-fancy-result span9\">\r\n        <i class=\"logo_c provider-logo-min-";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toLowerCase || depth0.toLowerCase),stack1 ? stack1.call(depth0, depth0.providerAcronym, options) : helperMissing.call(depth0, "toLowerCase", depth0.providerAcronym, options)))
    + "\"></i>\r\n        <div class=\"search-fancy-result-info \">\r\n            <div class=\"search-result-info \">\r\n                <span class=\"search-title search-fancy-title\"><a href=\"";
  if (stack2 = helpers.context) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.context; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/providers/";
  if (stack2 = helpers.providerAcronym) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.providerAcronym; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/datasets/";
  if (stack2 = helpers.identifier) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.identifier; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">";
  if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.title; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</a></span>\r\n                ";
  stack2 = helpers['if'].call(depth0, depth0.providerPublishingDate, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n                ";
  stack2 = helpers['if'].call(depth0, depth0.providerAcronym, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["search/search-results-info"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "page.search.result.numFound", options) : helperMissing.call(depth0, "message", "page.search.result.numFound", options)))
    + ": <span class=\"search-result-text\">";
  if (stack2 = helpers.total) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.total; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></p>";
  return buffer;
  });

this["Handlebars"]["templates"]["signin/signin"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"signin-social-container simpleLayout-content-inner\">\n    <h3 class=\"signin-title\">";
  if (stack1 = helpers.msg) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.msg; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\n\n    <div class=\"signin-social-forms\">\n        <form action=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/signin/twitter\" method=\"POST\" class=\"signin-social-form\">\n            <input type=\"hidden\" name=\"redirectUrl\" value=\"";
  if (stack1 = helpers.redirectUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.redirectUrl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n            <a class=\"icon-social-container\" href=\"#\" data-provider=\"twitter\">\n                <i class=\"icon-twitter\"></i>\n            </a>\n        </form>\n\n        <form action=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/signin/facebook\" method=\"POST\" class=\"signin-social-form\">\n            <input type=\"hidden\" name=\"redirectUrl\" value=\"";
  if (stack1 = helpers.redirectUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.redirectUrl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n            <input type=\"hidden\" name=\"scope\" value=\"email\"/>\n            <a class=\"icon-social-container\" href=\"#\" data-provider=\"facebook\">\n                <i class=\"icon-facebook\"></i>\n            </a>\n        </form>\n\n        <form action=\"";
  if (stack1 = helpers.context) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.context; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/signin/google\" method=\"POST\" class=\"signin-social-form\">\n            <input type=\"hidden\" name=\"redirectUrl\" value=\"";
  if (stack1 = helpers.redirectUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.redirectUrl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n            <input type=\"hidden\" name=\"scope\"\n                   value=\"https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo#email https://www.googleapis.com/auth/plus.me\"/>\n            <a class=\"icon-social-container\" href=\"#\" data-provider=\"google\">\n                <i class=\"icon-google\"></i>\n            </a>\n        </form>\n    </div>\n\n    <div class=\"signin-tip\">Accede siempre con la misma red social</div>\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["widget/filter/popup/filter-column-containers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/popup/filter-dimension-categories"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/popup/filter-dimension-checkbox"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/popup/filter-dimension"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/popup/filter-external-container"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/popup/filter-line-containers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/popup/filter-map-containers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/popup/filter-pie-containers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/popup/filter-table-containers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/sidebar/filter-order-view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/sidebar/filter-sidebar-category"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/sidebar/filter-sidebar-dimension-actions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["widget/filter/sidebar/filter-sidebar-dimension"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
    + "\n        </div>\n    </div>\n\n    <div class=\"collapse ";
  stack2 = helpers.unless.call(depth0, ((stack1 = depth0.dimension),stack1 == null || stack1 === false ? stack1 : stack1.open), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" >\n        <div class=\"filter-sidebar-dimension-searchbar\"></div>\n\n        <div class=\"filter-sidebar-dimension-actionsbar\">\n            <div class=\"filter-sidebar-dimension-levels\"></div>\n            <div class=\"filter-sidebar-dimension-actions\"></div>\n        </div>\n\n        <div class=\"filter-sidebar-categories\"></div>\n    </div>\n\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["widget/filter/sidebar/filter-sidebar-view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"filter-sidebar\" id=\"filter-sidebar\">\n    <div class=\"filter-sidebar-search\"></div>\n    <div class=\"filter-sidebar-dimensions\"></div>\n</div>";
  });

this["Handlebars"]["templates"]["widget/map/map-error"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"map-error-container\">\n    <div class=\"map-error\">\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.message || depth0.message),stack1 ? stack1.call(depth0, "ve.map.nomap", options) : helperMissing.call(depth0, "message", "ve.map.nomap", options)))
    + "\n    </div>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["widget/map/map-ranges"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<span class=\"ranges-selector-title\">Rangos</span>\r\n<div id=\"line-container\">\r\n    <div id=\"line\"></div>\r\n    <div id=\"draggable\"></div>\r\n    <span class=\"ranges-boundaries\">1</span>\r\n    <span class=\"ranges-boundaries right-boundary\">10</span>\r\n</div>\r\n";
  });

this["Handlebars"]["templates"]["widget/map/map-zoom"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"exit-zoom\" class=\"zoom-controls\"></div>\r\n<div id=\"more-zoom\" class=\"zoom-controls\"></div>\r\n<div id=\"less-zoom\" class=\"zoom-controls\"></div>\r\n<div id=\"zoom-line\"></div>\r\n<div id=\"current-zoom\"></div>";
  });