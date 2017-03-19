/*
 * Graphics Controller
 * purpose: To display featured graphics designs from firebase storage.
 * TODO: To live update and shuffle tiles
 * 
 */
var liveTiles;
var tileImgArr;
var excess = 0;

function _makeTiles(objectArray) {
  var imageViewer = document.getElementById('imageViewer');
  var docFrag = document.createDocumentFragment();
  
  excess = (objectArray.length > 12) ? objectArray.length - 12 : 0;

  objectArray.forEach(function (object,index) {
    var cell = document.createElement('div');
    var cellFront = document.createElement('div');

    cell.className = 'image';

    // Front of Tile
    cellFront.classList.add('live-tile');
    cellFront.dataset.link = object.fullLink || object.link;
    cellFront.style.backgroundImage = "url(" + object.link + ")";

    // Append
    cell.appendChild(cellFront);

    // Store the details in object Array
    if(excess && index > 11) {
      cellFront.dataset.visible = false;
    }


    // Add event listners
    cell.addEventListener('click', function (e) {
      imageViewer.style.display = 'block';
      imageViewer.children[0].src = e.target.dataset.link;
    });
    imageViewer.addEventListener('click', function (e) {
      imageViewer.style.display = 'none';
    });

    // Append cells to document fragment
    docFrag.appendChild(cell);
  });
  return docFrag;
}

// Initialize Cells
dbRefGraphics.once('value').then(function (snapshot) {
  var graphicsContainer = document.getElementById('graphicsContainer');
  var tiles = _makeTiles(snapshot.val());
  graphicsContainer.appendChild(tiles);

  // save live tile references
  liveTiles = graphicsContainer.getElementsByClassName('live-tile');
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