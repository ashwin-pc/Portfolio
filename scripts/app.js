// Initialize Firebase
var config = {
  apiKey: "AIzaSyDFUrgN8V-HKvI7W_omYzph_HUWYT_3qc0",
  authDomain: "portfolio-50069.firebaseapp.com",
  databaseURL: "https://portfolio-50069.firebaseio.com",
  storageBucket: "portfolio-50069.appspot.com",
  messagingSenderId: "620857279220"
};
firebase.initializeApp(config);

// Initialize references
var dbRefWebsites = firebase.database().ref().child('websites');

/*
 * Web Design Section Controller
 * purpose: To display various websites build by me on a realtime basis
 * 
 */

// Make cells helper function
function _makeCells(objectArray) {
  var cellArray = [];

  objectArray.forEach(function (object) {
    var cell = document.createElement('div');
    cell.className = 'carousel-cell';
    // cell.textContent = object.name; // TODO: Add name feild if required
    cell.dataset.link = object.link;
    cell.style.backgroundImage = "url(" + object.img + ")";
    cellArray.push(cell);
  });
  return cellArray;
}

// Initialize Flickity
var flkty = new Flickity( '#webDesignCarousel', {
  "cellAlign": "center", 
  "contain": true, 
  "wrapAround": true, 
  "autoPlay": true
});

// Initialize Cells
dbRefWebsites.once('value').then(function (snapshot) {
  var cellArray = _makeCells(snapshot.val());
  flkty.append(cellArray);
});

// Bind click event to Flickity
flkty.on( 'staticClick', function( event, pointer, cellElement, cellIndex ) {
  if ( !cellElement ) {
    return;
  }
  window.open(cellElement.dataset.link, '_blank');
});
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