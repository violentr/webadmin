"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');

var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

var config = {
	port: 3000,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		js: './src/**/*.js',
		dist: './dist',
		mainJs: './src/main.js'
	}
};

gulp.task('connect', function () {
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function () {
	gulp.src('dist/index.html')
		.pipe(open(' ', {
			url: config.devBaseUrl + ':' + config.port + '/'
		}));
});

gulp.task('html', function () {
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('js', function () {
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js']);
});

gulp.task('default', ['html', 'js', 'open', 'watch']);
