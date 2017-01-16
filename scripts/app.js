// My section video
var video = document.getElementById('cover-video');
var played = false;
function checkScroll() {
  var rect  = video.getBoundingClientRect();
  var h = video.offsetHeight, scrollTop, diff;

  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  diff = rect.top - 100;

  if (diff < 0) {
    if (!played) {
      console.log("playing");
      video.play();
      played = true;
    }
  } else {
    if (!played) {
      video.pause();
    }
  }
}

function fadeout() {
  video.classList.add("stopfade");
}

window.addEventListener('scroll', checkScroll, false);
window.addEventListener('resize', checkScroll, false);
video.addEventListener('ended',fadeout, false);

// get the video
var video = document.querySelector('video');
// use the whole window and a *named function*
window.addEventListener('touchstart', function videoStart() {
  video.play();
  console.log('first touch');
  // remove from the window and call the function we are removing
  this.removeEventListener('touchstart', videoStart);
});

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