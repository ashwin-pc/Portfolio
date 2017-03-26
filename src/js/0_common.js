/**
 * Common JS
 */

/**
 * Toast - Toast Controller Class
 * @param {Node} containerEle - DOM Container element
 * @param {Object} options - Toast options
 * @param {String} [options.message] - Toast default message
 * @param {Number} [options.timeout] - Toast default timeout
 * @param {Boolean} [options.logging] - Toast default logging option
 * @param {String} [options.gravity] - Toast default gravity
 */
function Toast(containerEle, options) {
  this.toastContainerEle = containerEle;
  this.message = options.message || "Something went wrong, Try Again";
  this.timeout = options.timeout || 10000;
  this.logging = options.logging || false;
  this.gravity = options.gravity || 'top';
}
Toast.prototype.show = function (msg, options, callback) {

    // Options
    var m     = msg || this.message;
    var t     = options.timeout || this.timeout;
    var log   = (typeof options.logging !== 'undefined') ? options.logging : this.logging;

    // Create HTML
    var toastEle = document.createElement("div");
    toastEle.classList.add("toast");
    toastEle.innerHTML = m;
    this.toastContainerEle.appendChild(toastEle);

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
        this.toastContainerEle.removeChild(toastEle);
    }, t+1000);

    // Log Error
    if (log) {
      console.log(m);
    }

    if (callback) {
      return callback(null, m);
    }
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