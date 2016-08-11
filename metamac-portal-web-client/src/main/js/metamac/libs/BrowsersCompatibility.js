(function () {
    "use strict";

    App.namespace('App.BrowsersCompatibility');

    App.BrowsersCompatibility = {	
		checkIEcondition : function(condition) {
			var test = document.createElement('div');
			test.innerHTML = '<!--[if ' + condition + ']>1<![endif]-->';

			return '1' === test.innerHTML;
		},

		isIE : function() {
			var ie11 = !!navigator.userAgent.match(/Trident\/7.0/);	
			return ie11 || this.checkIEcondition('IE');
		},
		
		/* http://stackoverflow.com/questions/9809351/ie8-css-font-face-fonts-only-working-for-before-content-on-over-and-sometimes */
        forceFontsRepaint : function () {
			if (this.isIE()) {
            	var head = document.getElementsByTagName('head')[0];
            	var style = document.createElement('style');
				style.type = 'text/css';
				style.appendChild(document.createTextNode(':before,:after{ content:none !important; }'));
				head.appendChild(style);
				setTimeout(function(){
    				head.removeChild(style);
				}, 100);
			}
        }
    };

}());