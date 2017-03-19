// Arrow for next section function
var sections = document.getElementsByClassName("page-section");

function nextSection() {
  var scrollTop = (window.pageYOffset || document.documentElement.scrollTop) + 1;

  // Scroll Logic
  for (var i = 0; i < sections.length; i++) {
    if (sections[i].offsetTop > (scrollTop + 5)) {
      // Scroll location
      zenscroll.to(sections[i]);
      break;
    }
  }
}

// nextSection Keyboard shortcut
document.onkeydown = function (e) {
    e = e || window.event;

    if (e.keyCode == '40') {
        // down Arrow
        nextSection();
    }
}

// zenscroll
var edgeOffset = 0; // px
zenscroll.setup(null, edgeOffset);