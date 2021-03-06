/* 
 * @Author: LogIN
 * @Date:   2014-08-22 16:40:33
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-09-01 18:43:49
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-22 16:40:33 The Chuppy Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        nodeunit: {
            files: ['test/**/*_test.js'],
        },
        jshint: {
            jshintrc: '.jshintrc',
            options: {
                node: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            globals: {
                src: ['application/lib/javascript/globals.js']
            },
            backend: {
                src: ['application/lib/javascript/lib/**/*.js']
            },
            frontend: {
                src: ['application/lib/javascript/frontend/**/*.js']
            },
            addons: {
                src: ['application/apps/**/*.js', '!application/apps/**/vendor/**/*.js', '!application/apps/**/3rdparty/**/*.js', '!application/apps/com.pdfViewer/**/*.js', '!application/apps/com.mdViewer/lib/javascript/vendor/**/*.js', '!application/apps/com.editorAce/lib/javascript/vendor/**/*.js']
            }
        },
        csslint: {
            strict: {
                options: {
                    import: 2
                },
                src: ['application/lib/stylesheets/chuppy.css', 'application/apps/**/*.css']
            },
            lax: {
                options: {
                    import: false
                },
                src: ['application/lib/stylesheets/chuppy.css', 'application/apps/**/*.css']
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'nodeunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'nodeunit']
            },
        },
        nodewebkit: {
            options: {
                version: '0.10.3',
                build_dir: './builds', // Where the build version of my node-webkit app is saved
                credits: './application/credits.html',
                force: false,
                mac_icns: './application/icon.icns', // Path to the Mac icon file
                mac: false, // We don't need mac
                win: false, // We don't need win
                linux32: true, // We want to build it for lin32
                linux64: false // We don't need linux64
            },
            src: './application/**/*' // node-webkit app
        },
        copy: {
            main: {
                files: [{
                    src: 'libraries/win/ffmpegsumo.dll',
                    dest: 'builds/releases/Chuppy/win/Chuppy/ffmpegsumo.dll',
                    flatten: true
                }, {
                    src: 'libraries/mac/ffmpegsumo.so',
                    dest: 'builds/releases/Chuppy/mac/Chuppy.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so',
                    flatten: true
                }, {
                    src: 'libraries/linux64/ffmpegsumo.so',
                    dest: 'builds/releases/Chuppy/linux64/Chuppy/libffmpegsumo.so',
                    flatten: true
                }, {
                    src: 'libraries/linux32/ffmpegsumo.so',
                    dest: 'builds/releases/Chuppy/linux32/Chuppy/libffmpegsumo.so',
                    flatten: true
                }]
            }
        },
        nodemon: {
            dev: {
                script: './server/index.js',
                options: {
                    callback: function(nodemon) {
                        nodemon.on('log', function(event) {
                            console.log(event.colour);
                        });
                    },
                    env: {
                        PORT: '3003'
                    },
                    ignore: ['./server/node_modules/**'],
                    watch: ['server'],
                    legacyWatch: true
                }
            }
        },
        /* Adding Docular for generating API docs
         * Usage: grunt docular-server
         */
        docular: {
            showDocularDocs: true,
            showAngularDocs: false,
            groups: [{
                groupTitle: 'Chuppy Client',
                groupId: 'client',
                sections: [{
                    id: 'chuppy',
                    title: 'Application Views',
                    showSource: true,
                    scripts: [
                        'application/lib/javascript/frontend/views/setup.js',
                        'application/lib/javascript/frontend/views/system/footerBar.js',
                        'application/lib/javascript/frontend/views/system/windowBar.js',
                        'application/lib/javascript/frontend/views/main-ui/headerBar.js',
                        'application/lib/javascript/frontend/views/main-ui/navigation.js',
                        'application/lib/javascript/frontend/views/system/login.js'

                    ]
                }, {
                    id: 'chuppy',
                    title: 'Public Utils',
                    showSource: true,
                    scripts: [
                        'application/lib/javascript/lib/utils/notification.js'
                    ]
                }]
            }, {
                groupTitle: 'Chuppy Server',
                groupId: 'server',
                sections: [{
                    id: 'chuppy',
                    title: 'Server Socket Routes',
                    showSource: true,
                    scripts: [
                        'server/index.js'
                    ]
                }]
            }]
        },
        // secret: grunt.file.readJSON('secret.json'),
        sftp: {
            deployServerFiles: {
                files: {
                    "./": ["server/index.js", "server/package.json"]
                },
                options: {
                    path: '/var/www/ivantomic.com/www/projects/chuppy/',
                    host: '<%= secret.host %>',
                    port: '<%= secret.port %>',
                    username: '<%= secret.username %>',
                    password: '<%= secret.password %>',
                    showProgress: false,
                    createDirectories: false
                }
            }
        },
        sshexec: {
            deployServerProcess: {
                command: 'uptime',
                options: {
                    host: '<%= secret.host %>',
                    port: '<%= secret.port %>',
                    username: '<%= secret.username %>',
                    password: '<%= secret.password %>'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    // grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-docular');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Default task.
    //grunt.registerTask('default', [ 'sftp', 'sshexec', 'nodewebkit']);
    grunt.registerTask('default', ['jshint','nodewebkit', 'copy']);


    // grunt.registerTask('updateyVersion', function(){         
    //     var assemblyFile = grunt.file.read('./AssemblyInfo.cs');
    //     var lines = assemblyFile.split('\n');
         
    //     var version = '';
    //     var versionParts = '';
    //     var searchString = 'AssemblyVersion';
     
    //     _.each(lines, function (line, index) {
    //         if (line.indexOf(searchString) != -1) {
    //             version = line.match(/\d+\.\d+\.\d+\.\d+/g).toString();
    //             versionParts = version.split('.');
     
    //             versionParts[3] = parseInt(versionParts[3], 10) + 1;
     
    //             lines[index] = line.replace(version, versionParts.join('.'));
    //         }
    //     });
     
    //     var updatedAssemblyFile = lines.join('\n');       
    //     grunt.file.write('./AssemblyInfo.cs', updatedAssemblyFile);
     
    //     grunt.log.write('Updated to version: ' + versionParts);
    // });

};
