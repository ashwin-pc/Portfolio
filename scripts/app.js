/**
 * All Common funtions used accross sections go here
 */

// Error Toast
var toastContainerEle = document.getElementById("toast-container");
function toast(msg, log, timeout) {
    var m = msg || "Something went wrong, Try Again";
    var t = timeout || 10000;

    // Create HTML
    var toastEle = document.createElement("div");
    toastEle.classList.add("toast");
    toastEle.innerHTML = m;
    toastContainerEle.appendChild(toastEle);

    // Slide in toast
    setTimeout(function() {
        toastEle.classList.add("show");
    }, 500);

    // Slide out toast
    setTimeout(function() {
        toastEle.classList.remove("show");
    }, t+500);

    // Remove from DOM
    setTimeout(function() {
        toastContainerEle.removeChild(toastEle);
    }, t+1000);

    // Log Error
    if (log) {
      console.log(m);
    }
}

// Add common prototype functions
Number.prototype.map = function (in_min, in_max, out_min, out_max, force) {
  var val = this;
  if(force) {
    if(val<in_min) {val = in_min}
    else if (val > in_max) { val = in_max}
  }
  return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

/**
 * $ajax - Custom Ajax finctionality for the app
 * @param {Object} ob configuration values for ajax call
 * @param {Function} callback 
 */
function $ajax(ob, callback) {
  var url = (ob !== null && typeof ob === 'object') ? ob.url : ob;
  var oReq = new XMLHttpRequest();
  oReq.open('GET', url, true);
  oReq.responseType = 'json';
  oReq.send();

  // Success response
  oReq.onload = function (e) {
    if (oReq.status === 200) {
      var ref = (ob !== null && typeof ob === 'object') ? ob.ref : null;
      var response = e.target.response;
      callback(null, response, ref);
    } else {
      // console.log(oReq.response);
    }
  };

  oReq.onerror = function (e) {
    callback("error", null);
  }

  oReq.onabort = function (e) {
    console.log("abort",e);
  }

  oReq.ontimeout = function (e) {
    callback("timeout",null);
  }
}
// Initialize Firebase
var _firebaseBaseUrl = "https://portfolio-50069.firebaseio.com/";
var _mobile = false;

if (document.documentElement.clientWidth < 480) {
    _mobile = true;
}

if (!_mobile) {
    toast("Use arrow keys to navigate throught sections", false, 3000);
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
    var bgImg = new Image();
    cell.classList.add('carousel-cell');
    cell.textContent = object.name; // TODO: Add name feild if required
    cell.dataset.link = object.link;
    _addLoader(cell);

    // Loading images with loader
    bgImg.onload = function(){
      _removeLoader(cell);
      cell.textContent = "";
      cell.style.backgroundImage = 'url(' + bgImg.src + ')';
    };
    bgImg.src = object.img;

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
$ajax(_firebaseBaseUrl+"websites.json", function (err,snapshot) {
  if (err) {
    toast("Could not retrieve Web Page Designs, Try Again", true)
    return;
  }
  var cellArray = _makeCells(snapshot);
  flkty.append(cellArray);
});

// Bind click event to Flickity
flkty.on( 'staticClick', function( event, pointer, cellElement, cellIndex ) {
  if ( !cellElement ) {
    return;
  }
  window.open(cellElement.dataset.link, '_blank');
});

/**
 * _addLoader - function to add a loader to an element
 * @param {Node} ele 
 */
function _addLoader(ele) {
  var loader = document.createElement("div");
  loader.classList.add("loader", "show");
  ele.appendChild(loader);
}

function _removeLoader(ele) {
  var loader = ele.getElementsByClassName("loader");
  loader[0].parentNode.removeChild(loader[0]);
}
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
    var date = new Date(wpArticles[index].date);

    // Article image
    if (!_mobile && wpArticles[index].featured_media !== 0) {
      var ob = {
        url: wpArticles[index]._links['wp:featuredmedia'][0].href,
        ref: article
      }; 
      $ajax(ob, function (err, image, article) {
        article.children[0].style.backgroundImage = "url(" + image.media_details.sizes.medium.source_url + ")";
        article.children[0].style.backgroundSize = "cover";
      });
    }

    // Article Text, Date and Summary
    articleTitle.innerHTML = wpArticles[index].title.rendered;
    articleDate.innerHTML = date.toDateString();
    articleSummary.innerHTML = _stripHTML(wpArticles[index].excerpt.rendered).substring(0,100);

    // Link binding to article
    article.dataset.link = wpArticles[index].link;
    article.addEventListener('click', function () {
      window.open(this.dataset.link, '_blank');
    });

  }

  // 4th article links to blog
  articles[3].addEventListener('click', function () {
    window.open('http://designedbyashw.in/blog', '_blank');
  });
}

