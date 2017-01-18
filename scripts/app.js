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
function $ajax(url, callback) {
  var oReq = new XMLHttpRequest();
  oReq.open('GET', url, true);
  oReq.responseType = 'json';
  oReq.send();

  // Success response
  oReq.onload = function (e) {
    callback(null, e.target.response);
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

function _makeArticles(articleArr) {
  var blogContainer = document.getElementById("blogContainer");
  var articles = blogContainer.getElementsByClassName("article");
  articleArr.forEach(function (articleObj, index) {
    var articleTitle = articles[index].children[1].children[0].children[0];
    var articleDate = articles[index].children[1].children[0].children[1];
    var articleSummary = articles[index].children[1].children[1];
    var date = new Date(articleObj.modified);

    // Article image
    if (document.documentElement.clientWidth > 480 && articleObj.featured_media !== 0) {
      $ajax(articleObj._links['wp:featuredmedia'][0].href, function (err, image) {
        articles[index].children[0].style.backgroundImage = "url(" + image.media_details.sizes.thumbnail.source_url + ")";
        articles[index].children[0].style.backgroundSize = "cover";
      });
    }

    // Article Text, Date and Summary
    articleTitle.innerHTML = articleObj.title.rendered;
    articleDate.innerHTML = date.toDateString();
    articleSummary.innerHTML = _stripHTML(articleObj.content.rendered).substring(0,100);

    // Link binding to article
    articles[index].addEventListener('click', function () {
      window.open(articleObj.link, '_blank');
    });

  });

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
 * 
 */

function _makeTiles(objectArray) {
  var imageViewer = document.getElementById('imageViewer');
  var docFrag = document.createDocumentFragment();

  objectArray.forEach(function (object) {
    var cell = document.createElement('div');
    var cellInner = document.createElement('div');

    cell.className = 'image';
    cellInner.dataset.link = object.fullLink || object.link;
    cellInner.style.backgroundImage = "url(" + object.link + ")";
    cell.append(cellInner);

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