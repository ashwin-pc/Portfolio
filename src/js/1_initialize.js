// Initialize Page
var _firebaseBaseUrl = "https://portfolio-50069.firebaseio.com/";
var _mobile = false;

var toastContainerEle = document.getElementById("toast-container");
var toast = new Toast(toastContainerEle, {logging: true});

if (document.documentElement.clientWidth < 480) {
    _mobile = true;
}

if (!_mobile) {
    toast.show("Use arrow keys to navigate throught sections", {logging:false, timeout:3000});
}