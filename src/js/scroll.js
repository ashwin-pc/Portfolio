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