// Ajax : Get latest 3 articles
$ajax('http://designedbyashw.in/blog/wp-json/wp/v2/posts?per_page=3&context=embed', function (err, response) {
  if (err) {
    errorToast("Could not retrieve Posts, Try again.")
    return;
  }
  _makeArticles(response);
});

function _blogScrollHandler() {
  // Get Visibility Percent of the Section
  var sectionVisiblePercent = getSectionVisiblePercent(2);
  var articles = document.getElementsByClassName("article");

  if (sectionVisiblePercent > 90) {
    [].forEach.call(articles, function (article, i) {
      setTimeout(function() {
        article.classList.add("animate");
      }, 100 * i);
    });
  } else {
    [].forEach.call(articles, function (article, i) {
      setTimeout(function() {
        article.classList.remove("animate");
      }, 100 * i);
    });
  }
}

/*
 * Graphics Controller
 * purpose: To display featured graphics designs from firebase storage.
 * TODO: To live update and shuffle tiles
 * 
 */
var liveTiles;
var tileImgArr;
var excess = 0;

var imageViewerEle = document.getElementById('imageViewer');
var imageEle = document.getElementById("image");
var spinningLoaderEle = document.getElementById("spinning-loader");

function _imageLoadHandler(e) {
  var ratio = Math.max(e.target.naturalHeight/window.innerHeight,e.target.naturalWidth/window.innerWidth);

  imageEle.style.height = (e.target.naturalHeight / ratio * 0.8) + 'px';
  imageEle.style.width = (e.target.naturalWidth / ratio * 0.8) + 'px';
  imageEle.style.scale = 0;
  imageEle.classList.add("animate");
  spinningLoaderEle.classList.remove("show");
}

function _makeTiles(objectArray) {
  var docFrag = document.createDocumentFragment();
  var loadedImages = 0;
  
  imageEle.children[0].addEventListener('load', _imageLoadHandler);
  excess = (objectArray.length > 12) ? objectArray.length - 12 : 0;

  objectArray.forEach(function (object,index) {
    var cell = document.createElement('div');
    var cellFront = document.createElement('div');
    var bgImg = new Image();

    cell.className = 'image';

    // Front of Tile
    cellFront.classList.add('live-tile');
    cellFront.dataset.link = object.fullLink || object.link;
    // cellFront.style.backgroundImage = "url(" + object.link + ")";

    // Loading images with loader
    _addLoader(cellFront);
    bgImg.onload = function(){
      _removeLoader(cell);
      loadedImages++;
      cellFront.style.backgroundImage = 'url(' + bgImg.src + ')';
      if (loadedImages == objectArray.length) {
        liveLoop();
      }
    };
    bgImg.src = object.link;

    // Append
    cell.appendChild(cellFront);

    // Store the details in object Array
    if(excess && index > 11) {
      cellFront.dataset.visible = false;
    }


    // Add event listners
    cell.addEventListener('click', function (e) {
      imageViewerEle.style.display = 'block';
      imageEle.children[0].src = e.target.dataset.link;
      spinningLoaderEle.classList.add("show");
    });
    imageViewerEle.addEventListener('click', function (e) {
      imageEle.classList.remove("animate");
      imageViewerEle.style.display = 'none';
    });
    imageEle.addEventListener("click",function (e) {
      e.stopPropagation();
    })

    // Append cells to document fragment
    docFrag.appendChild(cell);
  });
  return docFrag;
}

