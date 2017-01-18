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
function $ajax(url, callback) {
  var oReq = new XMLHttpRequest();
  oReq.open('GET', url, true);
  oReq.responseType = 'json';
  oReq.send();

  // Success response
  oReq.onload = function (e) {
    callback(null, e.target.response);
  };
}