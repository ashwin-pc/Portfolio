/**
 * All Common funtions used accross sections go here
 */

// Error Toast
function errorToast(msg, timeout) {
    var m = msg || "Something went wrong, Try Again";
    var t = timeout || 3000;

    // Create HTML
    var toastEle = document.createElement("div");
    toastEle.classList.add("toast");
    toastEle.innerHTML = m;
    document.body.appendChild(toastEle);

    // Slide in toast
    setTimeout(function() {
        toastEle.classList.add("show");
    }, 500);

    // Slide out toast
    setTimeout(function() {
        toastEle.classList.remove("show");
    }, t+500);

    // Remove from DOM
    setTimeout(function() {
        document.body.removeChild(toastEle);
    }, t+1000);

    // Log Error
    console.log(m);
}

// Add common prototype functions
Number.prototype.map = function (in_min, in_max, out_min, out_max, force) {
  var val = this;
  if(force) {
    if(val<in_min) {val = in_min}
    else if (val > in_max) { val = in_max}
  }
  return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

/**
 * $ajax - Custom Ajax finctionality for the app
 * @param {Object} ob configuration values for ajax call
 * @param {Function} callback 
 */
function $ajax(ob, callback) {
  var url = (ob !== null && typeof ob === 'object') ? ob.url : ob;
  var oReq = new XMLHttpRequest();
  oReq.open('GET', url, true);
  oReq.responseType = 'json';
  oReq.send();

  // Success response
  oReq.onload = function (e) {
    if (oReq.status === 200) {
      var ref = (ob !== null && typeof ob === 'object') ? ob.ref : null;
      var response = e.target.response;
      callback(null, response, ref);
    } else {
      // console.log(oReq.response);
    }
  };

  oReq.onerror = function (e) {
    callback("error", null);
  }

  oReq.onabort = function (e) {
    console.log("abort",e);
  }

  oReq.ontimeout = function (e) {
    callback("timeout",null);
  }
}