// Initialize Cells
$ajax(_firebaseBaseUrl+"graphics.json", function (err, snapshot) {
  if (err) {
    toast("Could not retrieve Graphic Designs, Try again.", true)
    return;
  }
  var graphicsContainer = document.getElementById('graphicsContainer');
  var tiles = _makeTiles(snapshot);
  graphicsContainer.appendChild(tiles);

  // save live tile references
  liveTiles = graphicsContainer.getElementsByClassName('live-tile');
});

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
    var animationTime = 500;
    var nextIndex;

    if(liveTiles[rand].classList.contains('start')) {return;}
    liveTiles[rand].classList.add('start');
    setTimeout(function() {
      liveTiles[rand].classList.remove('start');
    }, 5000);

    // Update tile image if there is more than 12 tiles
    if (excess) {
      setTimeout(function() {
        var index = getRandomInt(12,liveTiles.length-1);

        // Swap hidden tiles with shown tiles
        if (liveTiles[index].dataset.visible == "false") {
          var temp = {};
          temp.link = liveTiles[rand].dataset.link;
          temp.backgroundImage = liveTiles[rand].style.backgroundImage;
          liveTiles[rand].dataset.link = liveTiles[index].dataset.link;
          liveTiles[rand].style.backgroundImage = liveTiles[index].style.backgroundImage;
          liveTiles[index].dataset.link = temp.link;
          liveTiles[index].style.backgroundImage = temp.backgroundImage;
        }
      }, animationTime/2);
    }
  }
  
}
/*
 * My Section Controller
 * purpose: To display Me.
 * TODO: Something better for mail
 * 
 */

var arrowDown = document.getElementById('arrowDown');
var mailMe = document.getElementById('mailMe');
var myTitleEle = document.getElementById('my-title');
var myTextEle = document.getElementById('my-text');

// Transform functiom
function transform(ele, type, val) {
  ele.style.WebkitTransform = type + "(" + val +")";
  ele.style.MozTransform = type + "(" + val +")";
  ele.style.OTransform = type + "(" + val +")";
  ele.style.transform = type + "(" + val +")";
}

function _mySectionScrollHandler() {

	// Get Visibility Percent of the Section
  var sectionVisiblePercent = getSectionVisiblePercent(4);

	// Swap between arrow and mail icon after 80% of the page is visible
	if (sectionVisiblePercent > 70) {
		if (arrowDown.classList.contains('animate')) {
			arrowDown.classList.remove('animate');
		}

		var scaleArrow = sectionVisiblePercent.map(70,80,1,0,true);
		var scaleMail = sectionVisiblePercent.map(80,90,0,1,true);
		transform(arrowDown, 'scale', scaleArrow);
		transform(mailMe, 'scale', scaleMail);
	} else {
		if (!arrowDown.classList.contains('animate')) {
			arrowDown.classList.add('animate');
			transform(mailMe, 'scale', 0);
		}
	}

  // Show title and text based on scroll
  if(sectionVisiblePercent > 70) {
    myTitleEle.classList.add('animate');
    myTextEle.classList.add('animate');
  } else {
    myTitleEle.classList.remove('animate');
    myTextEle.classList.remove('animate');
  }
}
/**
 * Scrolling related functions are handled here
 */

// Globally accessable scroll values and elements
var sections = document.getElementsByClassName("page-section");
var currentSection = 0;

// returns index of the current section
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

function getSectionScrollPercent(sectionIndex) {
	var index = sectionIndex || currentSection;
	var scrollTop = (window.pageYOffset || document.documentElement.scrollTop) + 1;
	var top = sections[index].offsetTop;
	var height = sections[index].offsetHeight;

	var diff = (scrollTop-top < 0) ? 0 : scrollTop-top;
	var percent = diff.map(0,height, 0, 100);
	return percent;
}

