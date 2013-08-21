module.exports = (grunt) ->

    grunt.loadTasks 'tasks'
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
        hub: hubConfig,
        "npm-install" :
            build:
                folders : projects
    });

    hubTasks.forEach (task) ->
        grunt.registerTask task, "hub:#{task}"