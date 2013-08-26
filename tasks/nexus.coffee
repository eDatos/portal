#
# nexus-upload
#

module.exports = (grunt) ->
    grunt.registerMultiTask 'nexus', 'Upload a file to a nexus repository', ->
        done = @async()

        user = @data.user
        password = @data.password

        if !user || !password
            done(new Error("Empty user or password"))
        else
            spawnOptions =
                cmd : "curl"
                args: [
                    "-v"
                    "-T #{@data.file}"
                    "-u #{user}:#{password}"
                    @data.url
                ]

            child = grunt.util.spawn spawnOptions, (error) ->
                done(error)

            child.stdout.on 'data', grunt.log.write