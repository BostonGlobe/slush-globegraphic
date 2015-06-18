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
			shell.exec('unzip -q master.zip');
			shell.exec('mv globe-graphic-template-master/* .');
			shell.exec('rm -rf master.zip globe-graphic-template-master src/css/main.css LICENSE README.md');
			done();
		});

});

gulp.task('copy-templates-directory', function(done) {

	gulp.src(__dirname + '/templates/**')
		.pipe(gulp.dest('./'))
		.on('finish', function() {
			shell.exec('mkdir src/html');
			shell.exec('mv src/index.html src/html/index.hbs');
			shell.exec('unzip -q node_modules.zip');
			shell.exec('rm -rf node_modules.zip');
			done();	
		});

})

gulp.task('default', function(done) {

	runSequence(
		'download-globe-graphic-template',
		'copy-templates-directory',
		done
	);

	// inquirer.prompt([
	// 	{
	// 		type: 'input',
	// 		name: 'name',
	// 		message: 'message'
	// 	}
	// ],
	// function(answers) {

});