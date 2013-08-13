(function () {
    "use strict";

    App.namespace("App.FullScreen");

    App.FullScreen = function (options) {
        this.initialize(options);
    };

    var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

    App.FullScreen.prototype = {

        FS_RESIZE_DELAY : 300,

        events : {
            change : 'fullscreenchange webkitfullscreenchange mozfullscreenchange',
            error : 'mozfullscreenerror webkitfullscreenerror'
        },

        initialize : function (options) {
            options || (options = {});
            if (_.has(options, 'container')) {
                this.setContainer(options.container);
            }
            this.$document = $(document);
            _.bindAll(this, "exitFullScreen", "_keydown", "_didExitFullScreen");
        },

        setContainer : function (container) {
            if (container instanceof $) {
                this.$container = container;
            } else {
                this.$container = $(container);
            }
            this.container = this.$container[0];
        },

        getContainer : function () {
            return this.container;
        },

        get$Container : function () {
            return this.$container;
        },

        _getRequestFullScreen : function () {
            return this.getContainer().requestFullscreen
                || this.getContainer().webkitRequestFullScreen
                || this.getContainer().mozRequestFullScreen
                || this.getContainer().msRequestFullScreen;
        },

        _getRequestExitFullScreen : function () {
            return document.exitFullscreen ||
                document.mozCancelFullScreen ||
                document.webkitCancelFullScreen;
        },

        browserHasFullScreenSupport : function () {
            var requestFS = this._getRequestFullScreen();
            return !_.isUndefined(requestFS);
        },

        _enterFullScreenSupport : function () {
            this._getRequestFullScreen().call(this.getContainer(), keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
            this._setFullScreenCss();
        },

        _enterFullScreenNoSupport : function () {
            this._setFullScreenCss();
        },

        enterFullScreen : function () {
            var self = this;
            this.trigger('willEnterFullScreen');
            if (this.browserHasFullScreenSupport()) {
                var fn = function () {
                    setTimeout(function () {
                        self.$document.unbind(self.events.change, fn);
                        self.trigger('didEnterFullScreen');
                        self._addExitFullScreenListeners();
                    }, this.FS_RESIZE_DELAY); // time out for wait browser animation
                };
                self.$document.bind(self.events.change, fn);
                self._enterFullScreenSupport();
            } else {
                self._enterFullScreenNoSupport();
                self._addExitFullScreenListeners();
                self.trigger('didEnterFullScreen');
            }
        },

        _addExitFullScreenListeners : function () {
            if (this.browserHasFullScreenSupport()) {
                this.$document.bind(this.events.change, this._didExitFullScreen);
                this.$document.bind(this.events.error, this._didExitFullScreen);
            } else {
                this.$document.bind('keydown', this._keydown);
            }
        },

        _removeExitFullScreenListeners : function () {
            this.$document.unbind(this.events.change, this._didExitFullScreen);
            this.$document.unbind(this.events.error, this._didExitFullScreen);
            this.$document.unbind('keydown', this._keydown);
        },

        _keydown : function (e) {
            if (e.which === 27) {  //ESC code
                this.exitFullScreen();
            }
        },

        exitFullScreen : function () {
            this.trigger('willExitFullScreen');
            if (this.browserHasFullScreenSupport()) {
                this._exitFullScreenSupport();
            } else {
                this._exitFullScreenNoSupport();
            }
        },

        _exitFullScreenSupport : function () {
            var method = this._getRequestExitFullScreen();
            method.call(document);
        },

        _exitFullScreenNoSupport : function () {
            this._didExitFullScreen();
        },

        _didExitFullScreen : function () {
            var self = this;
            setTimeout(function () {
                self._removeFullScreenCss();
                self._removeExitFullScreenListeners();
                self.trigger('didExitFullScreen');
            }, this.FS_RESIZE_DELAY);
        },

        _setFullScreenCss : function () {
            if (!this.browserHasFullScreenSupport()) {
                this.get$Container().addClass('full-screen-no-support');
                $('.navbar-fixed-top').css('position', 'static');
            } else {
                this.get$Container().addClass('full-screen');
            }
        },

        _removeFullScreenCss : function () {
            if (!this.browserHasFullScreenSupport()) {
                this.get$Container().removeClass('full-screen-no-support');
                $('.navbar-fixed-top').css('position', 'fixed');
            } else {
                this.get$Container().removeClass('full-screen');
            }
        }

    };

    _.extend(App.FullScreen.prototype, Backbone.Events);

}());
