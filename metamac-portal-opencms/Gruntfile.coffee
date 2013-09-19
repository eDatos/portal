fs = require "fs"
parseXML = require('xml2js').parseString;

module.exports = (grunt) ->
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        pom : {}
        compress:
            build:
                options:
                    archive: "target/metamac-portal-opencms-<%= pom.version %>.zip"
                expand: true,
                cwd: 'target/tmp/',
                src: ['**/*'],
                dest: '/'
        preprocess:
            build:
                src: 'target/tmp/system/modules/org.siemac.metamac.metamac-portal/formatters/all.jsp',
                dest: 'target/tmp/system/modules/org.siemac.metamac.metamac-portal/formatters/all.jsp'
        copy:
            build:
                files: [
                    {expand: true, src: '**', dest: 'target/tmp/', cwd: './src'}
                    {
                        expand: true,
                        src: '**',
                        dest: 'target/tmp/system/modules/org.siemac.metamac.metamac-portal/resources/',
                        cwd: '../metamac-portal-web-client/target/'
                    }
                ]
        uglify:
            build:
                files:
                    'target/tmp/system/modules/org.siemac.metamac.metamac-portal/resources/lazyload.js': [
                        'target/tmp/system/modules/org.siemac.metamac.metamac-portal/resources/lazyload.js'
                    ]
        clean:
            build: ["target"]
    });

    grunt.registerTask "pom",  () ->
        done = @async();
        pomfile = "./pom.xml"
        fs.readFile pomfile, (err, pomContent) ->
            return cb(err) if err

            parseXML pomContent, (err, pomTree) ->
                return cb(err) if err
                version = pomTree.project.parent[0].version[0]
                grunt.config(['pom', 'version'], version);
                done();


    grunt.registerTask("build", ["pom", "clean", "copy", "uglify", "preprocess", "compress"]);
    grunt.registerTask("default", "build")

