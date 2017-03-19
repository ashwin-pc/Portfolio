// Arrow for next section function
var sections = document.getElementsByClassName("page-section");

function nextSection() {
  var currentSectionIndex = getCurrentSectionIndex();

  // Scroll location
  var nextIndex = (currentSectionIndex == sections.length1-1) ? currentSectionIndex : currentSectionIndex + 1;
  zenscroll.to(sections[nextIndex]);
}

function previousSection() {
  var currentSectionIndex = getCurrentSectionIndex();

  // Scroll location
  var prevIndex = (currentSectionIndex == 0) ? 0 : currentSectionIndex-1;
  // console.log(prevIndex, i);
  zenscroll.to(sections[prevIndex]);
}

function getCurrentSectionIndex() {
  var scrollTop = (window.pageYOffset || document.documentElement.scrollTop) + 1;
  var currentSectionIndex = 0;

  // Scroll Logic
  for (var i = 0; i < sections.length; i++) {
    if (sections[i].offsetTop < (scrollTop + 5)) {
      currentSectionIndex = i;
    }
  }

  return currentSectionIndex;
}

// nextSection Keyboard shortcut
document.onkeydown = function (e) {
    e = e || window.event;

    if (e.keyCode == '40') {
      // Down Arrow
      nextSection();
    } else if (e.keyCode == '38') {
      // Up Arrow
      previousSection();
    }
}

// zenscroll
var edgeOffset = 0; // px
zenscroll.setup(null, edgeOffset);