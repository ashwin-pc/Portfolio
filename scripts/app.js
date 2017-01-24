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
var dbRefGraphics = firebase.database().ref().child('graphics');

// Ajax
function $ajax(ob, callback) {
  var url = (ob !== null && typeof ob === 'object') ? ob.url : ob;
  var oReq = new XMLHttpRequest();
  oReq.open('GET', url, true);
  oReq.responseType = 'json';
  oReq.send();

  // Success response
  oReq.onload = function (e) {
    var ref = (ob !== null && typeof ob === 'object') ? ob.ref : null;
    try {
      var response = JSON.parse(e.target.response);
    } catch (error) {
      var response = e.target.response;
    }
    callback(null, response, ref);
  };
}
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
/*
 * Blog Controller
 * purpose: To display articles from my blog.
 * 
 */

function _stripHTML(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function _makeArticles(wpArticles) {
  var blogContainer = document.getElementById("blogContainer");
  var articles = blogContainer.getElementsByClassName("article");
  
  for (index = 0; index < wpArticles.length; index++) {
    var article = articles[index];
    var articleTitle = article.children[1].children[0].children[0];
    var articleDate = article.children[1].children[0].children[1];
    var articleSummary = article.children[1].children[1];
    var date = new Date(wpArticles[index].modified);

    // Article image
    if (document.documentElement.clientWidth > 480 && wpArticles[index].featured_media !== 0) {
      var ob = {
        url: wpArticles[index]._links['wp:featuredmedia'][0].href,
        ref: article
      }; 
      $ajax(ob, function (err, image, article) {
        article.children[0].style.backgroundImage = "url(" + image.media_details.sizes.thumbnail.source_url + ")";
        article.children[0].style.backgroundSize = "cover";
      });
    }

    // Article Text, Date and Summary
    articleTitle.innerHTML = wpArticles[index].title.rendered;
    articleDate.innerHTML = date.toDateString();
    articleSummary.innerHTML = _stripHTML(wpArticles[index].content.rendered).substring(0,100);

    // Link binding to article
    article.addEventListener('click', function () {
      window.open(wpArticles[index].link, '_blank');
    });

  }

  // 4th article links to blog
  articles[3].addEventListener('click', function () {
    window.open('http://designedbyashw.in/blog', '_blank');
  });
}

// Ajax : Get latest 3 articles
$ajax('http://designedbyashw.in/blog/wp-json/wp/v2/posts?per_page=3', function (err, response) {
  _makeArticles(response);
});



/*
 * Graphics Controller
 * purpose: To display featured graphics designs from firebase storage.
 * TODO: To live update and shuffle tiles
 * 
 */
var liveTiles;
var tileImgArr;
var previousRand = 0;

function _makeTiles(objectArray) {
  var imageViewer = document.getElementById('imageViewer');
  var docFrag = document.createDocumentFragment();

  objectArray.forEach(function (object) {
    var cell = document.createElement('div');
    var cellFront = document.createElement('div');

    cell.className = 'image';

    // Front of Tile
    cellFront.classList.add('live-tile');
    cellFront.dataset.link = object.fullLink || object.link;
    cellFront.style.backgroundImage = "url(" + object.link + ")";

    // Append
    cell.append(cellFront);

    // Store the details in object Array
    tileImgArr = objectArray;

    // Add event listners
    cell.addEventListener('click', function (e) {
      imageViewer.style.display = 'block';
      imageViewer.children[0].src = e.target.dataset.link;
    });
    imageViewer.addEventListener('click', function (e) {
      imageViewer.style.display = 'none';
    });

    // Append cells to document fragment
    docFrag.append(cell);
  });
  return docFrag;
}

// Initialize Cells
dbRefGraphics.once('value').then(function (snapshot) {
  var graphicsContainer = document.getElementById('graphicsContainer');
  var tiles = _makeTiles(snapshot.val());
  graphicsContainer.appendChild(tiles);

  // save live tile references
  liveTiles= graphicsContainer.getElementsByClassName('live-tile');
  liveLoop();
});

/*
 * Live Tile Functionality
 * 
 * */

// Get random integer within a range inclusive of min and max values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

// Fire Tile update randomly at random intervals
function liveLoop() {  
  var min = 100; 
  var max = 1000;
  var rand = getRandomInt(min,max);
  setTimeout(function() {
    updateTile();
    liveLoop();  
  }, rand);
};

// Tile updating function
function updateTile() {
  if (liveTiles) {
    var min = 0; 
    var max = liveTiles.length - 1;
    var rand = getRandomInt(min,max);

    liveTiles[rand].classList.add('start');
    setTimeout(function() {
      liveTiles[rand].classList.remove('start');
    }, 5000);
  }
  
}
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

    var bottom = (rect.top < 0) ? 0 : rect.top;
    transform(arrowDown, 'scale', (bottom/200));
    transform(mailMe, 'scale', (1 - bottom/200));
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

// zenscroll
var edgeOffset = 0; // px
zenscroll.setup(null, edgeOffset);