function getSectionVisiblePercent(sectionIndex) {
	var index = sectionIndex || currentSection;
	var scrollBottom = (window.pageYOffset || document.documentElement.scrollTop) + (window.innerHeight || document.documentElement.clientHeight);
	var top = sections[index].offsetTop;
	var height = sections[index].offsetHeight;

	var diff = (scrollBottom-top < 0) ? 0 : scrollBottom-top;
	var percent = diff.map(0,height, 0, 100);
	return percent;
}

function nextSection() {
	var currentSectionIndex = getCurrentSectionIndex();
	var nextIndex = (currentSectionIndex == sections.length1 - 1) ? currentSectionIndex : currentSectionIndex + 1;
	zenscroll.to(sections[nextIndex]);
}

function previousSection() {
	var currentSectionIndex = getCurrentSectionIndex();
	var prevIndex = (currentSectionIndex == 0) ? 0 : currentSectionIndex - 1;
	zenscroll.to(sections[prevIndex]);
}

// nextSection Keyboard shortcut
document.onkeydown = function (e) {
	e = e || window.event;

	if (e.keyCode == '40') { 		// Down Arrow
		nextSection();
	} else if (e.keyCode == '38') { // Up Arrow
		previousSection();
	}
}

/**
 * checkScroll - function to detect scrollLocation and trigger events
 */
function checkScroll() {
	var scrollTop = (window.pageYOffset) + 1;
	currentSection = getCurrentSectionIndex();

	switch (currentSection) {
		case 1:
			_blogScrollHandler();
			break;
		case 3:
			_mySectionScrollHandler();
			break;
		case 4:
			_mySectionScrollHandler();
			break;
	}
}


// Add Scroll Event Listeners
window.addEventListener('scroll', checkScroll, false);
window.addEventListener('resize', checkScroll, false);

// zenscroll setup
var edgeOffset = 0; // px
zenscroll.setup(null, edgeOffset);
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
    window.requestAnimationFrame = requestAnimationFrame;
})();

var flakes = [],
    canvasAreaFactor = (Math.round(window.innerWidth*window.innerHeight/100000))*50,
    canvas = document.getElementById("snow"),
    ctx = canvas.getContext("2d"),
    flakeCount = canvasAreaFactor,
    mX = -100,
    mY = -100

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < flakeCount; i++) {
        var flake = flakes[i],
            x = mX,
            y = mY,
            minDist = 150,
            x2 = flake.x,
            y2 = flake.y;

        var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
            dx = x2 - x,
            dy = y2 - y;

        if (dist < minDist) {
            var force = minDist / (dist * dist),
                xcomp = (x - x2) / dist,
                ycomp = (y - y2) / dist,
                deltaV = force / 2;

            flake.velX -= deltaV * xcomp;
            flake.velY -= deltaV * ycomp;

        } else {
            flake.velX *= .18;
            if (flake.velY <= flake.speed) {
                flake.velY = flake.speed
            }
            flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
        }

        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
        flake.y += flake.velY;
        flake.x += flake.velX;
            
        if (flake.y >= canvas.height || flake.y <= 0) {
            reset(flake);
        }


        if (flake.x >= canvas.width || flake.x <= 0) {
            reset(flake);
        }

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill();
    }
    requestAnimationFrame(snow);
};

function reset(flake) {
    flake.x = Math.floor(Math.random() * canvas.width);
    flake.y = 0;
    flake.size = (Math.random() * 1) + 1;
    flake.speed = (Math.random() * 0.2) + 0.2;
    flake.velY = flake.speed;
    flake.velX = 0;
    flake.opacity = (Math.random() * 0.5) + 0.2;
}

function init() {
    for (var i = 0; i < flakeCount; i++) {
        var x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * canvas.height),
            size = (Math.random() * 1) + 2,
            speed = (Math.random() * 0.2) + 0.2,
            opacity = (Math.random() * 0.5) + 0.3;

        flakes.push({
            speed: speed,
            velY: speed,
            velX: 0,
            x: x,
            y: y,
            size: size,
            stepSize: (Math.random()) / 30,
            step: 0,
            opacity: opacity
        });
    }

    snow();
};

canvas.addEventListener("mousemove", function(e) {
    mX = e.clientX,
    mY = e.clientY
});

window.addEventListener("resize",function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

init();