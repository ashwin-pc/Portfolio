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