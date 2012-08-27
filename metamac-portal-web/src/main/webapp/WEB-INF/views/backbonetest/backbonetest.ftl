[#ftl]
[#include "/inc/includes.ftl"]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link href="http://twitter.github.com/bootstrap/assets/css/bootstrap.css" rel="stylesheet">
    
  </head>
<body>

<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.1/underscore-min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.1/backbone-min.js"></script>

<div id="localeViewEs"></div>
<div id="localeViewEn"></div>

<script>

var LocaleView = Backbone.View.extend({
	template : _.template("<%=locale.hi %> <%= username %>"),
	render : function(){
		$(this.el).html(this.template({locale : this.options.locale, username : 'axelhzf'}));
	}
});

var locales = {
	en : {
		hi : 'hi'
	},
	es : {
		hi : 'hola'
	}
}

var localeViewEs = new LocaleView({el : $('#localeViewEs'), locale : locales.es}); 
var localeViewEn = new LocaleView({el : $('#localeViewEn'), locale : locales.en});

localeViewEs.render();
localeViewEn.render();

</script>

<div id="view1"></div>
<div id="view2"></div>

<script>
	//Prueba de plantillas externas

	//Plantillas asincronas	
	var fetchTemplate = function(path, done) {
      var JST = window.JST = window.JST || {};

      if (JST[path]) {
        done(JST[path]);
      }

      $.get(path, function(contents) {
        var tmpl = _.template(contents);
        JST[path] = tmpl;
        done(tmpl);
      }, "text");
    };
	
	
	var View = Backbone.View.extend({
		
		initialize : function(params){
			_.bindAll( this, 'render' )
		},
		
		render : function(){
			var view = this;
			fetchTemplate(view.options.tmplPath, function(tmpl){
				view.el.innerHTML = tmpl({variable : 'variable123'});
			});
		}
	});
	
	// Utilizar extensión .jst paras vistas? la configuración actual no lo permite
	var view1 = new View({tmplPath : "[@spring.url "/theme/jst/view1.html" /]", el : $("#view1")});
	var view2 = new View({tmplPath : "[@spring.url "/theme/jst/view2.html" /]", el : $("#view2")});
	
	view1.render();
	view2.render();
</script>

</body>
</html>