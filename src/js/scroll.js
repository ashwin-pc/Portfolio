// Arrow for next section function
var sections = document.getElementsByClassName("page-section");

function nextSection() {
  var scrollTop = (window.pageYOffset || document.documentElement.scrollTop) + 1;

  // Scroll Logic
  for (var i = 0; i < sections.length; i++) {
    if (sections[i].offsetTop > scrollTop) {
      // Scroll location
      zenscroll.to(sections[i]);
      break;
    }
  }
}

// zenscroll
var edgeOffset = -2; // px
zenscroll.setup(null, edgeOffset);