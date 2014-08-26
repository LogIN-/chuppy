/* 
* @Author: LogIN
* @Date:   2014-08-20 14:30:57
* @Email:  unicoart@gmail.com
* @URL:    https://github.com/LogIN-/chuppy
* @Last Modified by:   login
* @Last Modified time: 2014-08-22 16:44:14
* Use of this source code is governed by a license: 
* The MIT License (MIT)
* 
* Copyright (c) 2014-08-20 14:30:57 The Chuppy Authors
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

// Apps configuration file
App.Apps.Configuration = {
    0: {
        // file-system name of app must be unique ("name-space") and app folder must have same name
        "name-space": "com.files",
        // Name variable of app (same as in i18n variable ) 
        "name": "files",
        // Path to the app folder default (/apps/{app.system.name})
        "path": "apps/com.files/index.js",
        // Is app enabled or disabled
        "enabled": true,
        // If system is true then this is default app
        "isDefault": true,
        "order": 0, 
        // "icon": "/apps/com.files/lib/images/favicon.png"
        "icon": "/lib/images/system-icons/system/holo_dark/10_device_access_storage/drawable-xhdpi/ic_action_storage.png",
        // Is app visible in menu?
        "visible": true,
        // Any specific file-types supported by this application?
        "supportedFileTypes": ['dir'],
        // How should system display this app
        "display": "tab"
    },
    1: {
        // file-system name of app must be unique ("name-space") and app folder must have same name
        "name-space": "com.pdfViewer",
        // Name variable of app (same as in i18n variable ) 
        "name": "pdfViewer",
        // Path to the app folder default (/apps/{app.system.name})
        "path": "apps/com.pdfViewer/index.js",
        // Is app enabled or disabled
        "enabled": true,
        // If system is true then this is default app
        "isDefault": false,
        "order": 1, 
        // "icon": "/apps/com.files/lib/images/favicon.png"
        "icon": "/lib/images/system-icons/system/holo_dark/10_device_access_storage/drawable-xhdpi/ic_action_storage.png",
        // Is app visible in menu?
        "visible": false,
        // Any specific file-types supported by this application?
        "supportedFileTypes": ['pdf'],
        // How should system display this app
        "display": "iframe"
    },
}; 

// Initialize apps main context where apps will be loaded
// exp. -- App.Apps.Com.files {}

App.Apps.Private = function () {
    var self = this;
    // ID of current user
    self.userID = null;
    // Container of all detected apps
    self.appList = [];
    // Container of all detected apps for current user
    self.appUser = [];

    // Detect available apps on file-system and Assign apps to current user
    self.initilizeUserApps = function (userID) {
        var self = this;
        // Reset Values on every initialize
        self.resetValues();
        self.userID = userID;
        // loop through configuration file
        _.each(App.Apps.Configuration, function(app){
            // If app file exists on file-system
            if (fs.existsSync(app.path)) {
                // Add app info to global app info object
                self.appList.push(app);
                // Check if app is already in DB 
                // if not Insert it with default values
                // and populate this.appUser
                App.Utils.Apps.initilizeApp(app);


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
        self.appList = [];
        self.appUser = [];
        self.userID = null;
    };
};
// Return keys and values of appID -> name-space
App.Apps.Private.prototype.getUserAppDetails = function (appID) {
    var options = null;
    console.info("App.Apps.Private getUserAppDetails: ", appID);
    _.each(this.appUser, function(app){
        if(app["name-space"] === appID){
            options = app;
        }
    });
    return options;
};

App.Apps.Private.prototype.pushAppUserApp = function (newApp) {
    this.appUser.push(newApp);
};

App.Apps.Public = new App.Apps.Private(); 