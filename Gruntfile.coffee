module.exports = (grunt) ->
    "use strict"

    # load all grunt tasks
    require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks

    # configurable paths
    typefasterConfig =
        static: "typefaster/static"
        coffee: "typefaster/coffee"
        sass: "typefaster/sass"
        jst: "typefaster/static/scripts/templates"

    grunt.initConfig
        typefaster: typefasterConfig
        watch:
            coffee:
                files: ["<%= typefaster.coffee %>/app/{,**/}*.coffee"]
                tasks: ["coffee:app", "shell:js_tests"]

            coffeeTests:
                files: ["<%= typefaster.coffee %>/tests/{,**/}*.coffee"]
                tasks: ["coffee:tests"]

            compass:
                files: ["<%= typefaster.sass %>/{,**/}*.{scss,sass}"]
                tasks: ["compass"]

            jst:
                files: ["<%= typefaster.jst %>/{,**/}*.ejs"]
                tasks: ["jst"]

        clean:
            all:
                files: [
                    dot: true
                    src: [
                        "<%= typefaster.static %>/scripts/src/*",
                        "<%= typefaster.static %>/scripts/tests/*",
                        "<%= typefaster.static %>/styles/src/*"
                    ]
                ]

        coffee:
            app:
                files: [
                    expand: true
                    cwd: "<%= typefaster.coffee %>/app"
                    src: "{,**/}*.coffee"
                    dest: "<%= typefaster.static %>/scripts/src"
                    ext: ".js"
                ]
            tests:
                files: [
                    expand: true
                    cwd: "<%= typefaster.coffee %>/tests"
                    src: "{,**/}*.coffee"
                    dest: "<%= typefaster.static %>/scripts/tests"
                    ext: ".js"
                ]

        uglify:
            options: {}
            all:
                files: grunt.file.expandMapping(["typefaster/static/scripts/src/{,**/}*.js"])

        compass:
            options:
                sassDir: "<%= typefaster.sass %>"
                cssDir: "<%= typefaster.static %>/styles/src"
                imagesDir: "<%= typefaster.static %>/images"
                javascriptsDir: "<%= typefaster.static %>/scripts"
                fontsDir: "<%= typefaster.static %>/fonts"
                importPath: "<%= typefaster.static %>/bower_components"

                # httpImagesPath: '../images',
                # httpGeneratedImagesPath: '../images/generated',
                # httpFontsPath: '/styles/fonts',
                relativeAssets: false
                noLineComments: true
                outputStyle: "compressed"

            all: {}

        jst:
            options:
                amd: true

            all:
                files:
                    "<%= typefaster.static %>/scripts/src/templates.js": ["<%= typefaster.jst %>/{,**/}*.ejs"]

        shell:
            server:
                command: "python run.py"
                options:
                    stdout: true
                    stderr: true

            server2:
                command: "./run.sh"
                options:
                    stdout: true
                    stderr: true

            babel:
                command: "bin/babel.sh all"
                options:
                    stdout: true
                    stderr: true

            js_tests:
                command: 'npm test'
                options:
                    stdout: true
                    stderr: true

        concurrent:
            compile: ["compass", "coffee:app", "coffee:tests"]
            server:
                tasks: ["watch", "shell:server"]
                options:
                    logConcurrentOutput: true

            server2:
                tasks: ["watch", "shell:server2"]
                options:
                    logConcurrentOutput: true

    grunt.registerTask "createDefaultTemplate", ->
        grunt.file.write "typefaster/static/scripts/src/templates.js", "this.JST = this.JST || {};"

    grunt.registerTask "babel", [
        "shell:babel"
    ]

    grunt.registerTask "server", [
        "clean",
        "concurrent:compile",
        "createDefaultTemplate",
        "jst",
        "uglify",
        "concurrent:server"
    ]

    grunt.registerTask "server2", [
        "clean",
        "concurrent:compile",
        "createDefaultTemplate",
        "jst",
        "uglify",
        "concurrent:server2"
    ]

    grunt.registerTask "default", [
        "clean",
        "concurrent:compile",
        "createDefaultTemplate",
        "jst",
        "uglify"
    ]
