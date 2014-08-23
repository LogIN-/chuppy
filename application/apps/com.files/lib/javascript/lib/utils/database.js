/* 
 * @Author: LogIN
 * @Date:   2014-08-21 14:11:26
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-23 11:12:43
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

/* Files app indexed database operations
 * @method initDatastore        {private}   
 * @method populateFolderIndex  {public}       
 * @method getDirectoryIndex    {public}       
 * @method getDirectoryIndexAPI {public}           
 * @method removeItemByUID      {public}   
 */
App.Apps.App["com.files"].Main.Private.Database = function() {
    var self = this;
    self.database = {};

    // Initialize index database in current folder
    self.initDatastore = function(dbPath, callback) {
        var dbID = crypt.createHash('md5').update(dbPath).digest('hex');
        // Check if database is already defined
        if (self.database[dbID] === null || !self.database[dbID]) {
            console.info("Data-store not initialized - initializing: ", dbPath);
            // Persistent datastore with manual loading
            self.database[dbID] = new Datastore({
                filename: dbPath,
            });
            // load datastore index file
            self.database[dbID].loadDatabase(function(error) {
                // Set index field uid unique
                // Indexing time 35 ms for a collection containing 10,000 documents
                self.database[dbID].ensureIndex({
                    fieldName: 'uid',
                    unique: true
                }, function(err) {
                    // If any duplicates that violets unique key lets notify us
                    if(err){
                        console.log(err);
                    }
                    callback(error);
                });
            });
        } else {
            console.info("Data-store already initialized:", dbPath);
            callback(null);
        }
    };
    // Used to index or reload directory index file
    // Inserts items in current data-store index
    // @returns callback() {function}
    self.populateFolderIndex = function(dbPath, data, callback) {
        console.info("Creating folder index: ", dbPath);
        var dbID = crypt.createHash('md5').update(dbPath).digest('hex');
        // Check if database store is already initialized
        // If its not or data-store file doesn't exist lets make it and initialize
        self.initDatastore(dbPath, function(err) {
            if (err !== null) {
                console.log(err);
            }
            // Insert directory data into data-store file
            self.database[dbID].insert([data], function(err) {
                if (err) {
                    console.log(err);
                } else {
                    // Compact directory index
                    self.database[dbID].persistence.compactDatafile(function() {
                        // If callback function inst defined lets do default action
                        if (!callback) {
                            // Set default navigation values
                            App.Apps.App["com.files"].Main.Public.Init.setKeys({
                                items: {
                                    itemsStart: 0,
                                    itemsEnd: 0
                                }
                            });
                            // Calculate items per page and getDirectoryIndex()
                            App.Apps.App["com.files"].Main.Public.Init.findItemsToPaginator();
                        } else {
                            callback(err);
                        }
                    });
                }
            });
        });
    };

    // Read items from directory index
    self.getDirectoryIndex = function(dbPath) {
        console.info("Reading directory index:", dbPath);
        var dbID = crypt.createHash('md5').update(dbPath).digest('hex');
        var systemDetails = App.Apps.App["com.files"].Main.Public.Init.getKeys(['items']);

        console.info("Finding items by: start - " + systemDetails.items.itemsStart + " end - " + systemDetails.items.itemsEnd);
        // Check if database store is already initialized
        // If its not or data-store file doesn't exist lets make it and initialize
        self.initDatastore(dbPath, function(err) {
            if (err !== null) {
                console.log(err);
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
        });
    };

    // Read items from directory index ready for async module
    self.getDirectoryIndexAPI = function(dbPath) {
        return function(cb) {
            console.info("Reading directory index (API):", dbPath);
            var rows = null;
            var dbID = crypt.createHash('md5').update(dbPath).digest('hex');
            // Check if database store is already initialized
            // If its not or data-store file doesn't exist lets make it and initialize
            self.initDatastore(dbPath, function(err) {
                if (err !== null) {
                    console.log(err);
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
                        console.info("Reading directory index (API) successful");
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
                                console.info("Reading directory index (API) - found items:", directory.total_count);
                                rows = items;
                                cb(rows);
                            });
                        } else {
                            console.info("Reading directory index (API) - no found items:", directory);
                            rows = null;
                            cb(rows);
                        }
                    }
                });
            });
        };
    };
    self.removeItemByUID = function(dbPath, itemUID) {
        console.info("removeItemByUID itemUID:", itemUID);
        console.info("removeItemByUID dbPath:", dbPath);
        var dbID = crypt.createHash('md5').update(dbPath).digest('hex');
        // Check if database store is already initialized
        // If its not or data-store file doesn't exist lets make it and initialize
        self.initDatastore(dbPath, function(err) {
            if (err !== null) {
                console.log(err);
            }
            self.database[dbID].remove({
                uid: itemUID
            }, {}, function(err, numRemoved) {
                console.info("removeItemByUID removed:", numRemoved);
            });
        });
    };
};
App.Apps.App["com.files"].Main.Public.Database = new App.Apps.App["com.files"].Main.Private.Database();
