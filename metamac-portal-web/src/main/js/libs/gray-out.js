/* Global */
var fsSpinner = null;

function grayOut(vis, spinner, options) {
  // Pass true to gray out screen, false to ungray
  // options are optional.  This is a JSON object with the following (optional) properties
  // opacity:0-100         // Lower number = less grayout higher = more of a blackout 
  // zindex: #             // HTML elements with a higher zindex appear on top of the gray out
  // bgcolor: (#xxxxxx)    // Standard RGB Hex color code
  // grayOut(true, {'zindex':'50', 'bgcolor':'#0000FF', 'opacity':'70'});
  // Because options is JSON opacity/zindex/bgcolor are all optional and can appear
  // in any order.  Pass only the properties you need to set.
  var options = options || {}; 
  var zindex = options.zindex || 50;
  var opacity = options.opacity || 70;
  var opaque = (opacity / 100);
  var bgcolor = options.bgcolor || '#000000';
  var dark=document.getElementById('darkenScreenObject');
  if (!dark) {
    // The dark layer doesn't exist, it's never been created.  So we'll
    // create it here and apply some basic styles.
    // If you are getting errors in IE see: http://support.microsoft.com/default.aspx/kb/927917
    var tbody = document.getElementsByTagName("body")[0];
    //var tbody = document.getElementById("visual-element");
    var tnode = document.createElement('div');           // Create the layer.
        tnode.style.position='absolute';                 // Position absolutely
        tnode.style.top='0px';                           // In the top
        tnode.style.left='0px';                          // Left corner of the page
        tnode.style.overflow='hidden';                   // Try to avoid making scroll bars            
        tnode.style.display='none';                      // Start out Hidden
        tnode.id='darkenScreenObject';                   // Name it so we can find it later
    tbody.appendChild(tnode);                            // Add it to the web page
    dark=document.getElementById('darkenScreenObject');  // Get the object.
  }
  if (vis) {
    // Calculate the page width and height 
    if( document.body && ( document.body.scrollWidth || document.body.scrollHeight ) ) {
        var pageWidth = document.body.scrollWidth+'px';
        var pageHeight = document.body.scrollHeight+'px';
    } else if( document.body.offsetWidth ) {
      var pageWidth = document.body.offsetWidth+'px';
      var pageHeight = document.body.offsetHeight+'px';
    } else {
       var pageWidth='100%';
       var pageHeight='100%';
    }
    if (pageHeight == '0px')
      pageHeight='1000px';   
    //set the shader to cover the entire page and make it visible.
    dark.style.opacity=opaque;                      
    dark.style.MozOpacity=opaque;                   
    dark.style.filter='alpha(opacity='+opacity+')'; 
    dark.style.zIndex=zindex;        
    dark.style.backgroundColor=bgcolor;  
    dark.style.width= pageWidth;
    dark.style.height= pageHeight;
    dark.style.display='block';
    if (spinner) {
        var existingSpinner=jQuery(".fsSpinner");
        if (existingSpinner.length == 0) {
            // SPINNER
            var tempTop = jQuery(window).height() / 2 - 10;
            var tempLeft = jQuery(window).width() / 2 - 10;
            var opts = {
                    lines: 13, // The number of lines to draw
                    length: 7, // The length of each line
                    width: 4, // The line thickness
                    radius: 10, // The radius of the inner circle
                    rotate: 0, // The rotation offset
                    color: '#fff', // #rgb or #rrggbb
                    speed: 1, // Rounds per second
                    trail: 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'fsSpinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: tempTop, // Top position relative to parent in px
                    left: tempLeft // Left position relative to parent in px
                  };
            // Append to target
            fsSpinner = new Spinner(opts).spin(dark);
        }
    }
    // Hiding the navbar
    $('.navbar-fixed-top').css('position', 'static');
  }
  else if(!spinner) {
      // Remove the dark
      dark.style.display='none';
      // Stop the spinner
      fsSpinner.stop();
      // Showing the navbar
      if (!($('.full-screen-no-support').length > 0))
          $('.navbar-fixed-top').css('position', 'fixed');
  }
  
  
//  element = $('body').get(0);
//  var temp = element.style.display;
//  element.style.display = 'none'; 
//  element.offsetHeight;
//  element.style.display = 'block';
//  element.style.display = temp;
  document.body.style.display = 'none';
  document.body.style.display = 'block';
  
}