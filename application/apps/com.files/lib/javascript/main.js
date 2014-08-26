/* 
 * @Author: LogIN
 * @Date:   2014-08-22 15:17:57
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-26 11:48:01
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-22 15:17:57 The Chuppy Authors
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

/* global crypt, Mousetrap */

/* Main file-explorer application class */
App.Apps.App["com.files"].Main.Private.Init = function(options) {
    var self = this;
    // Get user details so we can know what is default workspace dir
    self.user = App.Public.User.getUserKeys('userDetails');

    self.workspaceRoot = options.workspaceRoot  || self.user.userDetails.root_folder;
    self.startingDirectory = options.filePath  || self.workspaceRoot;
    

    /* Configuration variable */
    self.directory = {
        location: {
            currentLocation: self.startingDirectory,
            workspaceRoot: self.workspaceRoot,
            // Current directory index database full path
            dbLocation: self.startingDirectory + "." + crypt.createHash('md5').update(self.startingDirectory).digest('hex')
        },
        items: {
            // Current folder item models to display
            currentItems: [],
            // Current folder navigation items models to display
            currentNavItems: [],
            itemsStart: 0,
            itemsEnd: 0,
            dirItemsTotal: 0,
            dirItemsTotalSize: 0
        },
        display: { // Navigation
            navType: "icons",
            navOrder: "name"
        },
        system: {
            uid: options.uid,
            // Should we reload current dir Index
            reloadIndex: false,
            contextActive: false
        },
        // User actions
        userActions: {
            activeAction: null,
            open: {
                source: null
            },
            // Array with files objects to copy
            // { sourceFilePath: "", targetFilePath: ""}
            copy: [],
            // Array with files objects to cut
            // { sourceFilePath: "", targetFilePath: ""}
            cut: [],
            share: {
                source: null
            },
            details: {
                source: null
            }
        }
    };

    self.mainUI = {        
        collection: {
            items: null,
            breadcrumb: null,
        },
        views: {
            directory: null,
            navigation: {
                breadcrumb: null,
                actions: null
            }
        }
    };

    console.log("NEW FOLDER OBJECT:", options.uid);
    console.log("Workspace root:", self.workspaceRoot);
    console.log("Starting directory:", self.startingDirectory);

    self.initialize = function() {

        // Initialize folder items (files/dirs) collection
        if (self.mainUI.collection.items === null) {
            self.mainUI.collection.items = new App.Apps.App["com.files"].Main.Collection.Folder();

        }
        // Initialize breadcrumb navigation items collection
        if (self.mainUI.collection.breadcrumb === null) {
            self.mainUI.collection.breadcrumb = new App.Apps.App["com.files"].Main.Collection.BreadCrumb();
        }
        // Initialize breadcrumb navigation view
        if (self.mainUI.views.navigation.breadcrumb === null) {
            self.mainUI.views.navigation.breadcrumb = new App.Apps.App["com.files"].Main.View.BreadCrumb({
                // ID for current constructed class
                uid: options.uid,
                // DOM Element
                el: $('#application-tabs-' + options.uid + ' .file-explorer-breadcrumb'),
                // Collection
                collection: self.mainUI.collection.breadcrumb
            });
        }
        // Initialize breadcrumb navigation view
        if (self.mainUI.views.navigation.actions === null) {
            self.mainUI.views.navigation.actions = new App.Apps.App["com.files"].Main.View.BreadCrumbActions({
                // ID for current constructed class
                uid: options.uid,
                // DOM Element
                el:  $('#application-tabs-' + options.uid + ' .file-explorer-action-views')
            });
        }
        // Initialize folder view
        if (self.mainUI.views.directory === null) {
            self.mainUI.views.directory = new App.Apps.App["com.files"].Main.View.ExplorerMain({
                // ID for current constructed class
                uid: options.uid,
                // DOM Element
                el: $('#application-tabs-' + options.uid + ' .file-explorer'),
                // Collection
                collection: self.mainUI.collection.items
            });
        }
        // Register keyboard codes and actions
        self.registerKeyCodes();
        // read current folder and add items to folder collection
        self.openDirectory(self.directory.location.currentLocation);

    };
    // Opens new directory and create directory Index file and starts findItemsToPaginator()
    // @parm directory {string} should always end with "/"
    self.openDirectory = function(directory) {
        console.log("OPENING DIRECTORY:", directory);
        // Add application loading screen class
        App.Utils.Template.loadingScreen("#files-loading-screen", 1, "files_loading_screen");

        // Set current location in Files Class
        self.directory.location.currentLocation = directory;
        // Set new folder index db location
        self.directory.location.dbLocation = path.join(directory, "." + crypt.createHash('md5').update(directory).digest('hex'));

        // TODO: 
        // If there are more then 100 items loaded lets remove them in bulk
        // otherwise remove them one by one
        // Empty all models from collection
        self.mainUI.collection.items.reset();
        // Remove all views from main folder view
        self.mainUI.views.directory.removeAll();


        // reset pagination
        self.directory.items.itemsStart = 0;
        self.directory.items.itemsEnd = 0;

        console.log("Items reset:", self.directory.items.itemsStart, self.directory.items.itemsEnd);
        console.log("View type:", self.directory.display.navType); 

        // read current full path and make models
        // TODO remove/add only models one by one not whole collection 
        if (self.directory.items.currentNavItems.length > 0) {
            console.info("REMOVING breadcrumb objects:", self.directory.items.currentNavItems);
            _.each(self.directory.items.currentNavItems, function(item){
                self.mainUI.collection.breadcrumb.remove(self.mainUI.collection.breadcrumb.getByUid(item.uid));
            });
            
        }
        self.directory.items.currentNavItems = App.Apps.App["com.files"].Main.Utils.Actions.makeBreadCrumbObject(self.directory.location.currentLocation, self.directory.location.workspaceRoot);
        
        if (self.directory.items.currentNavItems.length > 0) {
            console.info("ADDING breadcrumb objects:", self.directory.items.currentNavItems);
            _.each(self.directory.items.currentNavItems, function(item){
                self.mainUI.collection.breadcrumb.add(new App.Apps.App["com.files"].Main.Model.BreadCrumbItems(item));
            });
        }
        
        console.log(self.directory.system);
        // IF index for this directory doesn't exist lets read it from file-system
        if (fs.existsSync(self.directory.location.dbLocation) === false || self.directory.system.reloadIndex === true) {
            console.info("reloading directory index");
            // If database index exist that mens we forced index reload with reload_index = true
            // Otherwise this function wouldn't be called
            if (fs.existsSync(self.directory.location.dbLocation)) {
                console.log("INDEX DELETED");
                App.Utils.FileSystem.rmFileSync([self.directory.location.dbLocation]);
                self.directory.system.reloadIndex = false;
            }
            App.Apps.App["com.files"].Main.Utils.Actions.indexDirectory(self.directory.location.currentLocation, self.directory.location.dbLocation, function(err, data){
                // Set default navigation values
                self.directory.items.itemsStart = 0;
                self.directory.items.itemsEnd = 0;
                self.findItemsToPaginator();
            });
        } else { 
            console.info("directory index found");
            self.findItemsToPaginator();
        }
    };
    // Find items by order start and end and starts addItemsToPaginator()
    self.findItemsToPaginator = function() {
        console.log("Items before detectItemsPerPage: ", self.directory.items.itemsStart, self.directory.items.itemsEnd);
        // Set start and end items variables
        self.mainUI.views.directory.detectItemsPerPage();
        // Reset current items variable before we add new ones
        self.directory.items.currentItems = [];
        self.directory.items.dirItemsTotal = 0;
        self.directory.items.dirItemsTotalSize = 0;

        console.log("Items before reading index: ", self.directory.items.itemsStart, self.directory.items.itemsEnd);
        // Get index from index Database
        App.Apps.App["com.files"].Main.Public.Database.getDirectoryIndex(self.directory.location.dbLocation, options.uid);
    };

    self.addItemsToPaginator = function() {

        if (self.directory.items.currentItems !== null) {
            self.mainUI.collection.items.add(self.directory.items.currentItems);
            // On every new folder "open" action reinitialize Drag&Drop
            self.mainUI.views.directory.setupSelectDragDrop();
        }
        // No items? set notification class or remove it
        self.mainUI.views.directory.setEmptyDirectory();

        // Remove application loading screen class
        App.Utils.Template.loadingScreen("#files-loading-screen", 0, "files_loading_screen");
    };

};
// Remove all views, collection, models from system
App.Apps.App["com.files"].Main.Private.Init.prototype.removeView = function() {
    console.log("REMOVING FILES VIEW!");
    // Delete whole directory view
    this.mainUI.views.directory.removeView();

    // Delete BredCrumb Actions view
    this.mainUI.views.navigation.actions.removeView();

    // Delete BredCrumb
    this.mainUI.views.navigation.breadcrumb.removeView();
};

