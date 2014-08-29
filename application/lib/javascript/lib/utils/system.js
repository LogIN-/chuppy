/* 
 * @Author: LogIN
 * @Date:   2014-08-20 14:45:07
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-29 15:06:22
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-20 14:45:07 The Chuppy Authors
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
/* global crypt, Chuppy */

// Global application AppSystem related operations
Chuppy.Private.System = function() {
    var self = this;

    self.user = null;
    self.apps = null;

    self.mainUI = {
        collection: {
            applications: null
        },
        views: {
            apps: [],
            main: {
                loginView: null,
                headerBar: null,
                navigation: null,
                footerBar: null,
                applicationBody: null,
            }
        }
    };

    self.initilize = function() {
        self.user = Chuppy.Public.User.getUserKeysAll();
        console.info("Initializing main system for::", self.user.username);
        // if userID isn't set (from setup form etc) we need to display login view
        // TODO: But first destroy main app view
        if (self.user.userMain.logged_in === false) {
            console.info("User isn't loged-in");
            if (self.mainUI.views.main.loginView === null) {
                console.info("Starting login view");
                self.mainUI.views.main.loginView = new Chuppy.View.loginView();
            }
        } else {
            // Now loading main application variables.. lets show user loading screen 
            // and what with operations until all of them are loaded!!
            Chuppy.Utils.Template.loadingScreen("#overlay", 1);
            self.initilizeSystem();
        }
    };
    self.initilizeSystem = function() {
        var self = this;
        // Set apps for current user
        Chuppy.Apps.Public.initilizeUserApps(self.user.id);
        // Get apps for current user        
        self.apps = Chuppy.Apps.Public.getAllUserApps();

        // Little Hack to display loading while waiting async operations
        var interval = setInterval(function() {
            if (self.user.userMain.username !== null && self.user.userDetails.uid !== null && self.apps !== null) {
                console.log("Loading user data....");
                clearInterval(interval);
                self.initilizeSystemUI();
            }
        }, 100);

    };
    self.initilizeSystemUI = function() {
        var self = this;
        console.log("initilizeSystemUI");

        if (self.mainUI.views.main.headerBar === null) {
            self.mainUI.views.main.headerBar = new Chuppy.View.headerBar();
        }
        if (self.mainUI.views.main.navigation === null) {
            self.mainUI.views.main.navigation = new Chuppy.View.navigation({
                menuItems: self.apps
            });
        }
        if (self.mainUI.views.main.footerBar === null) {
            self.mainUI.views.main.footerBar = new Chuppy.View.footerBar();
        }
        // MAIN APPLICATION MODULE CONTAINER
        if (self.mainUI.collection.applications === null) {
            self.mainUI.collection.applications = new Chuppy.Collections.ApplicationBody();

        }
        if (self.mainUI.views.main.applicationBody === null) {
            self.mainUI.views.main.applicationBody = new Chuppy.View.ApplicationBody({
                collection: self.mainUI.collection.applications
            });
        }
        // Start default application
        self.initilizeDefaultApp();

        // Remove loading animation
        Chuppy.Utils.Template.loadingScreen("#overlay", 0);
    };
    self.resetValues = function() {
        self.user = null;
        self.apps = null;
        self.mainUI.collection.applications = null;

        self.mainUI.views.main.loginView = null;
        self.mainUI.views.main.headerBar = null;
        self.mainUI.views.main.navigation = null;
        self.mainUI.views.main.footerBar = null;
        self.mainUI.views.main.applicationBody = null;

        self.mainUI.views.apps = [];
    };
    // TODO: remove any active APPS like files app!!!!!
    self.reInitilize = function() {
        // Remove apps views
        self.mainUI.collection.applications.remove(self.mainUI.collection.applications.models);
        
        // Remove main system views
        _.each(self.mainUI.views.main, function(view) {
            if (typeof view.removeView === 'function') {
                view.removeView();
            }
        });
        // Reset User Object
        Chuppy.Public.User.resetValues();
        // Remove loaded apps objects
        Chuppy.Utils.Apps.resetValues(self.apps);
        // Reset System Object
        self.resetValues();
        // remove any user application from User Apps configuration
        Chuppy.Apps.Public.resetValues();
        // Stat system with new values
        self.initilize();
    };

};
Chuppy.Private.System.prototype.initilizeDefaultApp = function() {
    var self = this;
    var appFound = false;

    _.each(self.apps, function(app) {
        if (app.isDefault === true && app.enabled === true && appFound === false) {
            console.log("STARTING DEFOULT APPLICATION");
            self.startApp(app["name-space"]);
            appFound = true;
        }
    });
};
Chuppy.Private.System.prototype.startApp = function(appID) {
    var self = this;
    console.log("Chuppy.Private.System.prototype.startApp: ", appID);
    var options = Chuppy.Apps.Public.getUserAppDetails(appID);
    console.log(options);   
    var counter = 0;
    // Little Hack to display loading while waiting async operations
    // (Browser JS script injections)
    var interval = setInterval(function() {
        if(counter === 100){
            console.log("App loading canceled");
            clearInterval(interval);
            return;
        }
        if (typeof Chuppy.Apps.App[appID].Setup === "function") {
            clearInterval(interval);
            self.mainUI.collection.applications.add(_.extend(options, {uid: crypt.createHash('md5').update(options["name-space"]).digest('hex')}));
        } else {
            console.log("Loading application data from SYSTEM");
            counter++;
        }
    }, 100);
    if(options.visible === true){
        // Active element in CSS
        $("#nav-side-left").find("[data-href='" + appID + "']").addClass('active');
    }
};

Chuppy.Public.System = new Chuppy.Private.System();
