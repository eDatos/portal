function ContextStub() {
    var self = this;
    var emptyFunction = function () {};
    _.each(['clearRect', 'fillText', 'beginPath', 'rect', 'fill',
        'closePath', 'save', 'restore', 'clip', 'moveTo', 'lineTo', 'stroke'], function (method) {
        self[method] = emptyFunction;
    });
}

function CanvasStub () {
    this.getContext = function () { return new ContextStub(); };
}