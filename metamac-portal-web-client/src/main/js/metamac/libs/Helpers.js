(function () {
	"use strict";

	App.namespace('App.Helpers');

	App.Helpers = {
		getHostname: function (url) {
			var l = document.createElement("a");
			l.href = url;
			return l.hostname;
		}
	};

}());