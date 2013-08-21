module.exports = (grunt) ->
    grunt.loadNpmTasks 'grunt-hub'

    projects = ["metamac-portal-web", "metamac-portal-opencms"]
    hubTasks = ['clean', 'build']


    hubConfigTaskSrc = projects.map (project) -> "#{project}/Gruntfile.coffee"

    hubConfig = options : concurrent : 1
    hubTasks.forEach (task) ->
        hubConfig[task] =
            src: hubConfigTaskSrc
            tasks: task

    grunt.initConfig({
        hub: hubConfig
    });

    hubTasks.forEach (task) ->
        grunt.registerTask task, "hub:#{task}"