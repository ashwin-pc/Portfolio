/*
 * My Section Controller
 * purpose: To display Me.
 * TODO: Something better for mail
 * 
 */

var video = document.getElementById('cover-video');
var arrowDown = document.getElementById('arrowDown');
var mailMe = document.getElementById('mailMe');

var played = false;

// Scroll spy
function checkScroll() {
  var rect  = video.getBoundingClientRect();
  var h = video.offsetHeight, diff;

  // Play video 100px from bottom of page
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

  // Swap between arrow and mail icon 200px from bottom of page
  if (rect.top < 200) {
    if (arrowDown.classList.contains('animate')) {
      arrowDown.classList.remove('animate')
    }

    transform(arrowDown, 'scale', (rect.top/200));
    transform(mailMe, 'scale', (1 - rect.top/200));
  } else {
    if (!arrowDown.classList.contains('animate')) {
      arrowDown.classList.add('animate');
      transform(mailMe, 'scale', 0);
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

// Transform functiom
function transform(ele, type, val) {
  ele.style.WebkitTransform = type + "(" + val +")";
  ele.style.MozTransform = type + "(" + val +")";
  ele.style.OTransform = type + "(" + val +")";
  ele.style.transform = type + "(" + val +")";
}