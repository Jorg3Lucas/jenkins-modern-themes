module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var pkg = grunt.file.readJSON('package.json');

    var colors = {
        'red': '#F44336',
        'pink': '#E91E63',
        'purple': '#9C27B0',
        'deep-purple': '#673AB7',
        'indigo': '#3F51B5',
        'blue': '#2196F3',
        'light-blue': '#039BE5',
        'cyan': '#0097A7',
        'teal': '#26A69A',
        'green': '#43A047',
        'light-green': '#689F38',
        'lime': '#AFB42B',
        'yellow': '#FBC02D',
        'amber': '#FF6F00',
        'orange': '#EF6C00',
        'deep-orange': '#FF5722',
        'brown': '#795548',
        'grey': '#757575',
        'blue-grey': '#607D8B',
        'pixel': '#89B4F8'
    };

    var fileCreatorTask = {};
    var lessFiles = {
        "dist/modern-light.css": "less/style.less",
        "dist/modern-static.css": "less/static.less"
    };

    for (var name in colors) {
        var color = colors[name];

        fileCreatorTask['.tmp/' + name + '.less'] = new Function('fs', 'fd', 'done', '{\
            fs.writeFileSync(fd, \'@import "../less/style";@color-primary:' + color + ';@color-link:' + color + ';\');\
            done();\
        }');
        var distFile = 'dist/modern-' + name + '.css';

        lessFiles[distFile] = '.tmp/' + name + '.less';
    }


    grunt.initConfig({
        "file-creator": {
            dist: fileCreatorTask
        },

        clean: {
            dist: {
                src: ["dist/*"]
            }
        },

        less: {
            dist: {
                files: lessFiles,
                options: {
                    modifyVars: {
                        version: '"' + pkg.version + '"'
                    },
                },
            },
        },

        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')(),
                    require('cssnano')({
                        preset: ['default', {
                            svgo: {
                                plugins: [{
                                    removeRasterImages: true,
                                    sortAttrs: true,
                                    removeStyleElement: true,
                                }],
                            },
                        }],
                    }),
                ],
            },
            dist: {
                src: 'dist/modern*.css'
            }
        }
    });

    // Default task
    grunt.registerTask('default', ['clean', 'file-creator', 'less', 'postcss']);
};
