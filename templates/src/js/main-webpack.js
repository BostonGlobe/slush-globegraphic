'use strict';
var globeIframe = require('globe-iframe-resizer');

// This fires when the parent of iframe resizes
var onPymParentResize = function(width) {};

globeIframe(onPymParentResize);

// graphic functions
var init = function() {
	if (window.console && console.log) console.log('-- init globe graphic --');
};

init();