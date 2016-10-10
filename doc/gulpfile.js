'use strict';

var gulp = require('gulp'),
	clean = require('gulp-clean'),
	gulpSequence = require('gulp-sequence'),
	jsdoc = require('gulp-jsdoc'),
	apidoc = require('gulp-apidoc');


gulp.task('clean', function () {
	return gulp.src(['api/*', 'webapi/*', 'sdk/*'])
		.pipe(clean({force: true}));
});

gulp.task('api', function () {
	return gulp.src([
		'../lib/**/*.js',
	]).pipe(jsdoc('api', {
		path: 'node_modules/jaguarjs-jsdoc',
		anyTemplateSpecificParameter: 'whatever'
	}))
});

gulp.task('webapi', function (done) {
	apidoc({
		src: "../lib/router",
		dest: "webapi/"
	}, done);
});

gulp.task('sdk', function (done) {
	return gulp.src([
		'../sdk/**/*.js',
	]).pipe(jsdoc('sdk', {
		path: 'node_modules/jaguarjs-jsdoc',
		anyTemplateSpecificParameter: 'whatever'
	}))
});

gulp.task('default', gulpSequence('clean', ['api', 'webapi', 'sdk']));

