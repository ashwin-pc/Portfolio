// Initialize Page
var _firebaseBaseUrl = "https://portfolio-50069.firebaseio.com/";
var _mobile = false;

var toastContainer = new ToastContainer({logging: true});

if (document.documentElement.clientWidth < 480) {
    _mobile = true;
}

if (!_mobile) {
    toastContainer.toast("Use arrow keys to navigate throught sections", {logging:false, timeout:3000});
    toastContainer.toast("Use arrow keys to navigate throught sections", {logging:false, timeout:4000});
    toastContainer.toast("Use arrow keys to navigate throught sections", {logging:false, timeout:5000});
}