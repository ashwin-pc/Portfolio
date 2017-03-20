// Initialize Firebase
var firebaseBaseUrl = "https://portfolio-50069.firebaseio.com/";

// Ajax
function $ajax(ob, callback) {
  var url = (ob !== null && typeof ob === 'object') ? ob.url : ob;
  var oReq = new XMLHttpRequest();
  oReq.open('GET', url, true);
  oReq.responseType = 'json';
  oReq.send();

  // Success response
  oReq.onload = function (e) {
    var ref = (ob !== null && typeof ob === 'object') ? ob.ref : null;
    try {
      var response = JSON.parse(e.target.response);
    } catch (error) {
      var response = e.target.response;
    }
    callback(null, response, ref);
  };
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