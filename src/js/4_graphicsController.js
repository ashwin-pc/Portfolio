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
    cellFront.dataset.index = index;
    cellFront.style.backgroundImage = "url(" + object.link + ")";

    // Append
    cell.appendChild(cellFront);

    // Store the details in object Array
    if(excess) {
      tileImgArr = objectArray;
      tileImgArr.forEach(function(tile, index) {
        if(index < 12) {
          tile.visible = true;
        } else {
          tile.visible = false;
        }
      }, this);
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
        console.log("before array");
        for (index = 0; index < tileImgArr.length; index++) {
          var pIndex = parseInt(liveTiles[rand].dataset.index);
          if(!tileImgArr[index].visible && index!=rand && index!=pIndex) {
            liveTiles[rand].style.backgroundImage = "url(" + tileImgArr[index].link + ")";
            liveTiles[rand].dataset.link = tileImgArr[index].fullLink || tileImgArr[index].link;
            liveTiles[rand].dataset.index = index;
            tileImgArr[index].visible = true;
            tileImgArr[pIndex].visible = false;
            console.log(index, rand, pIndex);
            return;
          }
        };
      }, animationTime/2);
    }
  }
  
}