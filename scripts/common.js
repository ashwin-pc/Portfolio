// Arrow for next section function
function nextSection() {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var scrollVal = h * (Math.floor(scrollTop/h) + 1) + 4;
  zenscroll.toY(scrollVal);
}
