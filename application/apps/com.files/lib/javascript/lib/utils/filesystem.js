/* global crypt */
/* 
* @Author: LogIN
* @Date:   2014-08-22 12:04:30
* @Email:  unicoart@gmail.com
* @URL:    https://github.com/LogIN-/chuppy
* @Last Modified by:   login
* @Last Modified time: 2014-08-22 16:42:47
* Use of this source code is governed by a license: 
* The MIT License (MIT)
* 
* Copyright (c) 2014-08-22 12:04:30 The Chuppy Authors
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

// Files application core functions
App.Apps.App["com.files"].Main.Utils.Actions = { 

    // Index directory contents to directory index database
    // @param {string} dir Absolute path to directory to index
    // @param {string} dbPath Absolute path to directory to index database
    // @param {function} callback Callback function returns {err} @optional, if not defined default action is used
    // TODO: support for large dirs with > 400k files
    indexDirectory: function(dir, dbPath, callback) {
        // Reference to this
        var self = this;
        console.log("Indexing directory");
        console.log("DIR: ", dir);
        console.log("BD : ", dbPath);

        // If database index exist that mens we forced index reload with reload_index = true
        // Otherwise this function wouldn't be called
        if (fs.existsSync(dbPath)) {
            console.log("INDEX DELETED");
            App.Utils.FileSystem.rmFileSync([dbPath]);
            App.Apps.App["com.files"].Main.Public.Init.setKeys({
                system: {
                    reloadIndex: false
                }
            });
        }

        // Read current directory
        fs.readdir(dir, function(err, files) {
            // File details array to insert into database
            var files_details = [];
            // Directory info inserted as Last record in DB
            var directory_details = {};
            directory_details.total_count = 0;
            directory_details.total_size = 0;
            directory_details.path = dir;
            directory_details.fileType = 3;

            var i = 0;
            var total = files.length;
            var file_info = {};

            for (i = 0; i < total; i++) {

                file_info = self.fileDetailsInfo(dir, files[i]);
                files_details.push(file_info);

                directory_details.total_size += file_info.file_stats.size;
            }
            // Total number of items in directory
            directory_details.total_count = total;
            files_details.push(directory_details);

            // Save directory info into database
            // And make default action if callback() isn't defined
             App.Apps.App["com.files"].Main.Public.Database.populateFolderIndex(dbPath, files_details, callback);            

        });

    },
    readDirectorySync: function(dir) {
        console.log("Reading directory SYNC: ", dir);
        return (fs.readdirSync(dir));
    },
    // Create file details object to save in directory index database
    fileDetailsInfo: function(currDir, item) {
        // our item details object
        var details = {};
        var full_path = path.join(currDir, item);
        details.file_stats = {};
        details.name = item;

        var file_stats = fs.statSync(full_path);

        details.file_stats.size = file_stats.size;
        details.file_stats.atime = file_stats.atime;
        details.file_stats.mtime = file_stats.mtime;
        details.file_stats.ctime = file_stats.ctime;

        if (file_stats.isDirectory()) {
            details.fileType = 1;
        } else {
            details.fileType = 0;
            // Read and display size only for files:
            // details.file_stats.size_human = App.Utils.Functions.humanSize(details.file_stats.size);
        }
        // UID: MD5 hash : name - size - fileType - created_time

        var uid = item + file_stats.size + details.fileType + file_stats.ctime.toString();
        details.uid = crypt.createHash('md5').update(uid).digest('hex');

        // details.extension = App.Utils.Functions.findExtension(item);
        // details.icon = App.Utils.Functions.findExtensionIcon(details.extension, details.fileType);

        return details;
    },
    // Split relative path of workspace to path objects 
    makeBreadCrumbObject: function(currDir, workspace_root) {

        var workspace_dir = currDir.replace(workspace_root, "");
        var path_step = _.compact(workspace_dir.split(path.sep));
        path_step.unshift("/");

        var results = [];
        var res;
        var pre_items = "";

        _.each(path_step, function(item) {
            res = {};
            res.path = path.join(workspace_root, pre_items, item);
            if (item !== "/") {
                res.path = res.path + "/";
            }
            pre_items = pre_items + "/" + item + "/";
            res.id = crypt.createHash('md5').update(res.path).digest('hex');
            res.name = item;
            results.push(res);
        });

        return results;
    }
};

App.Apps.App["com.files"].Main.Utils.Operations = {

    openFolder: function() {
        console.log(this.data);
    },
    cutItem: function() {
        console.log("cutItem");
    },
    copyItem: function() {
        console.log("copyItem");
    },
    pasteItem: function() {
        console.log("pasteItem");
    },
    deleteItem: function() {
        console.log("deleteItem");
    }
};
