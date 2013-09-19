module.exports = (grunt) ->
    grunt.loadTasks 'tasks'
    grunt.loadNpmTasks 'grunt-hub'

    projects = ["metamac-portal-web-client", "metamac-portal-opencms"]
    hubTasks = ['clean', 'build']

    hubConfigTaskSrc = projects.map (project) ->
        "#{project}/Gruntfile.coffee"

    hubConfig =
        options:
            concurrent: 1
    hubTasks.forEach (task) ->
        hubConfig[task] =
            src: hubConfigTaskSrc
            tasks: task

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        hub: hubConfig,
        "npm-install":
            build:
                folders: projects
        nexus:
            snapshot:
                user: process.env.NEXUS_USER
                password: process.env.NEXUS_PASSWORD
                url: 'http://repository.arte-consultores.com/content/repositories/snapshots/org/siemac/metamac/<%= pkg.name %>/<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.zip',
                file: 'metamac-portal-opencms/es.gobcan.istac.metamac.portal-<%= pkg.version %>.zip'
            release:
                user: process.env.NEXUS_USER
                password: process.env.NEXUS_PASSWORD
                url: 'http://repository.arte-consultores.com/content/repositories/releases/org/siemac/metamac/<%= pkg.name %>/<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.zip',
                file: 'metamac-portal-opencms/es.gobcan.istac.metamac.portal-<%= pkg.version %>.zip'
    });

    hubTasks.forEach (task) ->
        grunt.registerTask task, "hub:#{task}"
