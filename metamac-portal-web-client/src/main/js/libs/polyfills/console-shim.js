/* console shim 
* http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
*/
(function () {
    var f = function () {};
    if (!window.console) {
        window.console = {
            log:f, info:f, warn:f, debug:f, error:f
        };
    }
}());