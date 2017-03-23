// Initialize Firebase
var _firebaseBaseUrl = "https://portfolio-50069.firebaseio.com/";
var _mobile = false;

if (document.documentElement.clientWidth < 480) {
    _mobile = true;
}

if (!_mobile) {
    toast("Use arrow keys to navigate throught sections", false, 3000);
}