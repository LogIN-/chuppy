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
// So we can know what apps to enable --- TODO: connect with UI and DB
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
        "system": true,
        "order": 0, 
        "icon": "/apps/com.files/lib/images/favicon.png"
    },
}; 

// Initialize apps main context where apps will be loaded
// exp. -- App.Apps.Com.files {}

App.Apps.Private = function () {

    var self = this;
    
    self.userID = null;
    // Container of all detected apps
    self.app_list = [];
    // Container of all detected apps for current user
    self.app_user = [];

    // Detect available apps on file-system and Assign apps to current user
    self.initilizeUserApps = function (userID) {
        var self = this;
        var count_sys = 0;
        var count_usr = 0;
        // Reset Values on every initialize
        self.resetValues();
        self.userID = userID;
        // loop through configuration file
        _.each(App.Apps.Configuration, function(app){
            // If app file exists on file-system
            if (fs.existsSync(app.path)) {
                // Add app info to global app info object
                self.app_list[count_sys] = app;
                count_sys++;
                // Assign Default apps
                if(app.system === true && app.enabled === true){
                    self.app_user[count_usr] = app;
                    App.Utils.Apps.initilizeApp(app);
                    count_usr++;
                }else {
                    new App.Database.UserApps({uid: self.userID, "name-space": app["name-space"]}).fetchAll().then(function(collection) {
                        // If any apps exists loop through them
                        if(collection !== null ){
                            _.each(collection.models, function(model){
                                // Check if app is enabled
                                if(model.get('enabled') === 1){
                                    self.app_user[count_usr] = model.attributes;
                                    App.Utils.Apps.initilizeApp(model.attributes);
                                    count_usr++;
                                }
                                
                            });
                        }
                    });
                }
            }
        });
    };
    // on user setup insert default apps into user_apps table
    self.installUserApps = function () {
        var self = this;
    };
    self.getAllUserApps = function () {
        return self.app_user;
    };
    self.getAllSystemApps = function () {
        return self.app_list;
    };

    self.resetValues = function () {
        console.log("USER PUBLIC: resetValues");
        self.app_list = [];
        self.app_user = [];
        self.userID = null;
    };
};

// Return keys and values of appID -> name-space
App.Apps.Private.prototype.getUserAppDetails = function (appID) {
    console.log("App.Apps.Private getUserAppDetails: ", appID);
    _.each(this.app_user, function(app){
        if(app["name-space"] === appID){
            return app;
        }
    });
};

App.Apps.Public = new App.Apps.Private(); 