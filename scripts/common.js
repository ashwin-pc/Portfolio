// Arrow for next section function
function nextSection() {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var page = (Math.floor(scrollTop/h) + 1);
  var scrollVal = h *  page;
  zenscroll.toY(scrollVal);
}
