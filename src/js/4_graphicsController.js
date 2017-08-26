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

/**
 * Handles loaded Full size Image and scales it to the correct screen size
 * @param {Event} e Load image Event
 */
function _imageLoadHandler(e) {
  var ratio = Math.max(e.target.naturalHeight/window.innerHeight,e.target.naturalWidth/window.innerWidth);

  imageEle.style.height = (e.target.naturalHeight / ratio * 0.8) + 'px';
  imageEle.style.width = (e.target.naturalWidth / ratio * 0.8) + 'px';
  imageEle.style.scale = 0;
  imageEle.classList.add("animate");
  spinningLoaderEle.classList.remove("show");
}

/**
 * _makeTiles()
 * Creates Tile objects and instantiates their animation
 * @param {Array} objectArray Array of Image objects
 */
function _makeTiles(objectArray) {
  var docFrag = document.createDocumentFragment();
  var loadedImages = 0;
  
  imageEle.children[0].addEventListener('load', _imageLoadHandler);
  excess = (objectArray.length > 12) ? objectArray.length - 12 : 0; // nunber of excess images to swap with

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
    addLoader(cellFront);
    bgImg.onload = function(){
      removeLoader(cell);
      loadedImages++;
      cellFront.style.backgroundImage = 'url(' + bgImg.src + ')';
      if (loadedImages == objectArray.length) {
        _liveLoop();
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

// Fire Tile update randomly at random intervals
function _liveLoop() {  
  var min = 100; 
  var max = 1000;
  var rand = getRandomInt(min,max);
  setTimeout(function() {
    _updateTile();
    _liveLoop();  
  }, rand);
};

// Tile updating function
function _updateTile() {
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

/**
 * Initialization of the Controller
 */
$ajax(_firebaseBaseUrl+"graphics.json", function (err, snapshot) {
  if (err) {
    toastContainer.toast("Could not retrieve Graphic Designs, Try again.")
    return;
  }
  var graphicsContainer = document.getElementById('graphicsContainer');
  var tiles = _makeTiles(snapshot);
  graphicsContainer.appendChild(tiles);

  // save live tile references
  liveTiles = graphicsContainer.getElementsByClassName('live-tile');
});