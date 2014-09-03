/* 
 * @Author: LogIN
 * @Date:   2014-08-22 12:33:40
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-31 14:19:03
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-22 12:33:40 The Chuppy Authors
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
// Set global variable for Jslint
/* global Chuppy */
// Global application file-system related operations
Chuppy.Utils.FileSystem = {
    // Synchronous version of fs.exists. 
    existsSync: function(path) {
        return fs.existsSync(path);
    },
    // Synchronous lstat(2). Returns an instance of fs.Stats. 
    lstatSync: function(path) {
        return fs.lstatSync(path);
    },
    // Asynchronous readdir(3). Reads the contents of a directory. 
    // The callback gets two arguments (err, files) where files is an 
    // array of the names of the files in the directory excluding '.' and '..'. 
    readdir: function(path, callback) {
        fs.readdir(path, function(err, data) {
            if (callback && typeof(callback) === "function") {
                callback.apply(this, [err, data]);
            } else {
                console.log("Callback must be defined!");
            }
        });
    },
    // Synchronous version of fs.readFile. 
    // Returns the contents of the filename. 
    readFileSync: function(filename, options) {
        return fs.readFileSync(filename, options);
    },
    // Asynchronous mkdir(2). 
    // No arguments other than a possible exception are given to the completion callback
    mkdir: function(path, mode, callback) {
        fs.mkdir(path, mode, function(err) {
            if (callback && typeof(callback) === "function") {
                callback.apply(this, [err]);
            } else {
                console.log("Callback isnt defined!");
            }
        });
    },
    // Asynchronous unlink(2). No arguments other than a possible 
    // exception are given to the completion callback.
    unlink: function(path, callback) {
        fs.unlink(path, function(err) {
            if (callback && typeof(callback) === "function") {
                callback.apply(this, [err]);
            } else {
                console.log("Callback isnt defined!");
            }
        });
    },
    // Synchronous unlink(2).
    unlinkSync: function(path) {
        return fs.unlinkSync(path);
    },
    // Synchronous version of fs.open()
    openSync: function(path, flags, mode) {
        return fs.openSync(path, flags, mode);
    },
    // Making directory along with missing parents in 
    mkdirParent: function(dirPath, mode, callback) {
        //Call the standard fs.mkdir
        Chuppy.Utils.FileSystem.mkdir(dirPath, mode, function(error) {
            //When it fail in this way, do the custom steps
            if (error && error.errno === 34) {
                //Create all the parents recursively
                Chuppy.Utils.FileSystem.mkdirParent(path.dirname(dirPath), mode, callback);
                //And then the directory
                Chuppy.Utils.FileSystem.mkdirParent(dirPath, mode, callback);
            }
            //Manually run the callback since we used our own callback to do all these
            if (callback && typeof(callback) === "function") {
                callback.apply(this, [error]);
            } else {
                console.log("Callback isnt defined!");
            }
        });
    },
    initTempFolder: function() {
        var tempCache = Chuppy.Settings.getLocal('temp');
        if (typeof tempCache !== 'string') {
            console.log('System, initTempFolder, tempCache isnt a string');
            return;
        }
        if (!Chuppy.Utils.FileSystem.existsSync(tempCache)) {
            Chuppy.Utils.FileSystem.mkdir(tempCache);
        }
    },
    wipeTempFolder: function() {
        var tempCache = Chuppy.Settings.getLocal('temp');
        if (typeof tempCache !== 'string') {
            console.log('System, wipeTempFolder, tempCache isnt a string');
            return false;
        }

        Chuppy.Utils.FileSystem.readdir(tempCache, function(err, files) {
            for (var i in files) {
                Chuppy.Utils.FileSystem.unlink(tempCache + '/' + files[i]);
            }
        });
    },
    /* Reads local file and returns it as string
     * @parms: path - path to the file relative on app root
     *         readType: sync or async
     */
    readFileLocal: function(path, readType) {
        var data;
        if (readType === 'async') {
            fs.readFile(path, 'utf8', function(err, data) {
                if (err) {
                    console.log('System, readFileLocal, async error: ', err);
                } else {
                    return data;
                }
            });
        } else if (readType === 'sync') {
            data = Chuppy.Utils.FileSystem.readFileSync(path, 'utf8');
            return data;
        } else {
            console.log('System, readFileLocal, unknown readType: ', readType);
        }

        return false;
    },
    loadTextFile: function(filePath, isPreview, callback) {
        console.log("Loading file: " + filePath);
        if (isPreview) {
            var stream = fs.createReadStream(filePath, {
                start: 0,
                end: 10000
            });
            stream.on('error', function(err) {
                console.log("Loading file " + filePath + " failed " + err);
                return;
            });
            stream.on('data', function(content) {
                console.log("Stream: " + content);
                if (callback && typeof(callback) === "function") {
                    callback(content);
                }
            });
        } else {
            fs.readFile(filePath, 'utf8', function(error, content) {
                if (error) {
                    console.log("Loading file " + filePath + " failed " + error);
                    return;
                }
                if (callback && typeof(callback) === "function") {
                    callback(content);
                }
            });
        }
    },
    // Remove directory(s) synchronously and recursively
    // {parm} paths {array} Array of filename paths
    // Remove item from database Chuppy.Apps.App["com.files"].Main.Public.Database.removeItemByUID(menuDetails.systemDetails.location.dbLocation, menuDetails.modelUID);
    rmDirSync: function(paths) {
        var filename;
        var stat;
        var list;
        _.each(paths, function(itemPath) {
            list = fs.readdirSync(itemPath);
            for (var i = 0; i < list.length; i++) {
                filename = path.join(itemPath, list[i]);
                stat = fs.statSync(filename);
                if (filename === "." || filename === "..") {
                    // pass these files
                } else if (stat.isDirectory()) {
                    // rmdir recursively
                    Chuppy.Utils.FileSystem.rmDirSync([filename]);
                } else {
                    // rm fiilename
                    Chuppy.Utils.FileSystem.unlinkSync(filename);
                }
            }
            fs.rmdirSync(itemPath);
        });
    },
    // Remove file(s) synchronously and recursively
    // {parm} paths {array} Array of filename paths
    rmFileSync: function(paths) {
        var data;
        _.each(paths, function(itemPath) {
            try {
                data = Chuppy.Utils.FileSystem.unlinkSync(itemPath);
                console.info('rmFileSync: File deleted:', itemPath);
            } catch (e) {
                if (e.code === 'ENOENT') {
                    console.log('rmFileSync: File not found:', itemPath);
                } else {
                    throw e;
                }
            }
        });
    },
    // Copy file(s) from source to destination
    // {parm} paths {@array} with objects: sourceFilePath and targetFilePath
    // {parm} action {@string} - action is "copy" or "cut"
    copyFileSync: function(paths, action) {
        var sourceFilePath;
        var targetFilePath;

        var sourceFileName;
        var targetFileName;

        _.each(paths, function(item) {
            sourceFilePath = item.sourceFilePath;
            targetFilePath = item.targetFilePath;

            sourceFileName = path.basename(sourceFilePath);
            targetFileName = path.basename(targetFilePath);

            console.log("Copy file: " + sourceFilePath + " to " + targetFilePath);
            if (sourceFilePath.toLowerCase() === targetFilePath.toLowerCase()) {
                Chuppy.Utils.Template.globalNotify('warning', i18n.__('File was not copied. Initial and target file names are the same.'), 'body', '', '', 5000);
                return false;
            }
            if (Chuppy.Utils.FileSystem.lstatSync(sourceFilePath).isDirectory()) {
                Chuppy.Utils.Template.globalNotify('warning', i18n.__("'" + sourceFileName + "' is a directory and can not be moved."), 'body', '', '', 5000);
                return false;
            }
            if (Chuppy.Utils.FileSystem.existsSync(targetFilePath)) {
                Chuppy.Utils.Template.globalNotify('warning', i18n.__("Target file '" + targetFileName + "' already exists.", "File copy failed!"), 'body', '', '', 5000);
                return false;
            }
            var rd = fs.createReadStream(sourceFilePath);
            rd.on("error", function(err) {
                Chuppy.Utils.Template.globalNotify('warning', i18n.__("Copying of '" + sourceFileName + "' failed."), 'body', '', '', 5000);
            });
            var wr = fs.createWriteStream(targetFilePath);
            wr.on("error", function(err) {
                Chuppy.Utils.Template.globalNotify('warning', i18n.__("Copying of '" + sourceFileName + "' failed."), 'body', '', '', 5000);
            });
            wr.on("close", function(ex) {
                Chuppy.Utils.Template.globalNotify('success', i18n.__("Copying of '" + sourceFileName + "' successful."), 'body', '', '', 5000);
                if (action === 'cut') {
                    Chuppy.Utils.FileSystem.rmFileSync([sourceFilePath]);
                }
            });
            rd.pipe(wr);
        });
    },
    // Rename file(s)
    // {parm} paths {@array} with objects: sourceFilePath and targetFilePath
    // {parm} action {@string} - action is "copy" or "cut"
    renameFile: function(paths) {
        var sourceFilePath;
        var targetFilePath;

        var sourceFileName;
        var targetFileName;

        _.each(paths, function(item) {
            sourceFilePath = item.sourceFilePath;
            targetFilePath = item.targetFilePath;

            sourceFileName = path.basename(sourceFilePath);
            targetFileName = path.basename(targetFilePath);

            console.log("Renaming file: " + sourceFileName + " to " + targetFileName);
            if (sourceFilePath.toLowerCase() === targetFilePath.toLowerCase()) {
                Chuppy.Utils.Template.globalNotify('info', i18n.__("Initial and target file names are the same.", "File was not moved/renamed."), 'body', '', '', 2000);
                return false;
            }
            if (Chuppy.Utils.FileSystem.lstatSync(sourceFilePath).isDirectory()) {
                Chuppy.Utils.Template.globalNotify('info', i18n.__("'" + sourceFileName + "' is a directory and can not be moved."), 'body', '', '', 2000);
                return false;
            }
            if (Chuppy.Utils.FileSystem.existsSync(targetFilePath)) {
                Chuppy.Utils.Template.globalNotify('info', i18n.__("Target file '" + targetFileName + "' already exists.", "File renaming failed!"), 'body', '', '', 2000);
                return false;
            }
            fs.rename(sourceFilePath, targetFilePath, function(error) {
                if (error) {
                    Chuppy.Utils.Template.globalNotify('info', i18n.__("Renaming of '" + sourceFileName + "' failed. The file is probably on a different partion."), 'body', '', '', 2000);
                    return;
                }
                Chuppy.Utils.Template.globalNotify('success', i18n.__("File '" + sourceFileName + "' renamed successful."), 'body', '', '', 5000);
                console.info("renameFile done:", sourceFilePath, targetFilePath);
            });
        });
    },
    renameDirectory: function(dirPath, newDirName) {
        //var newDirPath = TSCORE.TagUtils.extractParentDirectoryPath(dirPath) + TSCORE.dirSeparator + newDirName;
        var newDirPath = newDirName;
        console.log("Renaming file: " + dirPath + " to " + newDirPath);
        // TODO check if file opened for editing in the same directory as source dir
        if (dirPath.toLowerCase() === newDirPath.toLowerCase()) {
            Chuppy.Utils.Template.globalNotify('info', i18n.__("Initial and target directories are the same.", "Directory was not renamed."), 'body', '', '', 2000);
            return false;
        }
        if (Chuppy.Utils.FileSystem.existsSync(newDirPath)) {
            Chuppy.Utils.Template.globalNotify('info', i18n.__("Target directory name '" + newDirPath + "' already exists.", "Directory renaming failed!"), 'body', '', '', 2000);
            return false;
        }
        var dirStatus = fs.statSync(dirPath);
        if (dirStatus.isDirectory) {
            fs.rename(dirPath, newDirPath, function(error) {
                if (error) {
                    console.log("Renaming directory failed " + error);
                    return;
                }
                console.log("renameDirectory DONE!");
            });
        } else {
            Chuppy.Utils.Template.globalNotify('info', i18n.__("Path '" + dirPath + "' is not a directory.", "Directory renaming failed!"), 'body', '', '', 2000);
            return false;
        }
    },
    saveTextFile: function(filePath, content, overWrite) {
        console.log("Saving file: " + filePath);
        // Handling the UTF8 support for text files
        var UTF8_BOM = "\ufeff";
        if (content.indexOf(UTF8_BOM) === 0) {
            console.log("Content beging with a UTF8 bom");
        } else {
            content = UTF8_BOM + content;
        }
        var isNewFile = !Chuppy.Utils.FileSystem.existsSync(filePath);
        fs.writeFile(filePath, content, 'utf8', function(error) {
            if (error) {
                console.log("Save to file " + filePath + " failed " + error);
                return;
            }
            console.log("saveTextFile DONE!");
        });
    },
    extractContainingDirectoryPath: function(filePath) {
        return filePath.substring(0, filePath.lastIndexOf("/"));
    }
};
