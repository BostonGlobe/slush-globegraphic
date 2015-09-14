'use strict';

var gulp        = require('gulp');
var inquirer    = require('inquirer');
var runSequence = require('run-sequence');
var rename      = require('gulp-rename');
var _           = require('lodash');
var path        = require('path');
var template    = require('gulp-template');
var vinylPaths  = require('vinyl-paths');
var del         = require('del');
var moment      = require('moment');
var s           = require('underscore.string');
var shell       = require('shelljs');

// var request     = require('request');
// var fs          = require('fs');
// var pkg         = require('./package.json');

var graphicName = [moment().format('YYYY-MM-DD'), s.slugify(shell.pwd().split('/').slice(-1)[0])].join('_');

gulp.task('default', function(done) {

	var questions = [
		{
			type: 'confirm',
			message: 'Add R data analysis setup folder',
			name: 'R',
			default: true
		}
	];

	function handleAnswers(answers) {

		runSequence(
			'copy-files',
			'populate-templates',
			done
		);

	}

	inquirer.prompt(questions, handleAnswers);

});

gulp.task('copy-files', function() {

	console.log('This will take a minute. Take two deep breaths.');

	return gulp.src(__dirname + '/template/**', {dot: true})
		.pipe(gulp.dest('./'));

});

gulp.task('populate-templates', function() {

	// find all .template files,
	// delete them,
	// create a new file without the .template,
	// and run them through gulp-template
	return gulp.src(['./**/*.template', '!node_modules/**'], {dot:true})
		.pipe(vinylPaths(del))
		.pipe(rename(function(p) {

			// get filename without .template at the end
			var filename = (p.basename + p.extname).replace(/.template$/, '');

			// tell rename how to rename this filename
			p.extname = path.extname(filename);
			p.basename = path.basename(filename, p.extname);

		}))
		.pipe(template({
			graphicName: graphicName,
			year: moment().year()
		}))
		.pipe(gulp.dest('.'));

});

// var config = {
// 	webpack: false,
// 	sublimeProject: false
// };

// function ignoreFiles() {

// 	if (!config.sublimeProject) {
// 		shell.exec('rm globegraphic.sublime-project');
// 	}

// 	shell.sed('-i', /GRRAAPHIC/g, getGraphicName(), '.gitignore');
// }

// function initGitRepo() {

// 	ignoreFiles();
// 	shell.exec('git init');
// 	shell.exec('git add .');
// 	shell.exec('git commit -m "first commit"');

// }

// function pushGitRepo() {
// 	shell.exec('git push -u origin master');
// }

// gulp.task('download-globe-graphic-template', function(done) {

// 	// download globe-graphic-template (the starting point for this graphic),
// 	// unzip, delete unwanted files
// 	// make preview.html point to dist/dev/index.html, since we'll have two
// 	// dist folders (dev and prod)
// 	request('https://github.com/BostonGlobe/globe-graphic-template/archive/v1.0.0.zip')
// 		.pipe(fs.createWriteStream('master.zip'))
// 		.on('close', function() {
// 			shell.exec('unzip -q master.zip');
// 			shell.exec('mv globe-graphic-template-master/* .');
// 			shell.exec('rm -rf master.zip globe-graphic-template-master src/css/main.css LICENSE README.md');
// 			shell.sed('-i', '\'src/index.html\'', '\'dist/dev/index.html\'', 'preview.html');
// 			done();
// 		});

// });

// gulp.task('copy-templates-directory', function(done) {

// 	gulp.src(__dirname + '/templates/**')
// 		.pipe(gulp.dest('./'))
// 		.on('finish', function() {

// 			// make user feel at ease
// 			console.log('This will take about ten seconds. Take two deep breaths.');

// 			shell.exec('mv gitignore .gitignore');
// 			shell.exec('mv jscsrc .jscsrc');

// 			shell.exec('mkdir src/html');
// 			shell.exec('mv src/index.html src/html/index.hbs');

// 			// unzip node modules
// 			shell.exec('unzip -q node_modules.zip');
// 			shell.exec('rm -rf node_modules.zip');

// 			// add correct year to LICENSE
// 			shell.sed('-i', '||YEAR||', new Date().getFullYear(), 'LICENSE');

// 			// add correct graphic name to README
// 			shell.sed('-i', /GRRRAPHIC/g, getGraphicName(), 'README.md');

// 			if (config.webpack) {

