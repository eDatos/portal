##
## grunt-release-arte-svn
## Based on https://github.com/geddski/grunt-release
##
#
#shell = require('shelljs');
#semver = require('semver');
#
#module.exports = (grunt) ->
#    grunt.registerTask 'release', 'bump version, git tag, git push, npm publish', (type) ->
#
#
#        # defaults
#        options = this.options({
#            bump: true,
#            file: grunt.config('pkgFile') || 'package.json',
#            add: true,
#            commit: true,
#            tag: true,
#            push: true,
#            pushTags: true
#        });
#
#        tagName = grunt.config.getRaw('release.options.tagName') || '<%= newVersion %>';
#        commitMessage = grunt.config.getRaw('release.options.commitMessage') || 'release <%= newVersion %>';
#        tagMessage = grunt.config.getRaw('release.options.tagMessage') || 'version <%= newVersion %>';
#
#        config = setup(options.file, type);
#        templateOptions = {
#            data:
#            {
#                newVersion: config.newVersion,
#                version: config.version
#            }
#        };
#
#        actions = [
#            bump,
#            add,
#            commit,
#            push,
#            tag,
#            pushTags,
#            publish
#        ];
#
#        actionsResult = true;
#        actions.forEach (action) ->
#            if (actionsResult)
#                actionsResult = action(config);
#
#
#        setup(file, type) ->
#            pkg = grunt.file.readJSON(file)
#            version = pkg.version
#            newVersion = semver.inc(pkg.version, type || 'patch')
#            {file: file, pkg: pkg, newVersion: newVersion, version: version}
#
#        add(config) ->
#            run('git add ' + config.file);
#
#        commit(config) ->
#            message = grunt.template.process(commitMessage, templateOptions);
#            run('git commit ' + config.file + ' -m "' + message + '"', config.file + ' committed');
#
#        tag(config) ->
#            name = grunt.template.process(tagName, templateOptions)
#            message = grunt.template.process(tagMessage, templateOptions)
#            run('git tag ' + name + ' -m "' + message + '"', 'New git tag created: ' + name)
#
#        push() ->
#            run('git push origin master', 'pushed to remote');
#
#        pushTags(config) ->
#            run('git push origin ' + config.newVersion, 'pushed new tag ' + config.newVersion + ' to remote');
#
#
#        publish(config) ->
#            nexusUser = process.env.NEXUS_USER
#            nexusPassword = process.env.NEXUS_PASSWORD
#            if (nexusUser && nexusPassword)
#                cmd = 'curl -v -T ' + options.nexus.file + ' ' + options.nexus.url + ' -u ' + nexusUser + ':' + nexusPassword;
#                run(cmd, 'published ' + config.newVersion + ' to nexus');
#            else
#                grunt.log.error("Error. Undefined environment variables NEXUS_USER or NEXUS_PASSWORD")
#            return false
#
#        run (cmd, msg) ->
#            ret = shell.exec(cmd, {silent: true});
#            result = ret.code == 0;
#            if (msg)
#                grunt.log.ok(msg) if result
#                grunt.log.error("Error:" + msg + " - " +ret.output) if not result
#            result
#
#
#        bump(config) ->
#            config.pkg.version = config.newVersion;
#            grunt.file.write(config.file, JSON.stringify(config.pkg, null, '  ') + '\n');
#            grunt.log.ok('Version bumped to ' + config.newVersion);
#            true