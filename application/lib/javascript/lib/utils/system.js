/* 
 * @Author: LogIN
 * @Date:   2014-08-20 14:45:07
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-25 17:22:48
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
/* global crypt */

// Global application AppSystem related operations
App.Private.System = function() {
    var self = this;

    self.user = null;
    self.apps = null;

    self.views = {
        main: {},
        apps: []
    };

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
        self.user = App.Public.User.getUserKeysAll();

        // if userID isn't set (from setup form etc) we need to display login view
        // TODO: But first destroy main app view
        if (self.user.userMain.logged_in === false) {
            if (self.mainUI.views.main.loginView === null) {
                self.mainUI.views.main.loginView = new App.View.loginView();
            }
        } else {
            // Now loading main application variables.. lets show user loading screen 
            // and what with operations until all of them are loaded!!
            App.Utils.Template.loadingScreen("#overlay", 1);
            self.initilizeSystem();
        }
    };
    self.initilizeSystem = function() {
        var self = this;
        // Set apps for current user
        App.Apps.Public.initilizeUserApps(self.user.id);
        // Get apps for current user        
        self.apps = App.Apps.Public.getAllUserApps();

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
            self.mainUI.views.main.headerBar = new App.View.headerBar();
        }
        if (self.mainUI.views.main.navigation === null) {
            self.mainUI.views.main.navigation = new App.View.navigation({
                menuItems: self.apps
            });
        }
        if (self.mainUI.views.main.footerBar === null) {
            self.mainUI.views.main.footerBar = new App.View.footerBar();
        }
        // MAIN APPLICATION MODULE CONTAINER
        if (self.mainUI.collection.applications === null) {
            self.mainUI.collection.applications = new App.Collections.ApplicationBody();

        }
        if (self.mainUI.views.main.applicationBody === null) {
            self.mainUI.views.main.applicationBody = new App.View.ApplicationBody({
                collection: self.mainUI.collection.applications
            });
        }
        // Start default application
        self.initilizeDefaultApp();

        // Remove loading animation
        App.Utils.Template.loadingScreen("#overlay", 0);
    };
    self.resetValues = function() {
        self.user = null;
        self.apps = null;
        self.mainUI.views.main = {};
        self.mainUI.views.apps = [];
    };
    // TODO: remove any active APPS like files app!!!!!
    self.reInitilize = function() {
        // Remove main app views
        _.each(self.mainUI.views.main, function(view) {
            if (typeof view.removeView === 'function') {
                view.removeView();
            }
        });
        // Remove apps views
        _.each(self.mainUI.views.apps, function(app) {
            if (typeof app.removeView === 'function') {
                app.removeView();
            }
        });
        // Reset User Object
        App.Public.User.resetValues();
        // Remove loaded apps from DOM and delete their object
        App.Utils.Apps.resetValues(self.apps);
        // Reset System Object
        self.resetValues();
        // remove any user application from User Apps configuration
        App.Apps.Public.resetValues();
        // Reset our internal route
        App.Router.navigate('/', {
            trigger: true
        });
        // Stat system with new values
        self.initilize();
    };

};
App.Private.System.prototype.initilizeDefaultApp = function() {
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
App.Private.System.prototype.startApp = function(appID) {
    var self = this;
    console.log("App.Private.System.prototype.startApp: ", appID);
    var options = App.Apps.Public.getUserAppDetails(appID);
    console.log(options);
    
    if (!self.mainUI.views.apps[appID]) {
        // Little Hack to display loading while waiting async operations
        // (Browser JS script injections)
        var interval = setInterval(function() {
            if (typeof App.Apps.App[appID].Setup === "function") {
                clearInterval(interval);
                self.mainUI.collection.applications.add(_.extend(options, {uid: crypt.createHash('md5').update(options["name-space"]).digest('hex')}));
            } else {
                console.log("Loading application data from SYSTEM");
                console.log(typeof App.Apps.App[appID].Setup);
            }
        }, 100);
    } else {
        console.log("Application already started!");
    }
    // Active element in CSS
    $("#nav-side-left").find("[data-href='" + appID + "']").addClass('active');
};

App.Public.System = new App.Private.System();