// 				// replace reference to js/main.js to js/bundle.js
// 				shell.sed('-i', '\'js/main.js\'', '\'js/bundle.js\'', 'src/html/index.hbs');

// 				// rename js/main-webpack.js to js/main.js
// 				shell.exec('mv src/js/main-webpack.js src/js/main.js');

// 				// remove references to pym and globe iframe, since we'll require them instead
// 				shell.sed('-i', /<!-- \(begin\) globe iframe embed -->([\s\S]*)<!-- \(end\) -->/, '', 'src/html/index.hbs');

// 				// remove references to jquery, since we'll require it instead
// 				shell.sed('-i', /<!-- \(begin\) js libraries optional([\s\S]*)<!-- \(end\) -->/, '', 'src/html/index.hbs');

// 				// remove the non-webpack js task
// 				shell.exec('rm gulp-tasks/js.js');

// 				// rename webpack js task to regular js task
// 				shell.exec('mv gulp-tasks/js-webpack.js gulp-tasks/js.js');

// 			} else {

// 				// remove the webpack js task
// 				shell.exec('rm gulp-tasks/js-webpack.js');

// 				// remove js/main-webpack.js
// 				shell.exec('rm src/js/main-webpack.js');
// 			}

// 			if (config.R) {

// 				// change title: "data" to something appropriate
// 				shell.sed('-i', /GRRRAPHIC/g, getGraphicName(), 'data/data.Rmd');

// 				// rename data.Rmd
// 				shell.exec('mv data/data.Rmd data/' + getGraphicName() + '.Rmd');

// 				// change makefile
// 				shell.sed('-i', /GRRRAPHIC/g, getGraphicName(), 'data/Makefile');

// 				// move makefile
// 				shell.exec('mv data/Makefile .');

// 			} else {

// 				shell.exec('rm -rf data');
// 			}

// 			done();
// 		});

// });

// gulp.task('add-to-git-repo', function(done) {

// 	var hasHub = shell.which('hub');
// 	var choices = ['None', 'Bitbucket'];
// 	if (hasHub) {
// 		choices.push('GitHub');
// 	}

// 	var questions = [
// 		{
// 			type: 'list',
// 			name: 'git',
// 			message: 'Add ' + getGraphicName() + ' to git repository?',
// 			choices: choices
// 		}
// 	];

// 	function handleAnswers(answers) {

// 		switch (answers.git) {

// 			case 'None':
// 				done();
// 				break;

// 			case 'Bitbucket':

// 				var innerQuestions = [
// 					{
// 						type: 'input',
// 						name: 'username',
// 						message: 'Enter your Bitbucket username'
// 					}
// 				];

// 				function handleInnerAnswers(innerAnswers) {

// 					var username = innerAnswers.username;

// 					initGitRepo();
// 					shell.exec('curl -X POST -v -u ' + username + ' -H "Content-Type: application/json" https://api.bitbucket.org/2.0/repositories/bostonglobe/' + getGraphicName() + ' -d \'{"scm": "git", "is_private": "true" }\'');

// 					shell.exec('git remote add origin https://' + username + '@bitbucket.org/bostonglobe/' + getGraphicName() + '.git');
// 					pushGitRepo();
// 					done();

// 				}

// 				inquirer.prompt(innerQuestions, handleInnerAnswers);
// 				break;

// 			case 'GitHub':

// 				initGitRepo();
// 				shell.exec('hub create BostonGlobe/' + getGraphicName() + ' -p');
// 				pushGitRepo();
// 				done();
// 				break;
// 		}

// 	}

// 	inquirer.prompt(questions, handleAnswers);

// });

// gulp.task('default', function(done) {

// 	var questions = [
// 		{
// 			type: 'confirm',
// 			message: 'Add webpack, a module loader',
// 			name: 'webpack',
// 			default: true
// 		},
// 		{
// 			type: 'confirm',
// 			message: 'Add sublime project file',
// 			name: 'sublimeProject',
// 			default: false
// 		},
// 		{
// 			type: 'confirm',
// 			message: 'Add R data analysis setup folder',
// 			name: 'R',
// 			default: true
// 		}
// 	];

// 	function handleAnswers(answers) {

// 		config = answers;

// 		runSequence(
// 			'download-globe-graphic-template',
// 			'copy-templates-directory',
// 			'add-to-git-repo',
// 			done
// 		);

// 	}

// 	inquirer.prompt(questions, handleAnswers);

// });
