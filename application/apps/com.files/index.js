/* 
* @Author: LogIN
* @Date:   2014-08-20 14:41:35
* @Email:  unicoart@gmail.com
* @URL:    https://github.com/LogIN-/chuppy
* @Last Modified by:   login
* @Last Modified time: 2014-08-22 16:44:04
* Use of this source code is governed by a license: 
* The MIT License (MIT)
* 
* Copyright (c) 2014-08-20 14:41:35 The Chuppy Authors
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

/* global dbORM:true, knex:true */

// Define our app starting objects
// others are defined in lib/globals.js
App.Apps.App["com.files"] = {Main: {}, Setup: null};

App.Apps.App["com.files"].Setup = function(options){
    var self = this;

    self.options = {
        "name-space": "com.files",
        // Name variable of app (same as in i18n variable ) 
        "name": "files",
        // Path to the app folder default (/apps/{app.system.name})
        "path": "apps/com.files",
        // Is app enabled or disabled
        "enabled": true,
        "default": true,
        "order": 0,
        "icon": "/apps/com.files/lib/images/favicon.png",
        // Check if app is already initialized
        "init": false,
        // ID of parent application css container added dynamically from ApplicationBody.js main view
        // {container: "#application-tabs-" + uid}
        // But will always have #application-tabs[data-namespace='app.namespace']
        "uid": null,
    };
    self.options = _.extend(this.options, options);

    console.info("App defaults initialized!");

    // Setup needed database for app and include needed files (js/css)
    // All include JS and CSS files must have app prefix exp. 
    // JS: App.Apps.App["com.files"].Utils 
    // CSS: #my-files-app .someclass
    self.setupDependencies = function () {
        console.info("Setting up app dependencies");
        // main application template
        var template = _.template(App.Utils.FileSystem.readFileLocal('apps/com.files/lib/templates/main.tpl', 'sync'));
        $("#application-tabs-" + self.options.uid).html(template);

        self.setupDatabase();
        self.setupIncludes();

    };
    // After successful app init this function is called
    // Here is a place where magic should happen
    self.initilizeAppUI = function () {
        if(self.options.init === false){
            // Little Hack to display loading while waiting async operations
            var interval = setInterval(function() {
                if (typeof App.Apps.App["com.files"].Main.Private.Init === "function") {                     
                    clearInterval(interval);
                    // Create our application object
                    App.Apps.App["com.files"].Main.Public.Init = new App.Apps.App["com.files"].Main.Private.Init(self.options);
                    // Render application
                    App.Apps.App["com.files"].Main.Public.Init.initialize();
                }else{
                    console.log("Loading application data");
                }
            }, 100);

        }else{
            console.log("App.Apps.Com.files already initialized");
        }

        self.options.init = true;       

    };
    // Remove current app dependencies 
    // Called from App.Utils.Apps
    self.removeView = function () {
        // Remove all HTML tags/includes by data-id
        App.Utils.Apps.resetValues(['com.files']);
    };

};
// Any app database tables that should be created
App.Apps.App["com.files"].Setup.prototype.setupDatabase = function(){
    // Check if table is already in DB
    dbORM.knex.schema.hasTable('apps_files').then(function(exists) {
        if (!exists) {
            return dbORM.knex.schema.createTable('apps_files', function(apps_files) {
                // Unique FileID
                apps_files.bigIncrements('id').primary().unsigned();
                // User owner ID
                apps_files.integer('uid').unique();
                // File name
                apps_files.string('file_name').index();
                apps_files.timestamps(); // created_at and updated_at
            }).then(function() {
                console.log('Database: apps_files table created!');
            }).catch(function(err) {
                console.log('Database: ERROR: ', err);
            });
        }
    });
};

// Any app scripts(depencies), CCS files that should be included in body
App.Apps.App["com.files"].Setup.prototype.setupIncludes = function(){

    var self = this;
    // Needed scripts
    var scripts = [
        '/apps/com.files/lib/javascript/globals.js',
        '/apps/com.files/lib/javascript/lib/utils/database.js',
        '/apps/com.files/lib/javascript/lib/utils/filesystem.js',        
        '/apps/com.files/lib/javascript/lib/utils/webserver.js',        
        '/apps/com.files/lib/javascript/frontend/models/explorer.items.js',
        '/apps/com.files/lib/javascript/frontend/models/breadcrumb.items.js',
        '/apps/com.files/lib/javascript/frontend/collections/explorer.collection.js',
        '/apps/com.files/lib/javascript/frontend/collections/breadcrumb.collection.js',
        '/apps/com.files/lib/javascript/frontend/views/breadcrumb.js',
        '/apps/com.files/lib/javascript/frontend/views/explorer.js',
        '/apps/com.files/lib/javascript/main.js'
    ];
    // Needed Styles
    var styles = [
        '/apps/com.files/lib/stylesheets/main.css'
    ];
    // Actually include them:
    if(scripts.length > 0){ 
        // Create external script tags
        _.each(scripts, function(script){
            App.Utils.Template.createHTMLTag(script, self.options["name-space"], "script");
        });
    }
    if(styles.length > 0){ 
        // Create external style tags
        _.each(styles, function(style){
            App.Utils.Template.createHTMLTag(style, self.options["name-space"], "style");
        });
    }

};