/* 
 * @Author: LogIN
 * @Date:   2014-08-20 14:41:55
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-28 10:06:52
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-20 14:41:55 The Chuppy Authors
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
// Global application apps/plugins related operations
Chuppy.Utils.Apps = {
    // Insert enabled application main javascript file into html
    // Called from: Chuppy.Apps.Private.initilizeUserApps
    initilizeApp: function(app) {
        this.initilizeAppHTML(app);
        this.initilizeAppDB(app);

    },
    // Inserts index.js app file into HTML
    initilizeAppHTML: function(app) {
        Chuppy.Utils.Template.createHTMLTag(app.path, app["name-space"], "script");
    },
    initilizeAppDB: function(app) {

        var user = Chuppy.Public.User.getUserKeys('userMain');
        var userApp = null;

        new Chuppy.Database.UserApps({
            "uid": user.userMain.id,
            "name-space": app["name-space"]
        }).fetch().then(function(model) {
            if (model !== null) {
                console.log("SYSTEM: Chuppy.Utils.Apps.initilizeAppDB: App DB is already initialized");
                userApp = {
                    "name-space": model.get('name-space'),
                    "order": model.get('order'),
                    "default": model.get('default')
                };
                // Save app in User App List
                Chuppy.Apps.Public.pushAppUserApp(_.extend(app, userApp)); 
            }else{
                new Chuppy.Database.UserApps({
                    "uid": user.userMain.id,
                    "name-space": app["name-space"],
                    "order": app.order,
                    "default": app.isDefault,
                    "enabled": app.enabled
                }).save().then(function(user_app) {

                    if (user_app === null) {
                        console.log("SYSTEM: Chuppy.Utils.Apps.initilizeAppDB: ERROR");
                        return;
                    }
                    // Save app in User App List
                    Chuppy.Apps.Public.pushAppUserApp(app);
                    console.log("System, Chuppy.Utils.Apps.initilizeAppDB: ", app["name-space"]);
                });
            }
        });

        
    },
    // Deletes Inserted application scripts from html and 
    // also deletes their objects 
    resetValues: function(appsList) {
        _.each(appsList, function(app) {
            console.log("Removing app:", app.path); 
            // Remove app internals
            if (Chuppy.Apps.App[app["name-space"]]) {
                Chuppy.Apps.App[app["name-space"]] = null;
            }
            // Delete nodes (application main file, any specific includes??)
            $("[data-id^='" + app["name-space"] + "']").each(function() {
                $(this).remove();
            });
            // Delete Object from Window
            delete Chuppy.Apps.App[app["name-space"]];
        });
    }
};
