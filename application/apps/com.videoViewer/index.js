/* 
 * @Author: LogIN
 * @Date:   2014-09-01 09:39:11
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-09-01 17:52:39
 * Use of this source code is governed by a license: 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014-09-01 09:39:11 The Chuppy Authors
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

// Define our app starting objects
// others are defined in lib/globals.js

Chuppy.Apps.App["com.videoViewer"] = {Main: {}, Setup: null};

Chuppy.Apps.App["com.videoViewer"].Setup = function(options){
    var self = this;
    self.videoViewer = null;

    self.options = {
        "name-space": "com.videoViewer",
        // Name variable of app (same as in i18n variable ) 
        "name": "videoViewer",
        // Path to the app folder default (/apps/{app.system.name})
        "path": "apps/com.videoViewer",
        // Is app enabled or disabled
        "enabled": true,
        "default": true,
        "order": 0,
        "icon": "apps/com.videoViewer/lib/images/favicon.png",
        // ID of parent application css container added dynamically from ApplicationBody.js main view
        // {container: "#application-tabs-" + uid}
        // But will always have #application-tabs[data-namespace='app.namespace']
        "uid": null,
        // Path to File/Directory if needed
        "filePath": null,
        // Path to File/Directory if needed
        "workspaceRoot": null
    };
    self.options = _.extend(this.options, options);
    console.info("App defaults videoViewer initialized!");
    console.info(self.options);

    // Setup needed database for app and include needed files (js/css)
    self.setupDependencies = function () {
        console.info("Setting up com.videoViewer dependencies");
        // main application template
        var template = _.template(Chuppy.Utils.FileSystem.readFileLocal('apps/com.videoViewer/lib/templates/main.tpl', 'sync'));
        $("#application-tabs-" + self.options.uid).html(template);
        
        self.setupIncludes();

    };
    // After successful app init this function is called
    // Here is a place where magic should happen
    self.initilizeAppUI = function () {
        var counter = 0;
        // Little Hack to display loading while waiting async operations
        var interval = setInterval(function() {
            if(counter === 100){
                console.log("App loading canceled");
                clearInterval(interval);
                return;
            }
            if (typeof Chuppy.Apps.App["com.videoViewer"].Main.Private !== "undefined") {     
                 if (typeof Chuppy.Apps.App["com.videoViewer"].Main.Private.Init === "function") {         
                    clearInterval(interval);
                    // Create our application object
                    self.videoViewer = new Chuppy.Apps.App["com.videoViewer"].Main.Private.Init(self.options);
                    // Render application
                    self.videoViewer.initialize();
                }else{
                    console.log("com.videoViewer Private.Init undefined");
                }
            }else{
                counter++;
                console.log("Loading application data");
            }
        }, 100);
    };
    // Remove current app dependencies 
    // Called from Chuppy.Utils.Apps
    self.removeView = function () {
        // Remove all HTML tags/includes by data-id
        Chuppy.Utils.Apps.resetValues([self.options]);
    };

};
// Any app scripts(depencies), CCS files that should be included in body
Chuppy.Apps.App["com.videoViewer"].Setup.prototype.setupIncludes = function(){

    var self = this;
    // Needed scripts
    var scripts = [
        'apps/com.videoViewer/lib/javascript/vendor/videojs/combined.video.js',
        'apps/com.videoViewer/lib/javascript/vendor/videojs/combined.languages.js',
        'apps/com.videoViewer/lib/javascript/globals.js',
        'apps/com.videoViewer/lib/javascript/frontend/models/videoFile.js',
        'apps/com.videoViewer/lib/javascript/frontend/views/header.js',
        'apps/com.videoViewer/lib/javascript/frontend/views/player.js',
        'apps/com.videoViewer/lib/javascript/main.js'
    ];
    // Needed Styles
    var styles = [
        'apps/com.videoViewer/lib/javascript/vendor/videojs/video-js.css',
        'apps/com.videoViewer/lib/stylesheets/main.css'
    ];
    // Actually include them:
    if(scripts.length > 0){ 
        // Create external script tags
        _.each(scripts, function(script){
            Chuppy.Utils.Template.createHTMLTag(script, self.options, "script");
        });
    }
    if(styles.length > 0){ 
        // Create external style tags
        _.each(styles, function(style){
            Chuppy.Utils.Template.createHTMLTag(style, self.options, "style");
        });
    }

};