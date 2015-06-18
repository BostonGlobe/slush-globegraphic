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
			console.log('This will take about ten seconds. Take two deep breaths.');
			shell.exec('mkdir src/html');
			shell.exec('mv src/index.html src/html/index.hbs');
			shell.exec('unzip -q node_modules.zip');
			shell.exec('rm -rf node_modules.zip');
			shell.sed('-i', '||YEAR||', new Date().getFullYear(), 'LICENSE');
			shell.sed('-i', '||GRAPHIC||', getGraphicName(), 'README.md');
			shell.sed('-i', "'js/main.js'", "'js/bundle.js'", 'src/html/index.hbs');
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

	runSequence(
		'download-globe-graphic-template',
		'copy-templates-directory',
		'add-to-git-repo',
		done
	);

});