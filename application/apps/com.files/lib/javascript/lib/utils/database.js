/* 
* @Author: LogIN
* @Date:   2014-08-21 14:11:26
* @Email:  unicoart@gmail.com
* @URL:    https://github.com/LogIN-/chuppy
* @Last Modified by:   login
* @Last Modified time: 2014-08-22 16:42:51
* Use of this source code is governed by a license: 
* The MIT License (MIT)
* 
* Copyright (c) 2014-08-21 14:11:26 The Chuppy Authors
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

/* global crypt */
App.Apps.App["com.files"].Main.Private.Database = function() {
    var self = this;
    self.database = {};

    // Initialize index database in current folder
    self.initDatastore = function(dbPath) {
        var dbID = crypt.createHash('md5').update(dbPath).digest('hex');
        if (!self.database[dbID]) {
            console.log("Creating folder datastore: ", dbPath);
            self.database[dbID] = new Datastore({
                filename: dbPath,
                autoload: true
            });
        }
    };
    // After inserts lets compact database 
    self.compactDatastore = function(dbPath) {
        console.log("Compacting datastore: ", dbPath);
        var dbID = crypt.createHash('md5').update(dbPath).digest('hex');
        if (self.database[dbID]) {
            // Compact database
            self.database[dbID].persistence.compactDatafile();
            delete self.database[dbID];
        } else {
            console.log("nothing to compact!");
        }

    };
    // Inserts items in current data-store index
    self.populateFolderIndex = function(dbPath, data, startGUI) {
        console.log("Creating folder index: ", dbPath);
        var dbID = crypt.createHash('md5').update(dbPath).digest('hex');
        self.database[dbID] = null;

        self.database[dbID] = new Datastore({
            filename: dbPath
        });

        self.database[dbID].loadDatabase(function(err) { // Callback is optional
            self.database[dbID].ensureIndex({
                fieldName: 'uid',
                unique: true
            }, function(err) {
                // Insert directory data into data-store file
                self.database[dbID].insert([data], function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (startGUI === true) {
                            self.database[dbID].persistence.compactDatafile(function() {
                                // Set default navigation values
                                App.Apps.App["com.files"].Main.Public.Init.setKeys({
                                    items: {
                                        itemsStart: 0,
                                        itemsEnd: 0
                                    }
                                });
                                // Calculate items per page and getDirectoryIndex()
                                App.Apps.App["com.files"].Main.Public.Init.findItemsToPaginator();
                            });
                        }
                    }
                });
            });
        });
    };

    self.createIndexKey = function(dbPath, fieldName, uniqueKey) {
        // Default values
        fieldName = typeof fieldName !== 'undefined' ? fieldName : "name";
        uniqueKey = typeof uniqueKey !== 'undefined' ? uniqueKey : false;

        console.log("Creating datastore index key: ", dbPath);
        var dbID = crypt.createHash('md5').update(dbPath).digest('hex');

        if (!self.database[dbID]) {
            self.initDatastore(dbPath);
        }

        self.database[dbID].ensureIndex({
            fieldName: fieldName,
            unique: uniqueKey
        }, function(err) {
            if (!err) {
                console.log("Index created");
                self.compactDatastore(dbPath);

            }
        });

    };
    // Read items from directory index
    self.getDirectoryIndex = function(dbPath) {
        console.log("Reading index ", dbPath);
        var dbID = crypt.createHash('md5').update(dbPath).digest('hex');
        var systemDetails = App.Apps.App["com.files"].Main.Public.Init.getKeys(['items']);

        console.log("Finding items by: start - " + systemDetails.items.itemsStart + " end - " + systemDetails.items.itemsEnd);
        if (self.database[dbID] === null || !self.database[dbID]) {
            self.initDatastore(dbPath);
        }

        // Find directory info data in index file
        self.database[dbID].findOne({
            fileType: 3
        }, function(err, directory) {
            if (err) {
                console.log(err);
            } else {
                // If there are any files in this directory lets list them
                if (directory && directory.total_count > 0) {
                    // Find all documents in the data-store and sort them by name field
                    self.database[dbID].find({
                        $not: {
                            fileType: 3
                        }
                    }).sort({
                        name: 1
                    }).skip(systemDetails.items.itemsStart).limit(systemDetails.items.itemsEnd).exec(function(err, items) {
                        if (err) {
                            console.log(err);
                        } else {
                            App.Apps.App["com.files"].Main.Public.Init.setKeys({
                                items: {
                                    currentItems: items,
                                    dirItemsTotal: directory.total_count,
                                    dirItemsTotalSize: directory.total_size
                                }
                            });
                            App.Apps.App["com.files"].Main.Public.Init.addItemsToPaginator();
                        }
                    });
                } else {
                    App.Apps.App["com.files"].Main.Public.Init.setKeys({
                        items: {
                            currentItems: null,
                            dirItemsTotal: directory.total_count,
                            dirItemsTotalSize: directory.total_size
                        }
                    });
                    App.Apps.App["com.files"].Main.Public.Init.addItemsToPaginator();
                }
            }
        });
    };

    // Read items from directory index ready for async module
    self.getDirectoryIndexAPI = function(dbPath) {
        return function(cb) {
            console.log("Reading index ", dbPath);
            var rows = null;
            var dbID = crypt.createHash('md5').update(dbPath).digest('hex');

            if (self.database[dbID] === null || !self.database[dbID]) {
                self.initDatastore(dbPath);
            }           
            // Find directory info data in index file
            self.database[dbID].findOne({
                fileType: 3
            }, function(err, directory) {
                if (err) {
                    console.log(err);
                    rows = null;
                    cb(rows);
                } else {
                    console.log("getDirectoryIndexAPI success");
                    // If there are any files in this directory lets list them
                    if (directory && directory.total_count > 0) {
                        // Find all documents in the data-store and sort them by name field
                        self.database[dbID].find({
                            $not: {
                                fileType: 3
                            }
                        }).sort({
                            name: 1
                        }).exec(function(err, items) {
                            if (err) {
                                console.log(err);

                            }
                            console.log("getDirectoryIndexAPI success, items found");
                            rows = items;
                            cb(rows);
                        });
                    }else{
                        console.log("getDirectoryIndexAPI no items in directory");
                        rows = null;
                        cb(rows);
                    }
                }
            });
        };
    };
    self.removeItemByUID = function (dbPath, itemUID){
        console.info("removeItemByUID itemUID:", itemUID);
        console.info("removeItemByUID dbPath:", dbPath);
        var dbID = crypt.createHash('md5').update(dbPath).digest('hex');
        if (self.database[dbID] === null || !self.database[dbID]) {
            self.initDatastore(dbPath);
        }
        self.database[dbID].remove({ uid: itemUID }, {}, function (err, numRemoved) {
            console.info("removeItemByUID removed:", numRemoved);
        });
    };
};
App.Apps.App["com.files"].Main.Public.Database = new App.Apps.App["com.files"].Main.Private.Database();
