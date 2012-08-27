module.exports = function(grunt){

    var lessSrcPath = 'src/main/webapp/WEB-INF/theme/less/';
    var libPath = 'src/main/webapp/WEB-INF/theme/js/libs/';

    grunt.initConfig({
        less : {
            dist : {
                src : lessSrcPath + 'bootstrap.less',
                dest : lessSrcPath + 'bootstrap.css',
                options : {
                    compress: true
                }
            }
        },

        concat : {
            libs : {
                src : [
                    libPath + "jquery-1.7.1.js",
                    libPath + "i18n.js",
                    libPath + "underscore.js",
                    libPath + "backbone-min.js",
                    libPath + "handlebars-1.0.0.beta.6.js",
                    libPath + "bootstrap.min.js",
                    libPath + "modernizr-2.5.3.js"
                ],
                dest : libPath + "libs.js",
                separator : ";"
            }
        },

        min : {
            dist : {
                src : ['dist/built.js'],
                dest : 'dist/built.min.js'
            },
            libs : {
                src : [libPath + 'libs.js'],
                dest : libPath + 'libs.min.js'
            }
        },

        watch : {
            files : lessSrcPath + '**/*.less',
            tasks : 'less'
        }
    });

    grunt.loadNpmTasks('grunt-less');
    grunt.registerTask('default', 'concat min');
    grunt.registerTask('libs', 'concat:libs min:libs');

};