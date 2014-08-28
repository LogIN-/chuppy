/* 
 * @Author: LogIN
 * @Date:   2014-08-28 10:42:35
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-28 10:43:07
 * Use of this source code is governed by a license: 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014-08-28 10:42:35 The Chuppy Authors
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
/* globals mime */

// Initialize apps main context where apps will be loaded
// exp. -- Chuppy.Apps.Com.files {}

Chuppy.Apps.Private = function () {
    var self = this;
    // ID of current user
    self.userID = null;
    // Container of all detected apps
    self.appList = [];
    // Container of all detected apps for current user
    self.appUser = [];
    // File-type actions
    self.supportedFileTypes = {};
    // ['application/pdf' => 'com.pdfViewer']

    // Detect available apps on file-system and Assign apps to current user
    self.initilizeUserApps = function (userID) {
        var self = this;
        // Reset Values on every initialize
        self.resetValues();
        self.userID = userID;
        // loop through configuration file
        _.each(Chuppy.Apps.Configuration, function(app){
            // If app file exists on file-system
            if (fs.existsSync(app.path)) {
                // Add app info to global app info object
                self.appList.push(app);

                var mimeType;
                _.each(app.supportedFileTypes, function (extension){
                    console.info("Adding support for extension:", extension);
                    // Support for internal extensions like "directory"
                    if(extension !== 'directory'){
                        mimeType = mime.lookup(extension);
                    }else{
                        mimeType = extension;
                    }                    
                    console.info(mimeType);
                    if(!self.supportedFileTypes[mimeType]){
                        self.supportedFileTypes[mimeType] = [];
                    }    
                    // TODO: check for duplicate #name-space#                
                    self.supportedFileTypes[mimeType].push(app["name-space"]);
                });

                // Check if app is DB, if isn't insert it with default values in DB
                // - populate this.appUser
                Chuppy.Utils.Apps.initilizeApp(app);


            }else{
                console.log("App index file doesn't exist:", app.path);
            }
        });
    };
    // on user setup insert default apps into user_apps table
    self.installUserApps = function () {
        var self = this;
    };
    self.getAllUserApps = function () {
        return self.appUser;
    };
    self.getAllSystemApps = function () {
        return self.appList;
    };

    self.resetValues = function () {
        console.log("USER PUBLIC: resetValues");
        // ID of current user
        self.userID = null;
        // Container of all detected apps
        self.appList = [];
        // Container of all detected apps for current user
        self.appUser = [];
        // File-type actions
        self.supportedFileTypes = {};
        // ['application/pdf' => 'com.pdfViewer']
    };
};
// Return keys and values of appID -> name-space
Chuppy.Apps.Private.prototype.getSupportedAppsForMimeType = function (mimeType) {
    var results = null;
    if(this.supportedFileTypes[mimeType]){
        results = this.supportedFileTypes[mimeType];
    }
    return results;
};

// Return keys and values of appID -> name-space
Chuppy.Apps.Private.prototype.getUserAppDetails = function (appID) {
    var options = null;
    console.info("Chuppy.Apps.Private getUserAppDetails: ", appID);
    _.each(this.appUser, function(app){
        if(app["name-space"] === appID){
            options = app;
        }
    });
    return options;
};

Chuppy.Apps.Private.prototype.pushAppUserApp = function (newApp) {
    this.appUser.push(newApp);
};

Chuppy.Apps.Public = new Chuppy.Apps.Private(); 