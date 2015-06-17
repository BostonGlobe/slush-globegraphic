var gulp = require('gulp');
var inquirer = require('inquirer');

gulp.task('default', function(done) {

	inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'message'
		}
	],
	function(answers) {
		gulp.src(__dirname + '/templates/**')
			.pipe(gulp.dest('./'))
			.on('finish', function() {
				console.log('done');
				done();
			});
	});

});