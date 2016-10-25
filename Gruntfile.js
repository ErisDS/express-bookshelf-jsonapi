module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        release: {
            github: {
                // @TODO move this to TryGhost and get a better name
                repo: 'ErisDS/express-bookshelf-jsonapi',
                accessTokenVar: 'GITHUB_ACCESS_TOKEN'
            }
        }
    });

    grunt.loadNpmTasks('grunt-release');
};