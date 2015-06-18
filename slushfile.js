var gulp = require('gulp');
var inquirer = require('inquirer');
var runSequence = require('run-sequence');
var shell = require('shelljs');
var request = require('request');
var fs = require('fs');
var chalk = require('chalk');
var moment = require('moment');
var s = require('underscore.string');

function printError(library) {
	console.log(chalk.red("Looks like you didn't install " + library + ". Make sure to install all prerequisites, as detailed in " + chalk.underline.red('https://github.com/BostonGlobe/slush-globegraphic#prerequisites.')));
}

function getGraphicName() {
	return s.slugify(shell.pwd().split('/').slice(-1)[0]) + '_' + moment().format('YYYY-M-D');
}

function initGitRepo() {
	shell.exec('git init');
	shell.exec('git ignore node_modules');
	shell.exec('git add .');
	shell.exec('git commit -m "first commit"');
}

function pushGitRepo() {
	shell.exec('git push -u origin master');
}

gulp.task('check-for-prerequisites', function(done) {

	['hub'].forEach(function(value) {
		if (!shell.which(value)) {
			printError(value);
			shell.exit(1);
		}
	});
	done();
});

gulp.task('download-globe-graphic-template', function(done) {

	request('https://github.com/russellgoldenberg/globe-graphic-template/archive/master.zip')
		.pipe(fs.createWriteStream('master.zip'))
		.on('close', function () {
			shell.exec('unzip -q master.zip');
			shell.exec('mv globe-graphic-template-master/* .');
			shell.exec('rm -rf master.zip globe-graphic-template-master src/css/main.css LICENSE README.md');
			shell.sed('-i', "'src/index.html'", "'dist/dev/index.html'", 'embed.html');
			done();
		});

});

gulp.task('copy-templates-directory', function(done) {

	gulp.src(__dirname + '/templates/**')
		.pipe(gulp.dest('./'))
		.on('finish', function() {
			console.log('This will take about ten seconds. Take two deep breaths.');
			shell.exec('mkdir src/html');
			shell.exec('mv src/index.html src/html/index.hbs');
			shell.exec('unzip -q node_modules.zip');
			shell.exec('rm -rf node_modules.zip');
			shell.sed('-i', '||YEAR||', new Date().getFullYear(), 'LICENSE');
			done();	
		});

});

gulp.task('add-to-git-repo', function(done) {

	inquirer.prompt([
		{
			type: 'list',
			name: 'git',
			message: 'Add ' + getGraphicName() + ' to git repository?',
			choices: [
				'None',
				'GitHub',
				'Bitbucket'
			]
		}
	],
	function(answers) {

		switch(answers.git) {

			case 'None':
			break;
			case 'GitHub':
				initGitRepo();
				shell.exec('hub create BostonGlobe/' + getGraphicName() + ' -p');
				pushGitRepo();
			break;
			case 'Bitbucket':
				initGitRepo();
			break;
		}

		done();
	});

});

gulp.task('default', function(done) {

	runSequence(
		'check-for-prerequisites',
		'download-globe-graphic-template',
		'copy-templates-directory',
		'add-to-git-repo',
		done
	);

});