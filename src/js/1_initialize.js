// Initialize Firebase
var config = {
  apiKey: "AIzaSyDFUrgN8V-HKvI7W_omYzph_HUWYT_3qc0",
  authDomain: "portfolio-50069.firebaseapp.com",
  databaseURL: "https://portfolio-50069.firebaseio.com",
  storageBucket: "portfolio-50069.appspot.com",
  messagingSenderId: "620857279220"
};
firebase.initializeApp(config);

// Initialize references
var dbRefWebsites = firebase.database().ref().child('websites');
var dbRefGraphics = firebase.database().ref().child('graphics');

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
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}