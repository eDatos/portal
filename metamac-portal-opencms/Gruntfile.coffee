module.exports =  (grunt) ->

    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        compress : {
            build : {
                options : {
                    archive : "target/es.gobcan.istac.metamac.portal_<%= pkg.version %>.zip"
                },
                expand : true,
                cwd : 'target/tmp/',
                src : ['**/*'],
                dest : '/'
            }
        },
        preprocess : {
            build : {
                src : 'target/tmp/system/modules/es.gobcan.istac.metamac/formatters/all.jsp',
                dest : 'target/tmp/system/modules/es.gobcan.istac.metamac/formatters/all.jsp'
            }
        },
        copy : {
            build : {
                files : [
                    {expand: true, src : '**', dest : 'target/tmp/', cwd : './src'}
                    {expand: true, src : '**', dest : 'target/tmp/system/modules/es.gobcan.istac.metamac/resources/', cwd : '../metamac-portal-web/target/'}
                ]
            }
        },
        uglify : {
            build : {
                files : {
                    'target/tmp/system/modules/es.gobcan.istac.metamac/resources/lazyload.js' : ['target/tmp/system/modules/es.gobcan.istac.metamac/resources/lazyload.js']
                }
            }
        },
        clean : {
            build: ["target"]
        }
    });

    grunt.registerTask("build", ["clean", "copy", "uglify", "preprocess", "compress"]);

