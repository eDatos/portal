fs = require "fs"
parseXML = require('xml2js').parseString;

module.exports = (grunt) ->
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        pom : {}
        watch :
            preprocess:
                files : ["src/system/modules/org.siemac.metamac.metamac-portal/formatters/*"]
                tasks : ["preprocess"]

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
                files:
                    'target/tmp/system/modules/org.siemac.metamac.metamac-portal/formatters/view.jsp' : 'src/system/modules/org.siemac.metamac.metamac-portal/formatters/view.jsp'
                    'target/tmp/system/modules/org.siemac.metamac.metamac-portal/formatters/collection.jsp' : 'src/system/modules/org.siemac.metamac.metamac-portal/formatters/collection.jsp'
                    'target/tmp/system/modules/org.siemac.metamac.metamac-portal/formatters/collection-node.jsp' : 'src/system/modules/org.siemac.metamac.metamac-portal/formatters/collection-node.jsp'

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
                    {
                        expand: true,
                        src: '**',
                        dest: 'target/tmp/system/modules/org.siemac.metamac.metamac-portal/lib/',
                        cwd: 'target/lib'
                    }
                    {
                        expand : true
                        src : "metamac-portal-opencms-<%= pom.version %>.jar"
                        dest : "target/tmp/system/modules/org.siemac.metamac.metamac-portal/lib/"
                        cwd: "target/"
                    }
                ]
        uglify:
            build:
                files:
                    'target/tmp/system/modules/org.siemac.metamac.metamac-portal/resources/lazyload.js': [
                        'target/tmp/system/modules/org.siemac.metamac.metamac-portal/resources/lazyload.js'
                    ]


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


    grunt.registerTask("build", ["pom", "copy", "uglify", "preprocess", "compress"]);
    grunt.registerTask("default", "build")

