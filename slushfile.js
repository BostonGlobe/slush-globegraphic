var gulp = require('gulp');
var inquirer = require('inquirer');
var runSequence = require('run-sequence');
var shell = require('shelljs');
var request = require('request');
var fs = require('fs');
var chalk = require('chalk');
var moment = require('moment');
var s = require('underscore.string');

var config = {
	webpack: false,
	sublimeProject: false
};

function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

function printError(library) {
	console.log(chalk.red("Looks like you didn't install " + library + ". Make sure to install all prerequisites, as detailed in " + chalk.underline.red('https://github.com/BostonGlobe/slush-globegraphic#prerequisites.')));
}

function getGraphicName() {
	return [moment().format('YYYY-M-D'), s.slugify(shell.pwd().split('/').slice(-1)[0])].join('_');
}

function initGitRepo() {
	shell.exec('git init');
	shell.exec('git ignore node_modules');
	shell.exec('git ignore dist');
	shell.exec('git add .');
	shell.exec('git commit -m "first commit"');
}

function pushGitRepo() {
	shell.exec('git push -u origin master');
}

gulp.task('download-globe-graphic-template', function(done) {

	request('https://github.com/russellgoldenberg/globe-graphic-template/archive/master.zip')
		.pipe(fs.createWriteStream('master.zip'))
		.on('close', function () {
			shell.exec('unzip -q master.zip');
			shell.exec('mv globe-graphic-template-master/* .');
			shell.exec('rm -rf master.zip globe-graphic-template-master src/css/main.css LICENSE README.md');
			shell.sed('-i', "'src/index.html'", "'dist/dev/index.html'", 'preview.html');
			done();
		});

});

gulp.task('copy-templates-directory', function(done) {

	gulp.src(__dirname + '/templates/**')
		.pipe(gulp.dest('./'))
		.on('finish', function() {

			// make user feel at ease
			console.log('This will take about ten seconds. Take two deep breaths.');

			shell.exec('mkdir src/html');
			shell.exec('mv src/index.html src/html/index.hbs');

			// unzip node modules
			shell.exec('unzip -q node_modules.zip');
			shell.exec('rm -rf node_modules.zip');

			// add correct year to LICENSE
			shell.sed('-i', '||YEAR||', new Date().getFullYear(), 'LICENSE');

			// add correct graphic name to README
			shell.sed('-i', '||GRAPHIC||', getGraphicName(), 'README.md');

			if (config.webpack) {

				// replace reference to js/main.js to js/bundle.js
				shell.sed('-i', "'js/main.js'", "'js/bundle.js'", 'src/html/index.hbs');

				// rename js/main-webpack.js to js/main.js
				shell.exec('mv src/js/main-webpack.js src/js/main.js');

				// remove references to pym and globe iframe, since we'll require them instead
				shell.sed('-i', /<!-- \(begin\) globe iframe embed -->([\s\S]*)<!-- \(end\) -->/, "", 'src/html/index.hbs');

				// remove references to jquery, since we'll require it instead
				shell.sed('-i', /<!-- \(begin\) js libraries optional([\s\S]*)<!-- \(end\) -->/, "", 'src/html/index.hbs');

				// remove the non-webpack js task
				shell.exec('rm gulp-tasks/js.js');

				// rename webpack js task to regular js task
				shell.exec('mv gulp-tasks/js-webpack.js gulp-tasks/js.js');

			} else {

				// remove the webpack js task
				shell.exec('rm gulp-tasks/js-webpack.js');

				// remove js/main-webpack.js
				shell.exec('rm src/js/main-webpack.js');
			}

			if (!config.sublimeProject) {
				shell.exec('rm globegraphic.sublime-project');
			}

			done();
		});

});

gulp.task('add-to-git-repo', function(done) {

	var hasHub = shell.which('hub');
	var choices = ['None', 'Bitbucket'];
	if (hasHub) {
		choices.push('GitHub');
	}

	inquirer.prompt([
		{
			type: 'list',
			name: 'git',
			message: 'Add ' + getGraphicName() + ' to git repository?',
			choices: choices
		}
	], function(answers) {

		switch(answers.git) {

			case 'None':
				done();
			break;
			case 'Bitbucket':
				inquirer.prompt([
					{
						type: 'input',
						name: 'username',
						message: 'Enter your Bitbucket username'
					},
					{
						type: 'password',
						name: 'password',
						message: 'Enter your Bitbucket password'
					}
				], function(answers) {

					initGitRepo();
					shell.exec("curl --user " + answers.username + ":" + answers.password + " https://api.bitbucket.org/1.0/repositories/ --data name=" + getGraphicName() + " --data is_private='true'");
					shell.exec("git remote add origin https://" + answers.username + "@bitbucket.org/" + answers.username + "/" + getGraphicName() + ".git");
					pushGitRepo();
					done();
				});
			break;
			case 'GitHub':
				initGitRepo();
				shell.exec('hub create BostonGlobe/' + getGraphicName() + ' -p');
				pushGitRepo();
				done();
			break;
		}

	});

});

gulp.task('default', function(done) {

	inquirer.prompt([
		{
			type: 'confirm',
			message: 'Add webpack, a module loader',
			name: 'webpack',
			default: true
		},
		{
			type: 'confirm',
			message: 'Add sublime project file',
			name: 'sublimeProject',
			default: true
		}
	], function(answers) {

		config = answers;

		runSequence(
			'download-globe-graphic-template',
			'copy-templates-directory',
			'add-to-git-repo',
			done
		);

	});

});