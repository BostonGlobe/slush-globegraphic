var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var webpack = require('webpack-stream');

gulp.task('js-dev', function() {
	return gulp.src('src/js/main.js')
		.pipe(webpack({
			module: {
				loaders: [
					{ test: /\.js$/, exclude: /node_modules/, loader: 'babel'}
				]
			}
		}))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist/dev/js'))
		.pipe(browserSync.reload({stream:true}));
});

//jshint and uglify js files
gulp.task('js-prod', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(babel())
		.pipe(uglify())
		.pipe(gulp.dest('.tmp/js'));
});