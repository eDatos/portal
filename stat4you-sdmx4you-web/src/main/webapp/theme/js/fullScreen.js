   
    /* Versión reducida */
    function enterFullScreen(contanierId) {
        var el = document.querySelector('#'+contanierId);
        var chartContainer = document.querySelector('#'+contanierId+'>.chart-container');
        var idParentElem = chartContainer.id;
        // Initializing variables
        var oldHeightParent = jQuery('#'+idParentElem).css("height");
        var oldHeightContainer = jQuery('#'+contanierId).css("height");
        var oldWidth = jQuery('#'+contanierId).css("width");
        var oldMarginTop = jQuery('#'+contanierId).css("margin-top", "0");
        var oldBackgroundColor = jQuery('#'+contanierId).css("background-color");

        var rfs = // for newer Webkit and Firefox
                   el.requestFullScreen
                || el.webkitRequestFullScreen
                || el.mozRequestFullScreen
                || el.msRequestFullScreen
                ;


        // *** Loading fullScreen ***
        // Calling the fullScreen 
        if(typeof rfs!="undefined" && rfs){
            rfs.call(el);
            // Setting the new height in all the cases
            newCss();
        }
        /* -- Internet Explorer --*/
        else {
            internetExplorerFS();
        }
        
        
        
        
        
        // *** Listeners ***
        // Preparen the exit (General)
        document.addEventListener("fullscreenchange", function(event) {
            restoreCss();
            resizeHighCharts();
        }, false);
        
        // Preparing the exit (Chrome)
        document.addEventListener("webkitfullscreenchange", function(event) {
            if (!document.webkitIsFullScreen) { // Not necessary here ( we have already loaded full screen)
                restoreCss();
                resizeHighCharts();
            }
            
        }, false);
        
        // Preparing the exit (Firefox)
        document.addEventListener("mozfullscreenchange", function(event) {
            // There won't be more changes unless it is exitFullScreen
            restoreCss();
            resizeHighCharts();
        }, false);
        
        
        // Internet Explorer Full screen (manual implementation)
        function internetExplorerFS() {
            /* Keeping the old values safe */
            var oldPosition = jQuery('#'+contanierId).css("position");
            var oldTop = jQuery('#'+contanierId).css("top");
            var oldRight = jQuery('#'+contanierId).css("right");
            var oldBottom = jQuery('#'+contanierId).css("bottom");
            var oldLeft = jQuery('#'+contanierId).css("left");
            var oldZindex = jQuery('#'+contanierId).css("z-index");
            /* Setting the DIV position: absolute and 0 to right, left,...*/
            jQuery('#'+contanierId).css("position", "fixed");
            jQuery('#'+contanierId).css("top", "0");
            jQuery('#'+contanierId).css("right", "0");
            jQuery('#'+contanierId).css("bottom", "0");
            jQuery('#'+contanierId).css("left", "0");
            jQuery('#'+contanierId).css("z-index", "1");
            newCss();
            /* Resizing */
            resizeHighCharts();
            /* Keydown listener to exit */
            document.addEventListener('keydown', function(e) {
                 switch (e.keyCode) {
                   default: // ESC is 27
                        /* Setting the DIV position: absolute and 0 to right, left,...*/
                        restoreCss();
                        resizeHighCharts();
                        jQuery('#'+contanierId).css("position", oldPosition);
                        jQuery('#'+contanierId).css("top", oldTop);
                        jQuery('#'+contanierId).css("right", oldRight);
                        jQuery('#'+contanierId).css("bottom", oldBottom);
                        jQuery('#'+contanierId).css("left", oldLeft);
                        jQuery('#'+contanierId).css("z-index", oldZindex);
                     break;
                 }
               }, false);
        }
        
        /* Resizing the PieChart */
        function resizeHighCharts() {
            var width = jQuery('#'+idParentElem).css("width");
            width = parseInt(width.substring(0, width.length - 2));
            var height = jQuery('#'+idParentElem).css("height");
            height = parseInt(height.substring(0, height.length - 2));
            /* Changing the size to the selected chart */
            switch(contanierId) {
                case 'container':
                    //chart6.destroy();
                    chart = new Highcharts.Chart(optionsC6);
                break;
                case 'container2':
                    //chart7.destroy();
                    chart7 = new Highcharts.Chart(optionsC7);
                break;
                case 'container3':
                    optionsC8.setSize(width, height);
                break;
                case 'container4':
                    //chart9.destroy();
                    chart9 = new Highcharts.Chart(optionsC9);
                break;
            }
        }
        
        function newCss() {
            jQuery('#'+contanierId).css("background-color", "#fff");
            jQuery('#'+contanierId).css("margin-top", "0");
            jQuery('#'+contanierId).css("width", "100%");
            jQuery('#'+contanierId).css("height", "100%");
            jQuery('#'+idParentElem).css("height", "95%");
            jQuery('#'+contanierId+'>.fs').css("display", "none");
        }
        
        
        function restoreCss() {
            jQuery('#'+contanierId).css("background-color", oldBackgroundColor);
            jQuery('#'+contanierId).css("margin-top", oldMarginTop);
            jQuery('#'+idParentElem).css("height", oldHeightParent);
            jQuery('#'+contanierId).css("height", oldHeightContainer);
            jQuery('#'+contanierId).css("width", oldWidth);
            jQuery('#'+contanierId+'>.fs').css("display", "inline");
        }
                
   }
 