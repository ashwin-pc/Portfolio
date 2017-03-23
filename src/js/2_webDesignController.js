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
$ajax(firebaseBaseUrl+"websites.json", function (err,snapshot) {
  if (err) {
    errorToast("Could not retrieve Web Page Designs, Try Again")
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