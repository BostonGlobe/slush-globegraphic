/* request animation frame polyfill */
(function(){var e=0;var t=["ms","moz","webkit","o"];for(var n=0;n<t.length&&!window.requestAnimationFrame;++n){window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(t,n){var r=(new Date).getTime();var i=Math.max(0,16-(r-e));var s=window.setTimeout(function(){t(r+i)},i);e=r+i;return s};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=function(e){clearTimeout(e)}})();

/* russell's special sauce */
(function() {
	'use strict';
	window.pymChild = null;
	
	var init = function() {
		setupPym();
	};

	var setupPym = function() {

		// grab the iframe graphic's container
		var container = document.getElementById('globe-graphic-container');
		if(container) {
			var height = {previous: 0, current: 0};
			
			var pollHeight = function() {

				// set current.height to the container's actual height
				height.current = container.offsetHeight;

				// if current.height is different than current.previous,
				if(height.current !== height.previous) {

					// set current.previous to the actual height RIGHT NOW
					height.previous = height.current;

					// and notify pym
					window.pymChild.sendHeight();
				}

				// loop this forever with rAF
				requestAnimationFrame(pollHeight);
			};

			// make pym available globally (why?)
			window.pymChild = pym.Child({ renderCallback: window.onPymParentResize });

			// start polling height
			pollHeight();
		}
	};

	// start the whole thing
	init();
})();