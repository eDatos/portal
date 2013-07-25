(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.FullScreen");

    STAT4YOU.FullScreen = function (options) {
        this.initialize(options);
    };

    var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

    STAT4YOU.FullScreen.prototype = {

        FS_RESIZE_DELAY : 300,

        events : {
            change : 'fullscreenchange webkitfullscreenchange mozfullscreenchange',
            error : 'mozfullscreenerror webkitfullscreenerror'
        },

        initialize : function (options) {
            if (options.container instanceof $) {
                this.$container = options.container;
            } else {
                this.$container = $(options.container);
            }
            this.container = this.$container[0];
            this.$document = $(document);

            _.bindAll(this, "exitFullScreen", "_keydown", "_didExitFullScreen");
        },

        _getRequestFullScreen : function () {
            return this.container.requestFullscreen
                || this.container.webkitRequestFullScreen
                || this.container.mozRequestFullScreen
                || this.container.msRequestFullScreen;
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
            this._getRequestFullScreen().call(this.container, keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
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
                this.$container.addClass('full-screen-no-support');
                $('.navbar-fixed-top').css('position', 'static');
            } else {
                this.$container.addClass('full-screen');
            }
        },

        _removeFullScreenCss : function () {
            if (!this.browserHasFullScreenSupport()) {
                this.$container.removeClass('full-screen-no-support');
                $('.navbar-fixed-top').css('position', 'fixed');
            } else {
                this.$container.removeClass('full-screen');
            }
        }

    };

    _.extend(STAT4YOU.FullScreen.prototype, Backbone.Events);

}());
