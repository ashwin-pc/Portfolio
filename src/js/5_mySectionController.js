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