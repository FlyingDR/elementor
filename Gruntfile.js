module.exports = function( grunt ) {
	'use strict';

	var remapify = require( 'remapify' ),
		pkgInfo = grunt.file.readJSON( 'package.json' );

	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

	// Project configuration
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		checktextdomain: {
			standard: {
				options:{
					text_domain: 'elementor',
					correct_domain: true,
					keywords: [
						// WordPress keywords
						'__:1,2d',
						'_e:1,2d',
						'_x:1,2c,3d',
						'esc_html__:1,2d',
						'esc_html_e:1,2d',
						'esc_html_x:1,2c,3d',
						'esc_attr__:1,2d',
						'esc_attr_e:1,2d',
						'esc_attr_x:1,2c,3d',
						'_ex:1,2c,3d',
						'_n:1,2,4d',
						'_nx:1,2,4c,5d',
						'_n_noop:1,2,3d',
						'_nx_noop:1,2,3c,4d'
					]
				},
				files: [ {
					src: [
						'**/*.php',
						'!node_modules/**',
						'!build/**',
						'!tests/**',
						'!vendor/**',
						'!*~'
					],
					expand: true
				} ]
			}
		},

		pot: {
			options:{
				text_domain: 'elementor',
				dest: 'languages/',
				encoding: 'UTF-8',
				package_name: '<%= pkg.name %>',
				package_version: '<%= pkg.version %>',
				msgid_bugs_address: 'team@pojo.me',
				keywords: [
					// WordPress keywords
					'__:1',
					'_e:1',
					'_x:1,2c',
					'esc_html__:1',
					'esc_html_e:1',
					'esc_html_x:1,2c',
					'esc_attr__:1',
					'esc_attr_e:1',
					'esc_attr_x:1,2c',
					'_ex:1,2c',
					'_n:1,2',
					'_nx:1,2,4c',
					'_n_noop:1,2',
					'_nx_noop:1,2,3c'
				]
			},
			files:{
				src: [
					'**/*.php',
					'!node_modules/**',
					'!build/**',
					'!tests/**',
					'!vendor/**',
					'!*~'
				],
				expand: true
			}
		},

		sass: {
			dist: {
				files: [ {
					expand: true,
					cwd: 'assets/scss/direction',
					src: '*.scss',
					dest: 'assets/css',
					ext: '.css'
				} ]
			}
		},

		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				},
				preBundleCB: function( bundle ) {
					bundle.plugin( remapify, [
						{
							cwd: 'assets/admin/js/dev/behaviors',
							src: '**/*.js',
							expose: 'elementor-behaviors'
						},
						{
							cwd: 'assets/admin/js/dev/layouts',
							src: '**/*.js',
							expose: 'elementor-layouts'
						},
						{
							cwd: 'assets/admin/js/dev/models',
							src: '**/*.js',
							expose: 'elementor-models'
						},
						{
							cwd: 'assets/admin/js/dev/collections',
							src: '**/*.js',
							expose: 'elementor-collections'
						},
						{
							cwd: 'assets/admin/js/dev/views',
							src: '**/*.js',
							expose: 'elementor-views'
						},
						{
							cwd: 'assets/admin/js/dev/components',
							src: '**/*.js',
							expose: 'elementor-components'
						},
						{
							cwd: 'assets/admin/js/dev/utils',
							src: '**/*.js',
							expose: 'elementor-utils'
						},
						{
							cwd: 'assets/admin/js/dev/layouts/panel',
							src: '**/*.js',
							expose: 'elementor-panel'
						}
					] );
				}
			},

			dist: {
				files: {
					'assets/admin/js/app.js': ['assets/admin/js/dev/app.js']
				},
				options: pkgInfo.browserify
			}

		},

		// Extract sourcemap to separate file
		exorcise: {
			bundle: {
				options: {},
				files: {
					'assets/admin/js/app.js.map': ['assets/admin/js/app.js']
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'assets/admin/js/dev/**/*.js'
			]
		},

		postcss: {
			dev: {
				options: {
					map: true,

					processors: [
						require( 'autoprefixer' )( {
							browsers: 'last 2 versions'
						} )
					]
				},
				files: [ {
					src: [
						'assets/css/*.css',
						'!assets/css/*.min.css'
					]
				} ]
			},
			minify: {
				options: {
					processors: [
						require( 'cssnano' )()
					]
				},
				files: [ {
					expand: true,
					src: [
						'assets/css/*.css',
						'!assets/css/*.min.css'
					],
					ext: '.min.css'
				} ]
			}
		},

		uglify: {
			//pkg: grunt.file.readJSON( 'package.json' ),
			options: {},
			dist: {
				files: {
					'assets/admin/js/app.min.js': [
						'assets/admin/js/app.js'
					],
					'assets/js/admin.min.js': [
						'assets/js/admin.js'
					],
					'assets/js/frontend.min.js': [
						'assets/js/frontend.js'
					]
				}
			}
		},

		watch:  {
			styles: {
				files: [
					'assets/scss/**/*.scss'
				],
				tasks: ['styles']
			},

			scripts: {
				files: [
					'assets/js/*.js',
					'!assets/js/*.min.js',
					'assets/js/dev/**/*.js',
					'assets/admin/js/dev/**/*.js'
				],
				tasks: [ 'scripts' ]
			}
		}
	} );

	// Default task(s).
	grunt.registerTask( 'default', [
		'i18n',
		'scripts',
		'styles'
	] );

	grunt.registerTask( 'i18n', [
		'checktextdomain',
		'pot'
	] );

	grunt.registerTask( 'scripts', [
		'jshint',
		'browserify',
		'exorcise',
		'uglify'
	] );

	grunt.registerTask( 'styles', [
		'sass',
		'postcss'
	] );
};
