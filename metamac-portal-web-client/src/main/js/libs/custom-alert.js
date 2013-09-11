/*
 * Plugin para customizado de tabla del proyecto Ematic
 * Romén Rodríguez Gil
 * Universidad de La Laguna
 * */

// constants to define the title of the alert and button text.
var ALERT_TITLE = "Resultado";
//var ALERT_BUTTON_TEXT_1 = "Ir al menÃº";
var ALERT_BUTTON_TEXT_1 = "Aceptar";
var ALERT_BUTTON_TEXT_2 = "Intentar de nuevo";
var ALERT_BUTTON_TEXT_3 = "Ver soluciÃ³n";
/* Other vars */
var saveOverflowX;
var saveOverflowY;


// over-ride the alert method only if this a newer browser.
// Older browser will see standard alerts
if(document.getElementById) {
  window.alert = function(activity, answer, trialNum, correctionData1, correctionData2, correctionData3, correctionData4, correctionData5, correctionData6) {
    createCustomAlert(activity, answer, trialNum, correctionData1, correctionData2, correctionData3, correctionData4, correctionData5, correctionData6);
  }
}

function createCustomAlert(activity, answer, trialNum, correctionData1, correctionData2, correctionData3, correctionData4, correctionData5, correctionData6) {
  // Saving overflow settings 
  saveOverflowX = jQuery('html').css("overflow-x");
  saveOverflowY = jQuery('html').css("overflow-y");
  
  jQuery('html').css("overflow-y","hidden");
  jQuery('html').css("overflow-x","hidden"); 

  // shortcut reference to the document object
  d = document;

  // if the modalContainer object already exists in the DOM, bail out.
  if(d.getElementById("modalContainer")) return;

  // create the modalContainer div as a child of the BODY element
  mObj = d.getElementById("activityContaint").appendChild(d.createElement("div"));
  mObj.id = "modalContainer";
   // make sure its as tall as it needs to be to overlay all the content on the page
  mObj.style.height = document.documentElement.scrollHeight + "px";

  // create the DIV that will be the alert 
  alertObj = mObj.appendChild(d.createElement("div"));
  alertObj.id = "alertBox";
  // MSIE doesnt treat position:fixed correctly, so this compensates for positioning the alert
  if(d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
  // center the alert box
  alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
  //alertObj.style.top = (d.documentElement.scrollHeight- alertObj.offsetHeight)/2 + "px";

  // create an H1 element as the title bar
  h1 = alertObj.appendChild(d.createElement("h1"));
  h1.appendChild(d.createTextNode(ALERT_TITLE));

  // create a paragraph element to contain the answer argument
  msg = alertObj.appendChild(d.createElement("p"));
  
  /* This is the buttons DIV */
  buttons = alertObj.appendChild(d.createElement("div"));
  buttons.id = "buttons";
  
  /* MESSAGE TO THE USER */
  if (answer) {
    msg.innerHTML = 'Respuesta correcta. Bien hecho';
    /* Button */
    // create an anchor element to use as the confirmation button.
    btn = buttons.appendChild(d.createElement("a"));
    btn.id = "button1";
    btn.setAttribute('class', 'button');
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT_1));
    btn.href = "#";
    // set up the onclick event to remove the alert when the anchor is clicked
    btn.onclick = function() {
                    removeCustomAlert();
                    hideWaitMessage();
                    switch (activity) {
                      case "AIdenticos":
                          showSolutionAI(correctionData1, correctionData2, correctionData3, correctionData4);
                      break;
                      case "SElemento":
                          showSolutionSE(correctionData1);
                      break;
                      case "EOpuestos":
                          showSolutionEO(correctionData1, correctionData2);
                      break;
                      case "ARelacionados":
                          showSolutionAR(correctionData1, correctionData2, correctionData3, correctionData4);
                      break;
                      case "OTamanios":
                          showSolutionOT(correctionData1, correctionData2, correctionData3, correctionData4, correctionData5, correctionData6);
                      break;
                      case "S2ele":
                          showSolutionS2(correctionData1);
                      break;
                      case "S3ele1inc":
                          showSolutionS31(correctionData1);
                      break;
                      case "S3ele2inc":
                          showSolutionS32(correctionData1, correctionData2, correctionData3, correctionData4);
                      break;
                      case "RObjetos":
                          showSolutionRO();
                      break;
                      case "RObjetosB":
                          showSolutionROB();
                      break;
                      case "SElementosVarios":
                          showSolutionSElementosVarios(correctionData1, correctionData2);
                      break;
                    }
                    return true;
                  }
  }
  else if (trialNum == -1) {
    msg.innerHTML = 'No has dado ninguna soluciÃ³n. IntÃ©ntalo de nuevo.';
    /* Button 2: Try again */
    // create an anchor element to use as the confirmation button.
    btn = buttons.appendChild(d.createElement("a"));
    btn.id = "button2";
    btn.setAttribute('class', 'button');
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT_2));
    btn.href = "#";
    // set up the onclick event to remove the alert when the anchor is clicked
    btn.onclick = function() {
                    removeCustomAlert();
                    hideWaitMessage();
                    return true;
                  }
  }
  else if (trialNum < 3) {
    msg.innerHTML = 'Respuesta incorrecta. IntÃ©ntalo de nuevo.';
    /* Button 2: Try again */
    // create an anchor element to use as the confirmation button.
    btn = buttons.appendChild(d.createElement("a"));
    btn.id = "button2";
    btn.setAttribute('class', 'button');
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT_2));
    btn.href = "#";
    // set up the onclick event to remove the alert when the anchor is clicked
    btn.onclick = function() {
                    removeCustomAlert();
                    hideWaitMessage();
                    return true;
                  }
    /* Button 3: Show solution */
    // create an anchor element to use as the confirmation button.
    btn = buttons.appendChild(d.createElement("a"));
    btn.id = "button3";
    btn.setAttribute('class', 'button');
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT_3));
    btn.href = "#";
    // set up the onclick event to remove the alert when the anchor is clicked
    btn.onclick = function() {
                    removeCustomAlert();
                    hideWaitMessage();
                    switch (activity) {
                      case "AIdenticos":
                          showSolutionAI(correctionData1, correctionData2, correctionData3, correctionData4);
                      break;
                      case "SElemento":
                          showSolutionSE(correctionData1);
                      break;
                      case "EOpuestos":
                          showSolutionEO(correctionData1, correctionData2);
                      break;
                      case "ARelacionados":
                          showSolutionAR(correctionData1, correctionData2, correctionData3, correctionData4);
                      break;
                      case "OTamanios":
                          showSolutionOT(correctionData1, correctionData2, correctionData3, correctionData4, correctionData5, correctionData6);
                      break;
                      case "S2ele":
                          showSolutionS2(correctionData1);
                      break;
                      case "S3ele1inc":
                          showSolutionS31(correctionData1);
                      break;
                      case "S3ele2inc":
                          showSolutionS32(correctionData1, correctionData2, correctionData3, correctionData4);
                      break;
                      case "RObjetos":
                          showSolutionRO();
                      break;
                      case "RObjetosB":
                          showSolutionROB();
                      break;
                      case "SElementosVarios":
                          showSolutionSElementosVarios(correctionData1, correctionData2);
                      break;
                    }
                    /* SHOW THE SOLUTION */
                    return true;
                  }
  }
  else {
    msg.innerHTML = 'Respuesta incorrecta. Agotados los intentos.';
    /* Button 3: Show solution */
    // create an anchor element to use as the confirmation button.
    btn = buttons.appendChild(d.createElement("a"));
    btn.id = "button3";
    btn.setAttribute('class', 'button');
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT_3));
    btn.href = "#";
    // set up the onclick event to remove the alert when the anchor is clicked
    btn.onclick = function() {
                    removeCustomAlert();
                    hideWaitMessage();
                    switch (activity) {
                      case "AIdenticos":
                          showSolutionAI(correctionData1, correctionData2, correctionData3, correctionData4);
                      break;
                      case "SElemento":
                          showSolutionSE(correctionData1);
                      break;
                      case "EOpuestos":
                          showSolutionEO(correctionData1, correctionData2);
                      break;
                      case "ARelacionados":
                          showSolutionAR(correctionData1, correctionData2, correctionData3, correctionData4);
                      break;
                      case "OTamanios":
                          showSolutionOT(correctionData1, correctionData2, correctionData3, correctionData4, correctionData5, correctionData6);
                      break;
                      case "S2ele":
                          showSolutionS2(correctionData1);
                      break;
                      case "S3ele1inc":
                          showSolutionS31(correctionData1);
                      break;
                      case "S3ele2inc":
                          showSolutionS32(correctionData1, correctionData2, correctionData3, correctionData4);
                      break;
                      case "RObjetos":
                          showSolutionRO();
                      break;
                      case "RObjetosB":
                          showSolutionROB();
                      break;
                      case "SElementosVarios":
                          showSolutionSElementosVarios(correctionData1, correctionData2);
                      break;
                    }
                    /* SHOW THE SOLUTION */
                    return true;
                  }
  }
}

// removes the custom alert from the DOM
function removeCustomAlert() {
  document.getElementById("activityContaint").removeChild(document.getElementById("modalContainer"));
  // Saving overflow settings 
  jQuery('html').css("overflow-x", saveOverflowX);
  jQuery('html').css("overflow-y", saveOverflowY);
}

