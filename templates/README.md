# GRRRAPHIC

This project was generated with [slush-globegraphic](https://github.com/BostonGlobe/slush-globegraphic). Consult its [README](https://github.com/BostonGlobe/slush-globegraphic) for more information.

*Please note: do not reproduce Boston Globe logos or fonts without written permission.*

- [Quick start](#quick-start)
- [Workflow](#workflow)
- [How to deploy](https://github.com/russellgoldenberg/globe-graphic-template#how-to-deploy)
- [Why iframes?](#why-iframe)
- [Multiple embeds in a single article](#multiple-embeds)]

### Run
To get development up and running:

	gulp

When you are ready to deploy to production:

	gulp prod

This will output the `index.html` and the `assets` folder in the `dist/prod` directory. It can now be [deployed to server](https://github.com/russellgoldenberg/globe-graphic-template#how-to-deploy).

### Workflow
This uses [gulp](http://gulpjs.com) for:
- live reloading
- css preprocessing with stylus
- js and css minifying / inlining for production
- es6 compiling
- handlebars for html rendering

All your code should go in the `src` folder:
- **html**: `src/index.html`
- **css**: `src/css/main.styl`
- **js**: `src/js/main.js`
- **assets**: put your images, audio, etc. in `src/assets`

**Please note:**
This template now uses https. If you ever find yourself needing to make an absolute path reference, remember to use 'https' not 'http'.

If want to include a js library, [read this](#how-to-include-javascript-libraries).

### Style guide
The template comes equipped with base.css, a stylesheet containing reset, default Globe styles, text, and layouts. [See here](https://github.com/BostonGlobe/news-apps-docs/tree/master/style-guide) for documentation and how to utilize it.

### How to include javascript libraries
Here is a list of the currently available libraries:

- [jquery](https://apps.bostonglobe.com/common/js/jquery/jquery-1.11.2.min.js): DOM operations
- [lodash](https://apps.bostonglobe.com/common/js/lodash/lodash-3.9.3.min.js): utilities
- [d3](https://apps.bostonglobe.com/common/js/d3/d3-3.5.5.min.js): Visualization
- [jplayer](https://apps.bostonglobe.com/common/js/jplayer/jquery.jplayer-2.9.2.min.js): HTML5 audio/video
- [raf](https://apps.bostonglobe.com/common/js/raf/raf.min.js): Request Animation Frame polyfill
- [velocity](https://apps.bostonglobe.com/common/js/velocity/velocity-1.2.2.min.js): Animation
- [waypoints](https://apps.bostonglobe.com/common/js/waypoints/noframework.waypoints-3.1.1.min.js): Scroll triggers
- [imager](https://apps.bostonglobe.com/common/js/imager/imager-0.5.0.min.js): Responsive images
- [picturefill](https://apps.bostonglobe.com/common/js/picturefill/picturefill-2.3.0.min.js): Responsive images
- [mapbox](https://apps.bostonglobe.com/common/js/mapbox/mapbox-2.1.5.min.js): Maps
- [moment](https://apps.bostonglobe.com/common/js/moment/moment-2.9.0.min.js): Time and dates
- [handlebars (runtime)](https://apps.bostonglobe.com/common/js/handlebars/handlebars.runtime-2.0.0.min.js): Client-side templating
- [vivus](https://apps.bostonglobe.com/common/js/vivus/vivus-0.2.1.min.js): SVG line path animation

To use, just add a script tag that points to these urls. If there is a library you would like added, talk to Russell.

### Why iframe?
I'm glad you asked...
- **No Globe conflicts**: The iframe gives the graphic a safety bubble. No worrying about the scope of variables, or how Globe stylesheets or scripts might affect your graphic. This also future-proofs your graphic. If (and when) the Globe introduces new namespacing, or changes a js lib you were relying on, you don't have to worry.
- **No inter-graphic conflicts**: If there are multiple graphics in a single story, you don't have to worry about namespacing conflicts here either, even if you re-use your own code or a generator of some sort.
- **No cross-origin issues**: Since all content is on the same domain and relatively referenced, there will never be strange cross-origin issues (like on audio files...). 
- **Simpler development**: No need to simulate the Globe environment. Things will look and behave 100% the same locally and in production.
- **Long term viability**: Since you are writing code oustide of the Globe ecosystem, you don't have to do anything hacky or magical that might be Methode specific. You create a standalone web project. It will work when we start using another CMS.
- **Embeddable**: The small snippet of code in `methode.html` can be integrated into almost any other CMS, which means other news organization or blogs can run our graphics (if we so desire).

### When not to use iframes
Iframes are great for the reasons mentioned above. If your graphic necessitates having one of the following features however, you might want to reconsider your design or the use of iframe.
- If you need to have a fixed element while the user scrolls
- If a user action jumps the scroll bar

While there are workarounds that involve setting up messaging between the parent and child, anything involving manipulating the scroll position is advised against.

### Get parent height
Sometimes you want to do a thing based on the height of the browser (ie. make a map take up 2/3 of the browser). In order to get the height of the parent window, you must add these two code snippets:

1. In `src/main.js`, add the following directly below the instructional comments:
```js
	/*** get parent height.... ***/
	window.pymChild.sendMessage('height-request', true);
	window.pymChild.onMessage('height-send', function(msg) {
		var initialHeight = +msg;
		/*** call a function here, passing it the "initialHeight" variable ***/
		//example: createChart(initialHeight);
	});
```
2. At the bottom of `methode.html` file, add the following below the line `var pymParent1...`:
```js 
	pymParent1.onMessage('height-request', function(msg) { pymParent1.sendMessage('height-send', window.innerHeight); });
```
3. Add the above code after the same line in `preview.html`.

## License & Credits

Released under the MIT open source license. See `LICENSE` for details.

Super thanks to [NPR Visuals](http://github.com/nprapps) team for [pym.js](https://github.com/nprapps/pym.js).