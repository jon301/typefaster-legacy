module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var typefasterConfig = {
        'static': 'typefaster/static',
        'coffee': 'typefaster/coffee',
        'sass': 'typefaster/sass',
        'jst': 'typefaster/static/scripts/templates'
    };

    grunt.initConfig({
        typefaster: typefasterConfig,
        watch: {
            coffee: {
                files: ['<%= typefaster.coffee %>/{,**/}*.coffee'],
                tasks: ['coffee']
            },
            compass: {
                files: ['<%= typefaster.sass %>/{,**/}*.{scss,sass}'],
                tasks: ['compass']
            },
            jst: {
                files: [
                    '<%= typefaster.jst %>/{,**/}*.ejs'
                ],
                tasks: ['jst']
            }
        },
        clean: {
            all: {
                files: [{
                    dot: true,
                    src: [
                        '<%= typefaster.static %>/scripts/src/*',
                        '<%= typefaster.static %>/styles/src/*'
                    ]
                }]
            }
        },
        coffee: {
            all: {
                files: [{
                    expand: true,
                    cwd: '<%= typefaster.coffee %>',
                    src: '{,**/}*.coffee',
                    dest: '<%= typefaster.static %>/scripts/src',
                    ext: '.js'
                }]
            }
        },
        uglify: {
            options: {
            },
            all: {
                files: grunt.file.expandMapping(['typefaster/static/scripts/src/{,**/}*.js'])
            }
        },
        compass: {
            options: {
                sassDir: '<%= typefaster.sass %>',
                cssDir: '<%= typefaster.static %>/styles/src',
                imagesDir: '<%= typefaster.static %>/images',
                javascriptsDir: '<%= typefaster.static %>/scripts',
                fontsDir: '<%= typefaster.static %>/fonts',
                importPath: '<%= typefaster.static %>/bower_components',
                // httpImagesPath: '../images',
                // httpGeneratedImagesPath: '../images/generated',
                // httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                noLineComments: true,
                outputStyle: 'compressed'
            },
            all: {}
        },
        jst: {
            options: {
                amd: true
            },
            all: {
                files: {
                    '<%= typefaster.static %>/scripts/src/templates.js': ['<%= typefaster.jst %>/{,**/}*.ejs']
                }
            }
        },
        shell: {
            server: {
                command: 'python run.py',
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            babel: {
                command: 'bin/babel.sh all',
                options: {
                    stdout: true,
                    stderr: true
                }
            }
        },
        concurrent: {
            compile: [
                'compass',
                'coffee'
            ],
            server: {
                tasks: [
                    'watch',
                    'shell:server'
                ],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('typefaster/static/scripts/src/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('babel', ['shell:babel']);

    grunt.registerTask('server', [
        'clean',
        'concurrent:compile',
        'createDefaultTemplate',
        'jst',
        'uglify',
        'concurrent:server'
    ]);


    grunt.registerTask('default', [
        'clean',
        'concurrent:compile',
        'createDefaultTemplate',
        'jst',
        'uglify'
    ]);
};
