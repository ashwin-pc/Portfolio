// Arrow for next section function
function nextSection() {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var scrollTop = (window.pageYOffset || document.documentElement.scrollTop) + 1;
  var page = (Math.floor(scrollTop/h) + 1);
  var scrollVal = h * page;
  zenscroll.toY(scrollVal);
}

// My section video
var video = document.getElementById('cover-video');
var played = false;
function checkScroll() {
  var rect  = video.getBoundingClientRect();
  var h = video.offsetHeight, scrollTop, diff;

  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  diff = rect.top - h;

  if (diff < 0) {
    setTimeout(function () {
      if (!played) {
        console.log("playing");
        video.play();
        played = true;
      }
    },1000);
  } else {
    video.pause();
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
