/* 
 * @Author: LogIN
 * @Date:   2014-08-27 15:04:46
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-27 15:09:49
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-27 15:04:46 The Chuppy Authors
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
App.Apps.App["com.editorOdf"] = {
    Setup: null
};

App.Apps.App["com.editorOdf"].Setup = function(options) {
    var self = this;

    self.options = {
        // file-system name of app must be unique ("name-space") and app folder must have same name
        "name-space": "com.editorOdf",
        // Name variable of app (same as in i18n variable ) 
        "name": "editorOdf",
        // Path to the app folder default (/apps/{app.system.name})
        "path": "apps/com.editorOdf/index.js",
        // Is app enabled or disabled
        "enabled": true,
        // If system is true then this is default app
        "isDefault": false,
        "order": 1,
        // "icon": "/apps/com.files/lib/images/favicon.png"
        "icon": "lib/images/system-icons/system/holo_dark/10_device_access_storage/drawable-xhdpi/ic_action_storage.png",
        // Is app visible in menu?
        "visible": false,
        // ID of parent application css container added dynamically from ApplicationBody.js main view
        // {container: "#application-tabs-" + uid}
        // But will always have #application-tabs[data-namespace='app.namespace']
        "uid": null,
        // Path to File/Directory if needed
        "filePath": null
    };
    self.options = _.extend(this.options, options);

    console.info("App editorOdf defaults initialized!");
    // Setup needed database for app and include needed files (js/css)
    self.setupDependencies = function() {
        console.info("This app is external iframe and has no depencies");
    };
    // After successful app init this function is called
    // Here is a place where magic should happen
    self.initilizeAppUI = function() {
        console.info("Opening editorOdf File", self.options.filePath);

        $("#application-tabs-" + self.options.uid).html($('<iframe>', {
            class: "iframeViewer",
            src: "apps/" + self.options["name-space"] + "/index.html?cp=" + self.options.filePath,
            "nwdisable": "",
            "nwfaketop": ""
        }));

    };
    // Remove current app dependencies 
    // Called from App.Utils.Apps
    self.removeView = function() {
        // Remove all HTML tags/includes by data-id
        App.Utils.Apps.resetValues(['com.pdfViewer']);
    };

};
