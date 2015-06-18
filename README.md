# slush-globegraphic

A basic template to get you up and running FAST. Scaffolds the basic html, css, and javascript necessary for a responsive iframe graphic that plays nice with the Globe.

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Workflow](#workflow)
- [How to deploy](#how-to-deploy)
- [Why iframes?](#why-iframe)
- [Multiple embeds in a single article](#multiple-embeds)
- [ArchieML integration](#archieml-integration)
- [Standalone app](#standalone-app)

## TODO
- tell user what to do when done with slush, e.g. open preview.html, run gulp, etc.
- add README

## Instructions

### Prerequisites

- Install [slush](https://github.com/slushjs/slush) and [this generator](): `npm install -g slush slush-globegraphic`
- If the above gives you trouble, run it as super-user: `sudo npm install -g slush slush-globegraphic`
- Optional: if you want to commit to GitHub, install [hub](https://github.com/github/hub): `brew install hub`

### Quick start
To create a new graphic, create a new directory, `cd` into it, and run
    
    slush globegraphic

Follow all prompts.

### Run
To get development up and running:

	gulp

When you are ready to deploy to production:

	gulp prod

This will output the `index.html` and the `assets` folder in the `prod` directory. It can now be [deployed to server](#how-to-deploy).

### Workflow
This uses [gulp](http://gulpjs.com) for:
- live reloading
- css preprocessing with stylus
- js and css minifying / inlining for production
- es6 compiling
- handlebars for html rendering

All your code should go in the `src` folder:
- **html**: `src/index.html`
- **css**: `src/css/main.css`
- **js**: `src/js/main.js`
- **assets**: put your images, audio, etc. in `src/assets`

**Please note:**
This template now uses https. If you ever find yourself needing to make an absolute path reference, remember to use 'https' not 'http'.

If want to include a js library, [read this](#how-to-include-javascript-libraries).

### Style guide
The template comes equipped with base.css, a stylesheet containing reset, default Globe styles, text, and layouts. [See here](https://github.com/BostonGlobe/news-apps-docs/tree/master/style-guide) for documentation and how to utilize it.

### How to deploy
#### Step 1: put project files on server
- Create project directory on server. On a Mac, Finder -> Go -> Connect to Server.
- Enter `smb://widget.boston.com/web/bgapps/html` (username globe\first.last and password).
- Navigate to graphics/[year]/[month] and create a folder for your project (ex. graphics/2015/01/football-homerun).
- Copy over your all the files in the **src** folder to the server.
- Your project is now internally visible at http://dev.apps.bostonglobe.com/graphics/[year]/[month]/[project-name].
- Update these files whenever you want.

#### Step 2: create jpt
- In workbench, create a jpt as you would.
- In the **snippet.html** file, fill out the url to your project from above.
- Copy the code from **snippet.html** over to your jpt in workbench.
- Now you can slot the jpt in any article (or igraphic).
- **Note**: if using as an igraphic, add `<link rel='stylesheet' href='https://apps.bostonglobe.com/common/css/igraphic/igraphic-0.1.0.css'/>` to the top of the jpt.

#### Step 3: publish assets: 
- In Terminal, connect to shell (your username is usually first initial last name): `ssh rgoldenberg@shell.boston.com`.
- Navigate to your project directory: `cd /web/bgapps/html/graphics/[year]/[month]/[project-name]`.
- Run the command `upload *` in the root and each subdirectroy. (ex. `cd css` and run the command `upload *` to upload ALL files in that folder).
- In your jpt in workbench, simply change remove **dev** from the url and portal pub.

#### ArchieML integration
If you want to use [ArchieML](http://archieml.org) for copy/data templating, follow these steps:

- Create a Google Doc and make sure it is published and shared publicly
- Grab the Doc ID from the url (example: https://docs.google.com/document/d/XXXX-XXXXXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXX/edit)
- Insert the "XXXX-XX..." into copy.js

Whenever you want to pull down the latest from the Doc run:

	node copy.js

This will create a JSON file in `src/data/`. Now you can use [handlebars](http://handlebarsjs.com/) templates to insert the data. It will render to a normal .html file.

### How to include javascript libraries
Here is a list of the currently available libraries:

- [jquery](https://apps.bostonglobe.com/common/js/jquery/jquery-1.11.2.min.js)
- [lodash](https://apps.bostonglobe.com/common/js/lodash/lodash-3.9.3.min.js)
- [d3](https://apps.bostonglobe.com/common/js/d3/d3-3.5.5.min.js)
- [jplayer](https://apps.bostonglobe.com/common/js/jplayer/jquery.jplayer-2.9.2.min.js)
- [raf](https://apps.bostonglobe.com/common/js/raf/raf.min.js)
- [velocity](https://apps.bostonglobe.com/common/js/velocity/velocity-1.2.2.min.js)
- [waypoints](https://apps.bostonglobe.com/common/js/waypoints/noframework.waypoints-3.1.1.min.js)
- [imager](https://apps.bostonglobe.com/common/js/imager/imager-0.5.0.min.js)
- [mapbox](https://apps.bostonglobe.com/common/js/mapbox/mapbox-2.1.5.min.js)
- [moment](https://apps.bostonglobe.com/common/js/moment/moment-2.9.0.min.js)
- [handlebars (runtime)](https://apps.bostonglobe.com/common/js/handlebars/handlebars.runtime-2.0.0.min.js)
- [picturefill](https://apps.bostonglobe.com/common/js/picturefill/picturefill-2.3.0.min.js)
- [vivus](https://apps.bostonglobe.com/common/js/vivus/vivus-0.2.1.min.js)

To use, just add a script tag that points to these urls. If there is a library you would like added, talk to Russell.


### Why iframe?
I'm glad you asked...
- **No Globe conflicts**: The iframe gives the graphic a safety bubble. No worrying about the scope of variables, or how Globe stylesheets or scripts might affect your graphic. This also future-proofs your graphic. If (and when) the Globe introduces new namespacing, or changes a js lib you were relying on, you don't have to worry.
- **No inter-graphic conflicts**: If there are multiple graphics in a single story, you don't have to worry about namespacing conflicts here either, even if you re-use your own code or a generator of some sort.
- **No cross-origin issues**: Since all content is on the same domain and relatively referenced, there will never be strange cross-origin issues (like on audio files...). 
- **Simpler development**: No need to simulate the Globe environment. Things will look and behave 100% the same locally and in production.
- **Long term viability**: Since you are writing code oustide of the Globe ecosystem, you don't have to do anything hacky or magical that might be Methode specific. You create a standalone web project. It will work when we start using another CMS.
- **Embeddable**: The small snippet of code in `snippet.html` can be integrated into almost any other CMS, which means other news organization or blogs can run our graphics (if we so desire).

### Multiple embeds
1. Create each graphic as a standalone project.
2. In the snippet.html file, create incrementing ids for each `div` id:
	- `id='globe-graphic-embed-1'...` --> `id='globe-graphic-embed-2'` etc, etc
3. In snippet.html, remove *all* `<script>` tags and their content *except* for the last graphic.
4. Copy the two lines between the `<script>` tags and paste them as many times as you have grahpics, updating them to correspond with the #ids. So if you have two graphics, it would look like this:

```html
<script>
	var pymParent1 = new pym.Parent('globe-graphic-embed-1', 'src/index.html', {});
    var pymParent2 = new pym.Parent('globe-graphic-embed-2', 'src/index.html', {});
</script>
```

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
2. In the `snippet.html` file, add the following below the line `var pymParent1...`:
```js 
	pymParent1.onMessage('height-request', function(msg) { pymParent1.sendMessage('height-send', window.innerHeight); });
```
3. Replace the entire `snippet.html` code in `embed.html`.

## Standalone app (outdated - left here for reference)
For creating standalone apps on apps.bostonglobe.com.

Follow the [basic setup instructions](#instructions). Then run:
	
	make app

By default, the standalone app uses the [awesome-ified workflow](#awesome-ify-your-workflow-optional). It makes some changes to the html to:
- Remove iframe code
- Add omniture tracking code
- Add proper meta tags for SEO
- Include standard Globe header

See the README for detailed instructions.

### Developer note
[Makefile lives here](https://gist.github.com/russellgoldenberg/a653228f1a0b81b454d1)

## License & Credits

Released under the MIT open source license. See `LICENSE` for details.

Super thanks to [NPR Visuals](http://github.com/nprapps) team for [pym.js](https://github.com/nprapps/pym.js).