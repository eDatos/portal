exec = require('child_process').exec;

module.exports = (grunt) ->
    grunt.registerMultiTask "npm-install", () ->
        done = @async();

        install = (project, cb) ->
            options = {
                cmd: "npm"
                grunt: false
                args: ["install"]
                opts: {cwd: project}
            }

            child = grunt.util.spawn options, cb
            child.stdout.on 'data', grunt.log.write
            child.stderr.on 'data', grunt.log.error

        grunt.util.async.map @data.folders, install, done