// Return keys from directory object
App.Apps.App["com.files"].Main.Private.Init.prototype.getKeys = function(keys) {
    return _.pick(this.directory, keys);
};
// Return count of values from key Object
App.Apps.App["com.files"].Main.Private.Init.prototype.countItems = function() {
    var count = 0;
    if (this.directory.items.currentItems) {
        count = this.directory.items.currentItems.length;
    }
    return count;
};
// Set directory object options
// Merge two objects recursively, modifying the first.
App.Apps.App["com.files"].Main.Private.Init.prototype.setKeys = function(newObject) {
    this.directory = $.extend(true, this.directory, newObject);


};
// Remove model(s) from Folder collection
// {parm} modelsCIDs {@array} - Accepts array of backbone model CID's
App.Apps.App["com.files"].Main.Private.Init.prototype.removeFolderModels = function(modelsCIDs) {
    // Reference to parent object
    var self = this;
    var model;
    _.each(modelsCIDs, function(modelCID) {
        // Get model from collection by CID
        model = self.mainUI.collection.items.get({
            cid: modelCID
        });
        // If model exists remove it from collection/view
        if (model !== null) {
            console.info("Removing model from folder collection: ", modelCID);
            self.mainUI.collection.items.remove(model);
        } else {
            console.info("Removing model from folder collection failed!", modelCID);
            console.log(model);
        }
    });
};
// Return keys from directory object
App.Apps.App["com.files"].Main.Private.Init.prototype.startPluginView = function(pluginID) {

};
// Register keyboard actions
App.Apps.App["com.files"].Main.Private.Init.prototype.registerKeyCodes = function() {
    // var self = this;
    // // Reloads current view
    // Mousetrap.bind(['ctrl+shift+r', 'ctrl+f5'], function(e) {
    //     if (e.preventDefault) {
    //         e.preventDefault();
    //     }
    //     // Force index reload
    //     self.setKeys({
    //         system: {
    //             reloadIndex: true
    //         }
    //     });
    //     // Reopen current directory with new data 
    //     self.openDirectory(self.directory.location.currentLocation);
    // });
};
