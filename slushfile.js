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
var del         = require('del');
var fs          = require('fs');

var graphicName = [moment().format('YYYY-MM-DD'), s.slugify(shell.pwd().split('/').slice(-1)[0])].join('_');
var globalAnswers = {
	graphicName: graphicName,
	year: moment().year()
};

function askGeneralQuestions(callback) {

	var questions = [
		{
			type: 'confirm',
			message: 'Add R data analysis setup folder',
			name: 'R',
			default: true
		},
		{
			type: 'list',
			message: 'Choose a production environment',
			name: 'env',
			choices: [
				'apps.bostonglobe.com',
				'Methode'
			]
		}
	];

	inquirer.prompt(questions, function(answers) {
		callback(answers);
	});

}

function askAppsQuestions(callback) {

	var questions = [
		{
			type: 'input',
			name: 'username',
			message: 'Enter your shell username'
		},
		{
			type: 'input',
			name: 'filepath',
			message: 'Enter the path to your graphic [year]/[month]/[day-graphicName]'
		}
	];

	inquirer.prompt(questions, function(answers) {
		callback(answers);
	});
}

gulp.task('default', function(done) {

	askGeneralQuestions(function(generalAnswers) {

		if (generalAnswers.env === 'apps.bostonglobe.com') {

			askAppsQuestions(function(appsAnswers) {

				globalAnswers = _.assign(globalAnswers, generalAnswers, appsAnswers);

				runSequence(
					'copy-files',
					globalAnswers.R ? 'no-op' : 'delete-R-folder',
					'populate-templates',
					'add-to-git-repo',
					done
				);

			});

		} else {

			globalAnswers = _.assign(globalAnswers, generalAnswers);

			runSequence(
				'copy-files',
				globalAnswers.R ? 'no-op' : 'delete-R-folder',
				'populate-templates',
				'add-to-git-repo',
				done
			);

		}

	});

});

gulp.task('delete-R-folder', function() {

	return del([
		'data'
	]);

});

gulp.task('no-op', function(done) {
	done();
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
			var filename = (p.basename + p.extname)
				.replace(/.template$/, '')
				.replace(/GRAPHIC_NAME/, graphicName);

			// tell rename how to rename this filename
			p.extname = path.extname(filename);
			p.basename = path.basename(filename, p.extname);

		}))
		.pipe(template(globalAnswers))
		.pipe(gulp.dest('.'));

});

function initGitRepo() {
	shell.exec('git init');
	shell.exec('git add .');
	shell.exec('git commit -m "first commit"');
}

function pushGitRepo() {
	shell.exec('git push -u origin master');
}

function addToBitbucket(answers, callback) {

	var username = answers.username;

	initGitRepo();
	shell.exec('curl -X POST -u ' + username + ' -H "Content-Type: application/json" https://api.bitbucket.org/2.0/repositories/bostonglobe/' + graphicName + ' -d \'{"scm": "git", "is_private": "true" }\'');
	shell.exec('git remote add origin https://' + username + '@bitbucket.org/bostonglobe/' + graphicName + '.git');
	pushGitRepo();
	callback();

}

function addToGithub(callback) {

	initGitRepo();
	shell.exec('hub create BostonGlobe/' + graphicName + ' -p');
	pushGitRepo();
	callback();

}

gulp.task('add-to-git-repo', function(done) {

	var hasHub = shell.which('hub');
	var choices = ['None', 'Bitbucket'];
	if (hasHub) {
		choices.push('GitHub');
	}

	var questions = [
		{
			type: 'list',
			name: 'git',
			message: 'Add ' + graphicName + ' to git repository?',
			choices: choices
		}
	];

	function handleAnswers(answers) {

		switch (answers.git) {

			case 'None':

				done();
				break;

			case 'Bitbucket':

				var innerQuestions = [
					{
						type: 'input',
						name: 'username',
						message: 'Enter your Bitbucket username'
					}
				];

				inquirer.prompt(innerQuestions, function(innerAnswers) {
					addToBitbucket(innerAnswers, done);
				});
				break;

			case 'GitHub':

				addToGithub(done);
				break;
		}

	}

	inquirer.prompt(questions, handleAnswers);

});
