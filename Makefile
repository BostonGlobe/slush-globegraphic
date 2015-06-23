all:

	# clean files
	cd templates; rm node_modules.zip package.json;

	# make a blank package.json
	cd templates; echo '{"dependencies":{}}' >> package.json

	# npm install modules
	cd templates; sudo npm install --save \
		animation-frame \
		archieml \
		babel-core \
		babel-loader \
		browser-sync \
		del \
		dsv-loader \
		globe-iframe-resizer \
		gulp \
		gulp-autoprefixer \
		gulp-babel \
		gulp-callback \
		gulp-changed \
		gulp-combine-media-queries \
		gulp-hb \
		gulp-minify-css \
		gulp-plumber \
		gulp-rename \
		gulp-smoosher \
		gulp-stylus \
		gulp-uglify \
		node-libs-browser \
		pym.js \
		request \
		require-dir \
		run-sequence \
		webpack-stream;

	# make node_modules.zip
	cd templates; zip -q -r node_modules.zip node_modules;

	# rm node_modules
	cd templates; sudo rm -rf node_modules;
