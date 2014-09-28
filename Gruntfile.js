/* 
 * @Author: LogIN
 * @Date:   2014-08-22 16:40:33
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-09-26 11:41:06
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
        // DEPRICIATED
        //nodewebkit: {
        //    options: {
        //        version: '0.10.1',
        //        buildDir: './builds', // Where the build version of my node-webkit app is saved
        //        cacheDir: './builds/cache',
        //        macCredits: './application/credits.html',
        //        forceDownload: false,
        //        macIcns: './application/icon.icns', // Path to the Mac icon file
        //        platforms: ['linux32'],
        //        // mac: false, // We don't need mac
        //        // win: false, // We don't need win
        //        // linux32: true, // We want to build it for lin32
        //        // linux64: false // We don't need linux64
        //    },
        //    src: ['./application/**/*'] // node-webkit app
        //},
        // DEPRICIATED
        // copy: {
        //     main: {
        //         files: [{
        //             src: 'libraries/win/ffmpegsumo.dll',
        //             dest: 'builds/Chuppy/win/Chuppy/ffmpegsumo.dll',
        //             flatten: true
        //         }, {
        //             src: 'libraries/mac/ffmpegsumo.so',
        //             dest: 'builds/Chuppy/mac/Chuppy.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so',
        //             flatten: true
        //         }, {
        //             src: 'libraries/linux64/ffmpegsumo.so',
        //             dest: 'builds/Chuppy/linux64/Chuppy/libffmpegsumo.so',
        //             flatten: true
        //         }, {
        //             src: 'libraries/linux32/ffmpegsumo.so',
        //             dest: 'builds/Chuppy/linux32/Chuppy/libffmpegsumo.so',
        //             flatten: true
        //         }]
        //     }
        // },
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
    // npm install grunt-contrib-csslint --save-dev
    
    //grunt.loadNpmTasks('grunt-contrib-csslint');
    //grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-node-webkit-builder');
    //grunt.loadNpmTasks('grunt-nodemon');
    //grunt.loadNpmTasks('grunt-docular');
    //grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-ssh');   

    // Default task.
    //grunt.registerTask('default', [ 'sftp', 'sshexec', 'nodewebkit']);
    grunt.registerTask('default', ['jshint']);


//    grunt.registerTask('updateyVersion', 'A sample task that logs build number.' function() {
//        var versionFilePath = './version.json';
//        var versionFile = grunt.file.readJSON(versionFilePath) || null;
//        // DEFOULTS
//        /* Root version number: 0.1 */
//        var mainVersionNumber = versionFile.mainVersion || "0.1";
//        /* Sub Version number: 0 */
//        var subVersionNumber = versionFile.subVersion || "0";
//        /* Build number: 78 */
//        var buildNumber = versionFile.buildNumber || "0";
//        /* Full version number: 0.1.0 */
//        var version =  versionFile.version || "0.1.0";
//
//        buildNumber = buildNumber + 1;
//        if(buildNumber % 10 === 0){
//            subVersionNumber = subVersionNumber + 1;
//            buildNumber = 0;
//            version = version.substring(0, string.lastIndexOf('.')) + "." + subVersionNumber;
//        }
//        versionFile = {
//            "version" : version,
//            "mainVersion" : mainVersionNumber,
//            "subVersion" : subVersionNumber,
//            "buildNumber" : buildNumber,
//        };
//
//        grunt.file.write(versionFilePath, JSON.stringify(versionFile));
//        grunt.log.write('Updated to version: ' + version + ' build: ' + buildNumber);
//    });

};
