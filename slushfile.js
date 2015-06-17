var gulp = require('gulp');
var inquirer = require('inquirer');
var runSequence = require('run-sequence');
var shell = require('shelljs');
var request = require('request');
var fs = require('fs');

gulp.task('download-globe-graphic-template', function(done) {

	request('https://github.com/russellgoldenberg/globe-graphic-template/archive/master.zip')
		.pipe(fs.createWriteStream('master.zip'))
		.on('close', function () {
			shell.exec('unzip -q master.zip; mv globe-graphic-template-master/* .; rm -rf master.zip globe-graphic-template-master LICENSE README.md');
			done();
		});

});

gulp.task('default', function(done) {

	runSequence('download-globe-graphic-template', done);



	// inquirer.prompt([
	// 	{
	// 		type: 'input',
	// 		name: 'name',
	// 		message: 'message'
	// 	}
	// ],
	// function(answers) {

	// 	// Download http://b.globe.com/graphic-template, unzip









	// 	gulp.src(__dirname + '/templates/**')
	// 		.pipe(gulp.dest('./'))
	// 		.on('finish', function() {
	// 			console.log('done');
	// 			done();
	// 		});
	// });

});